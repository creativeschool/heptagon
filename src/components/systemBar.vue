<template>
  <v-system-bar app window style="-webkit-app-region: drag">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on" style="-webkit-app-region: no-drag">文件</v-btn>
      </template>
      <v-list dense>
        <v-list-item to="/login">
          <v-list-item-title>登陆</v-list-item-title>
        </v-list-item>
        <v-list-item @click="devTools">
          <v-list-item-title>开发者工具</v-list-item-title>
        </v-list-item>
        <v-list-item @click="close">
          <v-list-item-title>退出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    {{title}}{{ title ? ' - ' : '' }}教学资源开放平台
    <v-spacer></v-spacer>
    <v-icon icon @click="minimize" style="-webkit-app-region: no-drag">mdi-minus</v-icon>
    <v-icon icon @click="maximize" style="-webkit-app-region: no-drag">mdi-plus</v-icon>
    <v-icon icon @click="close" style="-webkit-app-region: no-drag">mdi-close</v-icon>
  </v-system-bar>
</template>

<script>
import { minimize, maximize, close, devTools } from '@/plugins/electron'
import { bus } from '@/plugins/bus'

export default {
  name: 'systemBar',
  data: () => ({
    title: ''
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
      bus.$emit('toast', '仅供开发人员使用')
      devTools()
    }
  },
  mounted () {
    bus.$on('title', title => {
      this.title = document.title = title
    })
  }
}
</script>
