<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-simple-table>
            <tbody>
              <tr>
                <td>课程名</td>
                <td>{{ course.name }}</td>
              </tr>
              <tr>
                <td>创建时间</td>
                <td>{{ formatDate(course.created) }}</td>
              </tr>
              <tr>
                <td>更新时间</td>
                <td>{{ formatDate(course.updated) }}</td>
              </tr>
              <tr>
                <td>文件操作限制前缀</td>
                <td>{{ priv.scope }}</td>
              </tr>
              <tr>
                <td>文件下载限制前缀</td>
                <td>{{ priv.allowver ? priv.allowver : '无限制' }}</td>
              </tr>
              <tr>
                <td>通知操作</td>
                <td>{{ priv.msg ? '允许' : '禁止' }}</td>
              </tr>
              <tr>
                <td>编号</td>
                <td>{{ course._id }}</td>
              </tr>
            </tbody>
          </v-simple-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { getCourse } from '@/db/course'
import { formatDate } from '@/plugins/formatter'
import { bus } from '@/plugins/bus'
import { getPriv } from '@/db/ucmap'
import { get } from '@/db/config'

export default {
  name: 'index',
  props: ['_id'],
  data: () => ({
    course: {},
    priv: {}
  }),
  methods: {
    async load () {
      this.course = await getCourse(this._id)
      this.priv = await getPriv(await get('current-user'), this._id)
      bus.$emit('title', '基本信息 - ' + this.course.name)
    },
    formatDate
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
