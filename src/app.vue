<template>
  <v-app>
    <system-bar></system-bar>
    <v-app-bar app>
      <v-toolbar-title>{{ appName }}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text to="/">首页</v-btn>
        <v-btn text to="/info" v-if="isDevelopment">同步信息</v-btn>
        <v-btn text to="/client" v-if="!isElectron">下载客户端</v-btn>
        <v-btn text to="/tool" v-else>实用工具</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content ref="content" class="main-content">
      <v-container fluid fill-height grid-list-md>
        <router-view/>
      </v-container>
    </v-content>

    <v-footer app padless>
      <v-flex text-center xs12>
        版本 {{ build.version }}.{{ build.hash }}-{{ build.branch }}({{ isElectron ? 'electron' : 'web' }})
      </v-flex>
    </v-footer>

    <v-snackbar v-model="snackbar" bottom right :timeout="5000">
      {{ toast }}
      <v-btn dark text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import systemBar from '@/components/systembar'
import { version } from '@/../package.json'
import { bus } from '@/plugins/bus'
import core from '@/plugins/core'
import { syncBaseUrl, syncAccessToken } from '@/plugins/axios'
import { handleError } from '@/plugins/error'
import { isLoggedIn, syncUser } from '@/db/user'
import { get } from '@/db/config'
import { syncUserUcmap } from '@/db/ucmap'
import { syncAllCourse } from '@/db/course'

/* global APP_NAME, GIT_HASH, GIT_BRANCH */

export default {
  name: 'app',
  components: {
    systemBar
  },
  data: () => ({
    toast: '',
    snackbar: false,
    loading: true,
    isElectron: process.env.IS_ELECTRON,
    isDevelopment: process.env.NODE_ENV !== 'production',
    appName: APP_NAME,
    build: {
      version,
      hash: GIT_HASH,
      branch: GIT_BRANCH
    }
  }),
  methods: {
    showToast (text) {
      this.snackbar = true
      this.toast = text
    }
  },
  async created () {
    bus.$on('toast', msg => this.showToast(msg))
    try {
      await syncBaseUrl()
      await syncAccessToken()
      if (await isLoggedIn()) {
        await syncUser(await get('current-user'))
        await syncUserUcmap()
        await syncAllCourse()
      }
    } catch (e) {
      core.showErrorBox('初始化错误', e.message)
      handleError(e)
      this.$router.replace('/settings')
    } finally {
      this.loading = false
    }
  },
  mounted () {
    this.$refs.content.$el.children[0].classList.add('main-content-wrap')
  },
  errorCaptured (err, vm, info) {
    this.showToast(err.message)
    handleError(err)
  }
}
</script>
