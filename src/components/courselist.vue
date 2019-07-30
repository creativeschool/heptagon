<template>
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
</template>

<script>
import { syncAllCourse, courses } from '@/db/course'
import { formatDate } from '@/plugins/formatter'

export default {
  name: 'courseList',
  data: () => ({
    courses: []
  }),
  methods: {
    async load () {
      await syncAllCourse()
      this.courses = await courses.toArray()
    },
    formatDate
  },
  created () {
    this.load()
  }
}
</script>
