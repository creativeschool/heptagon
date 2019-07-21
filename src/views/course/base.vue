<template>
  <v-layout align-content-start justify-space-between wrap>
    <v-flex xs12 lg2 class="pa-2">
      <v-card>
        <v-card-title>
          {{ course.name }}
          <v-spacer/>
          <v-btn icon @click="sync" :disabled="!this._id" :loading="loading">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item :to="`/course/${_id}`" exact>
              <v-list-item-title>基本信息</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/course/${_id}/member`" exact>
              <v-list-item-title>成员列表</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/course/${_id}/msg`" exact>
              <v-list-item-title>消息通知</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/course/${_id}/file`" exact>
              <v-list-item-title>文件管理</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 lg10 class="pa-2">
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
  props: ['_id'],
  data: () => ({
    course: {},
    loading: false
  }),
  methods: {
    async load () {
      this.course = await getCourse(this._id)
      bus.$emit('title', this.course.name)
    },
    async sync () {
      this.loading = true
      await syncCourse(this._id)
      bus.$emit('course-sync')
      this.loading = false
    }
  },
  mounted () {
    bus.$on('course-sync', this.load)
  },
  beforeDestroy () {
    bus.$off('course-sync', this.load)
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
