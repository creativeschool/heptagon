<template>
  <v-layout justify-space-around align-content-start>
    <v-flex xs12>
      <v-card>
        <v-card-title>课程信息</v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <th>名称</th>
              <th>标签</th>
              <th>更新</th>
              <th>创建</th>
            </thead>
            <tbody>
              <tr v-for="(course, i) in courses" :key="i">
                <th><router-link :to="'/course/' + course._id">{{ course.name }}</router-link></th>
                <th>
                  <v-chip v-for="(tag, i) in course.tags" :key="i">{{ tag }}</v-chip>
                </th>
                <th>{{ formatDate(course.updated) }}</th>
                <th>{{ formatDate(course.created) }}</th>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { courses } from '@/db/course'
import { formatDate } from '@/plugins/formatter'
import { isLoggedIn } from '@/db/user'
import { bus } from '@/plugins/bus'

export default {
  name: 'home',
  data: () => ({
    courses: []
  }),
  mounted () {
    this.loadLogin()
    this.loadCourse()
    bus.$emit('title', '')
  },
  methods: {
    async loadCourse () {
      this.courses = await courses.toArray()
    },
    async loadLogin () {
      if (!await isLoggedIn()) {
        this.$router.replace('/login')
      }
    },
    formatDate
  }
}
</script>
