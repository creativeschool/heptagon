<template>
  <v-layout justify-center align-center>
    <v-flex sm12 xs3 lg4>
      <v-card>
        <v-card-title>登录</v-card-title>
        <v-card-text>
          <v-alert v-if="loggedIn" type="warning">您已经登录。反复登录将被记录，且会丢失本地设置。</v-alert>
          <v-text-field v-model="name" :error="error" label="登录名" :disabled="loading" />
          <v-text-field v-model="pass" :error="error" type="password" label="密码" :disabled="loading" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :color="loggedIn ? 'warning' : 'primary'" :loading="loading" @click="login" :outlined="loggedIn">{{ loggedIn ? '丢失本地数据并登录' : '登录' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { login, isLoggedIn, syncUser, getTokenDetails } from '@/db/user'
import { bus } from '@/plugins/bus'
import { syncCourse } from '../db/course'

export default {
  name: 'login',
  data: () => ({
    name: '',
    pass: '',
    loading: false,
    error: false,
    loggedIn: false
  }),
  methods: {
    async login () {
      this.loading = true
      try {
        await login(this.name, this.pass)
        await getTokenDetails()
        await syncUser()
        await syncCourse()
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
  mounted () {
    isLoggedIn().then(x => {
      this.loggedIn = x
    })
  }
}
</script>
