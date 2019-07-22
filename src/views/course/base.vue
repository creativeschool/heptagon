<template>
  <v-layout align-content-start justify-space-between wrap>
    <v-flex xs12 lg2 class="pa-2">
      <v-card>
        <v-card-title>
          {{ course.name }}
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item :to="`/course/${id}`" exact>
              <v-list-item-title>基本</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/course/${id}/member`" exact>
              <v-list-item-title>成员</v-list-item-title>
            </v-list-item>
            <v-list-group>
              <template v-slot:activator>
                <v-list-item-title>通知</v-list-item-title>
              </template>
              <v-list-item :to="`/course/${id}/msg`" exact>
                <v-list-item-title>通知列表</v-list-item-title>
              </v-list-item>
              <v-list-item :to="`/course/${id}/msg/new`" exact>
                <v-list-item-title>新建通知</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group>
              <template v-slot:activator>
                <v-list-item-title>文件</v-list-item-title>
              </template>
              <v-list-item :to="`/course/${id}/file`" exact>
                <v-list-item-title>文件管理</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" @click="sync" :disabled="!this.id" :loading="loading">同步</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 lg10>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { getCourse, syncCourse } from '@/db/course'
import { bus } from '@/plugins/bus'

export default {
  name: 'course',
  props: ['id'],
  data: () => ({
    course: {},
    loading: false
  }),
  methods: {
    async load () {
      this.course = await getCourse(this.id)
      bus.$emit('title', this.course.name)
    },
    async sync () {
      this.loading = true
      await syncCourse(this.id)
      bus.$emit('course-sync')
      this.loading = false
    }
  },
  created () {
    bus.$on('course-sync', this.load)
  },
  beforeDestroy () {
    bus.$off('course-sync', this.load)
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
