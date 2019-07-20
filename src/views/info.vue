<template>
  <v-layout wrap align-content-start>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-card-title>同步操作</v-card-title>
        <v-card-text>
          <v-btn @click="syncCourse" class="ma-2">触发课程同步</v-btn>
          <v-btn @click="syncUser" class="ma-2">触发用户同步</v-btn>
          <br/>
          <v-btn color="error" @click="reinitDb" class="ma-2">重置数据库</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-card-title>
          数据库
          <v-spacer/>
          <v-btn icon @click="loadStats">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-simple-table dense>
            <thead>
              <tr>
                <th class="text-xs-left">数据库名</th>
                <th class="text-xs-left">记录总数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in stats" :key="i">
                <td>{{ item[0] }}</td>
                <td>{{ item[1] }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-card-title>
          日志
          <v-spacer/>
          <v-btn icon @click="loadLog">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn icon @click="exportLog">
            <v-icon>mdi-json</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table dense multi-sort :headers="logHeaders" :items="logs" item-key="id" show-group-by>
            <template v-slot:item.issuer="{ item }">
              <code>{{ item.issuer }}</code>
            </template>
            <template v-slot:item.created="{ item }">
              {{ formatDate(item.created) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-card-title>
          系统设置
          <v-spacer/>
          <v-btn icon @click="loadConfig">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-simple-table dense>
            <thead>
              <th>key</th>
              <th>value</th>
            </thead>
            <tbody>
              <tr v-for="(item, i) in configs" :key="i">
                <td><code>{{ item.key }}</code></td>
                <td><code>{{ item.value }}</code></td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { getStats } from '@/db/stats'
import { syncUser } from '@/db/user'
import { syncCourse } from '@/db/course'
import { configs } from '@/db/config'
import { logs } from '@/db/log'
import { reinit } from '@/db/dexie'
import { formatDate } from '@/plugins/formatter'
import { saveAs } from 'file-saver'
import { bus } from '@/plugins/bus'
import { syncBaseUrl, syncAccessToken } from '@/plugins/axios'

export default {
  name: 'info',
  data: () => ({
    stats: [],
    configs: [],
    logs: [],
    logHeaders: [
      { text: 'ID', value: 'id' },
      { text: '记录者', value: 'issuer' },
      { text: '时间', value: 'created' },
      { text: '内容', value: 'msg', sortable: false }
    ]
  }),
  mounted () {
    bus.$emit('title', '同步信息')
  },
  methods: {
    async loadStats () {
      this.stats = await getStats()
    },
    async loadConfig () {
      this.configs = await configs.toArray()
    },
    async loadLog () {
      this.logs = await logs.toArray()
    },
    async syncUser () {
      await syncUser()
    },
    async syncCourse () {
      await syncCourse()
    },
    async reinitDb () {
      await reinit()
      await syncBaseUrl()
      await syncAccessToken()
    },
    async exportLog () {
      await this.loadLog()
      saveAs(new Blob([JSON.stringify(this.logs)], { type: 'text/plain;charset=utf-8' }), 'logs.json')
    },
    formatDate
  }
}
</script>
