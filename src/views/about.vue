<template>
  <v-layout align-center justify-center>
    <v-flex xs12 md6 lg4 xl3>
      <v-card>
        <v-card-title>关于</v-card-title>
        <v-card-text>
          <v-layout justify-center>
            <img src="@/../public/logo.png" class="logo"/>
          </v-layout>
          <v-layout justify-center>
            版本： {{ version }}
          </v-layout>
          <v-card-title>特别支持</v-card-title>
          <v-layout justify-space-around align-start>
            <v-flex xs4 class="pa-4">
              <img src="@/assets/vue.png" width="100%" @click="openUrl('https://vuejs.org/')" style="cursor: pointer" class="dep"/>
            </v-flex>
            <v-flex xs4 class="pa-4">
              <img src="@/assets/vuetify.png" width="100%" @click="openUrl('https://vuetifyjs.com')" style="cursor: pointer" class="dep"/>
            </v-flex>
            <v-flex xs4 class="pa-4">
              <img src="@/assets/electron.png" width="100%" @click="openUrl('https://electronjs.org/')" style="cursor: pointer" class="dep"/>
            </v-flex>
          </v-layout>
          <v-card-title>详细版本</v-card-title>
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
import { version } from '@/../package.json'
import { bus } from '@/plugins/bus'

export default {
  name: 'about',
  data: () => ({
    versions: [],
    version
  }),
  mounted () {
    for (const key in versions) {
      this.versions.push([key, versions[key]])
    }
    bus.$emit('title', '关于')
  },
  methods: {
    openUrl
  }
}
</script>

<style>
.logo {
  max-width: 256px;
  max-height: 256px;
}
.dep {
  max-width: 128px;
  max-height: 128px;
}
</style>
