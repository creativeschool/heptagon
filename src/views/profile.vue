<template>
  <v-layout wrap align-content-start>
    <v-flex>
      <v-card>
        <v-card-title>基本信息</v-card-title>
        <v-card-text>
          <v-text-field :error="prerr" type="email" label="邮箱" v-model="email"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="error" outlined @click="load">重置</v-btn>
          <v-btn color="primary" @click="edit" :loading="editing">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <v-card-title>修改密码</v-card-title>
        <v-card-text>
          <v-text-field :error="pwerr" type="password" label="原密码" v-model="pwold"/>
          <v-text-field type="password" label="新密码" v-model="pwnew"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="chpwd" :loading="pwld">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <v-card-title>登出</v-card-title>
        <v-card-text>
          登出后，所有的本地设置将丢失。下载的文件不会删除。
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-menu offset-y :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-btn color="warning" v-on="on">登出</v-btn>
            </template>
            <v-card class="pa-2">
              <v-text-field v-model.lazy="logoutConfirm" color="error" label="输入您的用户名以登出"/>
            </v-card>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate/>
    </v-overlay>
  </v-layout>
</template>

<script>
import { get } from '@/db/config'
import { getUser, chpwd, editProfile, isLoggedIn } from '@/db/user'
import { reinit } from '@/db/dexie'
import { syncAccessToken, syncBaseUrl } from '@/plugins/axios'
import { bus } from '@/plugins/bus'

export default {
  name: 'profile',
  data: () => ({
    email: '',
    editing: false,
    prerr: false,
    pwold: '',
    pwnew: '',
    pwerr: false,
    pwld: false,
    logoutConfirm: '',
    logoutAnswer: '',
    overlay: false
  }),
  created () {
    isLoggedIn()
      .then(x => {
        if (x) {
          this.load()
          get('current-user')
            .then(id => getUser(id))
            .then(({ name }) => {
              this.logoutAnswer = name
            })
        } else {
          this.$router.replace('/')
        }
      })
  },
  methods: {
    load () {
      bus.$emit('title', '修改用户信息')
      get('current-user')
        .then(id => getUser(id))
        .then(user => {
          this.email = user.email
        })
        .finally(() => {
          this.prerr = false
        })
    },
    clear () {
      this.pwold = this.pwnew = ''
      this.pwerr = false
    },
    edit () {
      this.editing = true
      editProfile(this.email)
        .then(() => {
          this.prerr = false
          bus.$emit('toast', '成功')
        })
        .catch(e => {
          bus.$emit('toast', e.message)
          this.prerr = true
        })
        .finally(() => {
          this.editing = false
        })
    },
    chpwd () {
      this.pwld = true
      chpwd(this.pwold, this.pwnew)
        .then(() => syncAccessToken())
        .then(() => {
          this.pwerr = false
          bus.$emit('toast', '成功')
        })
        .catch(e => {
          bus.$emit('toast', e.message)
          this.pwerr = true
        })
        .finally(() => {
          this.pwld = false
        })
    }
  },
  watch: {
    logoutConfirm: {
      async handler () {
        if (this.logoutConfirm.toLowerCase() === this.logoutAnswer.toLowerCase()) {
          await reinit()
          await syncBaseUrl()
          await syncAccessToken()
          this.$router.replace('/')
        }
      }
    }
  }
}
</script>
