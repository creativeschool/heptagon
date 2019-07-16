<template>
  <v-layout wrap align-content-start>
    <v-flex xs12>
      <v-card class="ma-2">
        <v-card-title>数据库</v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-xs-left">数据库名</th>
                <th class="text-xs-left">记录总数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in stats" :key="item[0]">
                <td>{{ item[0] }}</td>
                <td>{{ item[1] }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card class="ma-2">
        <v-card-title>登陆信息</v-card-title>
        <v-card-text></v-card-text>
      </v-card>
    </v-flex>
    <v-overlay absolute :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-layout>
</template>

<script>
import { getStats } from "@/db/stats";

export default {
  name: "info",
  data: () => ({
    loading: true,
    stats: []
  }),
  async mounted(){
    this.stats = await getStats()
    this.loading = false
  }
};
</script>
