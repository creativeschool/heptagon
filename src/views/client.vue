<template>
  <v-layout justify-space-around align-center>
    <v-flex xs12 sm6 md4 lg3 xl2>
      <v-card>
        <v-card-title>
          <v-spacer/>
          <v-icon size="5em">mdi-download-network</v-icon>
          <v-spacer/>
        </v-card-title>
        <v-card-title>
          <v-spacer/>
          客户端下载
          <v-spacer/>
        </v-card-title>
        <v-card-text class="text-center">
          <strong>由于安全原因，以下功能需要安装客户端:</strong><br/>
          文件上传/文件夹上传<br/>
          文件下载/文件夹下载<br/>
          <strong>请访问<a href="https://github.com/creativeschool/heptagon/releases/latest" target="_blank">Github Release</a>下载最新客户端</strong>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { bus } from '@/plugins/bus'

export default {
  name: 'client',
  created () {
    bus.$emit('title', '下载客户端')
  }
}
</script>
