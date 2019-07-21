<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-data-table :headers="headers" :items="users">
          <template v-slot:item.created="{ item }">
            {{ formatDate(item.created) }}
          </template>
          <template v-slot:item.updated="{ item }">
            {{ formatDate(item.updated) }}
          </template>
          <template v-slot:item.tags="{ item }">
            {{ item.tags.join(', ') }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { syncCourseUcmap } from '@/db/ucmap'
import { getUsersFromCourse, getCourse } from '@/db/course'
import { formatDate } from '@/plugins/formatter'
import { bus } from '@/plugins/bus'

export default {
  name: 'member',
  props: ['_id'],
  data: () => ({
    users: [],
    course: {},
    loading: false,
    headers: [
      { text: '名称', value: 'name' },
      { text: '登录号', value: 'login' },
      { text: '邮箱', value: 'email' },
      { text: '创建', value: 'created' },
      { text: '更新', value: 'updated' },
      { text: '标签', value: 'tags', sortable: false }
    ]
  }),
  methods: {
    async load () {
      this.course = await getCourse(this._id)
      this.users = await getUsersFromCourse(this._id)
      bus.$emit('title', '成员列表 - ' + this.course.name)
    },
    async sync () {
      this.loading = true
      await syncCourseUcmap(this._id)
      this.loading = false
    },
    formatDate
  },
  watch: {
    _id: {
      immediate: true,
      handler () {
        this.load()
      }
    }
  }
}
</script>
