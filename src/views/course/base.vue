<template>
  <v-layout align-content-start justify-space-between wrap>
    <v-flex xs12 lg2 class="pa-2">
      <v-card>
        <v-card-title>
          {{ course.name }}
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item :to="`/course/${_id}`">
              <v-list-item-title>基本信息</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/course/${_id}/member`">
              <v-list-item-title>成员列表</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/course/${_id}/msg`">
              <v-list-item-title>消息通知</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/course/${_id}/file`">
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
import { getCourse } from '@/db/course'
import { formatDate } from '@/plugins/formatter'
import { bus } from '@/plugins/bus'
import { getPriv } from '../../db/ucmap'
import { get } from '../../db/config'

export default {
  name: 'course',
  props: ['_id'],
  data: () => ({
    course: {},
    priv: {}
  }),
  methods: {
    async load () {
      this.course = await getCourse(this._id)
      this.priv = await getPriv(await get('current-user'), this._id)
      bus.$emit('title', this.course.name)
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
