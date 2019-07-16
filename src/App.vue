<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>教学资源开放平台</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text to="/">首页</v-btn>
        <v-btn text to="/login" v-if="!loggedIn">登陆</v-btn>
        <v-btn text to="/info">同步信息</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <!-- -->
    </v-footer>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { isLoggedIn } from "@/db/user";

export default {
  name: "App",
  data: () => ({
    loading: true,
    loggedIn: false
  }),
  async mounted() {
    this.loggedIn = await isLoggedIn()
    this.loading = false
  },
  methods: {
    //
  }
}
</script>
