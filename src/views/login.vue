<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6 lg4 xl3>
      <v-card>
        <v-img height="200px" class="white--text" :src="require('@/assets/login.jpg')">
          <v-card-title class="align-end fill-height">登录</v-card-title>
        </v-img>
        <v-card-text>
          <v-alert :value="loggedIn" type="warning" prominent >您已经登录。反复登录将被记录，且会丢失本地设置。</v-alert>
          <v-text-field v-model="login" :error="error" label="登录名" :disabled="loading" />
          <v-text-field v-model="pass" :error="error" type="password" label="密码" :disabled="loading" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :color="loggedIn ? 'warning' : 'primary'" :loading="loading" @click="signin" :outlined="loggedIn">{{ loggedIn ? '丢失本地数据并登录' : '登录' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { signin, isLoggedIn, syncUser, getTokenDetails } from '@/db/user'
import { bus } from '@/plugins/bus'
import { syncAccessToken } from '@/plugins/axios'
import { get } from '@/db/config'
import { syncUserUcmap } from '@/db/ucmap'
import { syncAllCourse } from '@/db/course'

export default {
  name: 'login',
  data: () => ({
    login: '',
    pass: '',
    loading: false,
    error: false,
    loggedIn: false
  }),
  methods: {
    async signin () {
      this.loading = true
      try {
        await signin(this.login, this.pass)
        await syncAccessToken()
        await getTokenDetails()
        await syncUser(await get('current-user'))
        await syncUserUcmap()
        await syncAllCourse()
        bus.$emit('toast', '欢迎！')
        this.$router.replace('/')
      } catch (e) {
        bus.$emit('toast', '登录错误')
        this.error = true
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    isLoggedIn().then(x => {
      this.loggedIn = x
    })
    bus.$emit('title', '登录')
  }
}
</script>
