<template>
  <v-app>
    <system-bar></system-bar>
    <v-app-bar app>
      <v-toolbar-title>教学资源开放平台</v-toolbar-title>
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
      <v-flex text-xs-center xs12>
        版本 {{ version }}.{{ isElectron ? 'electron' : 'web' }}
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
import { syncCourse } from '@/db/course'

export default {
  name: 'App',
  components: {
    systemBar
  },
  data: () => ({
    toast: '',
    snackbar: false,
    version,
    loading: true,
    isElectron
  }),
  methods: {
    showToast (text) {
      this.snackbar = true
      this.toast = text
    }
  },
  async created () {
    try {
      await syncBaseUrl()
      await syncAccessToken()
      if (await isLoggedIn()) {
        await syncUser()
        await syncCourse()
      }
      this.loading = false
    } catch (e) {
      showErrorBox('初始化错误', e.message)
    }
  },
  mounted () {
    bus.$on('toast', msg => this.showToast(msg))
  },
  errorCaptured (err, vm, info) {
    console.log(info)
    this.showToast(err.message)
  }
}
</script>
