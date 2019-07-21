<template>
  <v-system-bar app window style="-webkit-app-region: drag">
    <v-avatar size="32" class="mr-2">
      <img src="../../public/logo.png"/>
    </v-avatar>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text color="primary" v-on="on" style="-webkit-app-region: no-drag">文件</v-btn>
      </template>
      <v-list dense>
        <v-list-item to="/login">
          <v-list-item-title>登录</v-list-item-title>
        </v-list-item>
        <v-list-item to="/settings">
          <v-list-item-title>设置</v-list-item-title>
        </v-list-item>
        <v-divider/>
        <v-list-item @click="devTools">
          <v-list-item-title>开发者工具</v-list-item-title>
        </v-list-item>
        <v-list-item @click="close">
          <v-list-item-title>退出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on" style="-webkit-app-region: no-drag">帮助</v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="openUrl('https://github.com/creativeschool/heptagon')">
          <v-list-item-title>开源项目</v-list-item-title>
        </v-list-item>
        <v-list-item @click="openUrl('https://github.com/creativeschool/heptagon/blob/master/LICENSE')">
          <v-list-item-title>开源许可</v-list-item-title>
        </v-list-item>
        <v-list-item to="/about">
          <v-list-item-title>关于</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer/>
    {{ systemTitle }}
    <v-spacer/>
    <current-user/>
    <v-icon v-if="isElectron" @click="minimize" style="-webkit-app-region: no-drag">mdi-minus</v-icon>
    <v-icon v-if="isElectron" @click="maximize" style="-webkit-app-region: no-drag">mdi-plus</v-icon>
    <v-icon v-if="isElectron" @click="close" style="-webkit-app-region: no-drag">mdi-close</v-icon>
  </v-system-bar>
</template>

<script>
import { minimize, maximize, close, devTools, openUrl, isElectron } from '@/plugins/electron'
import { bus } from '@/plugins/bus'
import currentUser from '@/components/currentuser.vue'

/* global APP_NAME */

export default {
  name: 'systemBar',
  components: {
    currentUser
  },
  data: () => ({
    title: '',
    isElectron
  }),
  methods: {
    minimize () {
      minimize()
    },
    maximize () {
      maximize()
    },
    close () {
      close()
    },
    devTools () {
      devTools()
    },
    openUrl
  },
  computed: {
    systemTitle () {
      return `${this.title}${this.title ? ' - ' : ''}${APP_NAME}`
    }
  },
  mounted () {
    bus.$on('title', title => {
      this.title = title
      if (isElectron) {
        document.title = title
      } else {
        document.title = this.systemTitle
      }
    })
  }
}
</script>
