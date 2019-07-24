<template>
  <v-layout wrap>
    <v-flex xs12 class="pb-2">
      <v-card>
        <v-data-table :headers="headers" :items="users" :footer-props="{ showFirstLastPage: true, showCurrentPage: true }">
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
    <v-flex xs12 class="pb-2">
      <v-card>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="port" color="success">导出名单</v-btn>
          <v-btn @click="load" color="primary">同步成员</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { syncCourseUcmap } from '@/db/ucmap'
import { getUsersFromCourse, syncAllUserFromCourse } from '@/db/course'
import { formatDate } from '@/plugins/formatter'
import { bus } from '@/plugins/bus'

export default {
  name: 'member',
  props: ['id'],
  data: () => ({
    users: [],
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
      this.loading = true
      await syncCourseUcmap(this.id)
      await syncAllUserFromCourse(this.id)
      this.users = await getUsersFromCourse(this.id)
      this.loading = false
      bus.$emit('title', '成员列表 - ' + this.$parent.course.name)
    },
    port () {
      //
    },
    formatDate
  },
  watch: {
    id: {
      immediate: true,
      handler () {
        this.load()
      }
    }
  }
}
</script>
