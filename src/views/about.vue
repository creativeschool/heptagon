<template>
  <v-layout align-center justify-center>
    <v-flex xs12 md6 lg4 xl3>
      <v-card>
        <v-card-title>关于</v-card-title>
        <v-card-text>
          <v-layout justify-space-between align-content-start>
            <v-flex xs4 class="pa-4">
              <img src="@/assets/vue.png" width="100%" @click="openUrl('https://vuejs.org/')" style="cursor: pointer"/>
            </v-flex>
            <v-flex xs4 class="pa-4">
              <img src="@/assets/vuetify.png" width="100%" @click="openUrl('https://vuetifyjs.com')" style="cursor: pointer"/>
            </v-flex>
            <v-flex xs4 class="pa-4">
              <img src="@/assets/electron.png" width="100%" @click="openUrl('https://electronjs.org/')" style="cursor: pointer"/>
            </v-flex>
          </v-layout>
          <v-simple-table dense>
            <tbody>
              <tr v-for="(ver, i) in versions" :key="i">
                <td>{{ ver[0] }}</td>
                <td>{{ ver[1] }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn outlined color="error" @click="openUrl('https://blog.zhangzisu.cn')">Made with ❤ by ZhangZisu</v-btn>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { versions, openUrl } from '@/plugins/electron'

export default {
  name: 'about',
  data: () => ({
    versions: []
  }),
  mounted () {
    for (const key in versions) {
      this.versions.push([key, versions[key]])
    }
  },
  methods: {
    openUrl
  }
}
</script>
