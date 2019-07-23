<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-simple-table>
            <tbody>
              <tr>
                <td>课程名</td>
                <td>{{ $parent.course.name }}</td>
              </tr>
              <tr>
                <td>创建时间</td>
                <td>{{ formatDate($parent.course.created) }}</td>
              </tr>
              <tr>
                <td>更新时间</td>
                <td>{{ formatDate($parent.course.updated) }}</td>
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
                <td>{{ $parent.course._id }}</td>
              </tr>
            </tbody>
          </v-simple-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { formatDate } from '@/plugins/formatter'
import { bus } from '@/plugins/bus'
import { getPriv } from '@/db/ucmap'
import { get } from '@/db/config'

export default {
  name: 'index',
  props: ['id'],
  data: () => ({
    priv: {}
  }),
  methods: {
    async load () {
      this.priv = await getPriv(await get('current-user'), this.id)
      bus.$emit('title', '基本信息 - ' + this.$parent.course.name)
    },
    formatDate
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
