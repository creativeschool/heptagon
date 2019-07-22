<template>
  <v-app>
    <system-bar></system-bar>
    <v-app-bar app>
      <v-toolbar-title>{{ appName }}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text to="/">首页</v-btn>
        <v-btn text to="/info">同步信息</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
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
import { bus } from '@/plugins/bus'
import systemBar from '@/components/systembar'
import { version } from '@/../package.json'
import { showErrorBox, isElectron } from '@/plugins/electron'
import { syncBaseUrl, syncAccessToken } from '@/plugins/axios'
import { isLoggedIn, syncUser } from '@/db/user'
import { get } from './db/config'
import { syncUserUcmap } from './db/ucmap'
import { syncAllCourse } from './db/course'

/* global APP_NAME, GIT_HASH, GIT_BRANCH */

export default {
  name: 'App',
  components: {
    systemBar
  },
  data: () => ({
    toast: '',
    snackbar: false,
    loading: true,
    isElectron,
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
      showErrorBox('初始化错误', e.message)
      this.$router.replace('/settings')
    } finally {
      this.loading = false
    }
  },
  errorCaptured (err, vm, info) {
    console.log(info)
    this.showToast(err.message)
  }
}
</script>
