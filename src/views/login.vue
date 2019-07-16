<template>
  <v-layout justify-center align-center>
    <v-flex sm12 xs3 lg4>
      <v-card>
        <v-card-title>登录</v-card-title>
        <v-card-text>
          <v-text-field v-model="name" :error="error" placeholder="您的登录名" label="登录名" :disabled="loading" />
          <v-text-field v-model="pass" :error="error" type="password" label="密码" :disabled="loading" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :loading="loading" @click="login">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { login } from '../db/user'

export default {
  name: 'login',
  data: () => ({
    name: '',
    pass: '',
    loading: false,
    error: false
  }),
  methods: {
    async login () {
      this.loading = true
      try {
        await login(this.name, this.pass)
        this.$router.replace('/')
      } catch (e) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
