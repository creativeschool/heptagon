<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-title>设置</v-card-title>
        <v-card-text>
          <v-text-field label="服务器" v-model="baseurl" placeholder="留空使用默认值"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="apply">应用</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { bus } from '@/plugins/bus'
import { set, get, reset } from '@/db/config'
import { syncBaseUrl } from '@/plugins/axios'

export default {
  name: 'settings',
  data: () => ({
    baseurl: null
  }),
  mounted () {
    this.load()
    bus.$emit('title', '设置')
  },
  methods: {
    async load () {
      this.baseurl = await get('base-url')
    },
    async apply () {
      if (this.baseurl) {
        await set('base-url', this.baseurl)
      } else {
        await reset('base-url')
      }
      await syncBaseUrl()
      bus.$emit('toast', '设置更新成功')
    }
  }
}
</script>
