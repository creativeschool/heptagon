<template>
  <v-layout align-content-start justify-space-between wrap>
    <v-flex xs12 lg4 class="pa-2">
      <v-card>
        <v-card-title>
          课程信息
          <v-spacer/>
          <v-btn text :to="'/course/' + _id + '/member'">人员信息</v-btn>
        </v-card-title>
        <v-card-text>
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
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 lg4 class="pa-2">
      <v-card>
        <v-card-title>
          最近通知
          <v-spacer/>
          <v-btn text :to="'/course/' + _id + '/msg'">通知列表</v-btn>
        </v-card-title>
        <v-card-text></v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 lg4 class="pa-2">
      <v-card>
        <v-card-title>
          最近文件
          <v-spacer/>
          <v-btn text :to="'/course/' + _id + '/file'">文件列表</v-btn>
        </v-card-title>
        <v-card-text>
          <v-simple-table dense>
            <thead>
              <th>路径</th>
              <th>更新时间</th>
            </thead>
            <tbody>
              <tr v-for="(file, i) in recentFiles" :key="i">
                <td>{{ file.path }}</td>
                <td>{{ formatDate(file.updated) }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { getCourse } from '@/db/course'
import { syncFile, files } from '@/db/file'
import { formatDate } from '@/plugins/formatter'
import { bus } from '@/plugins/bus'
import { getPriv } from '../../db/ucmap'
import { get } from '../../db/config'

export default {
  name: 'course',
  props: ['_id'],
  data: () => ({
    course: {},
    priv: {},
    recentFiles: []
  }),
  methods: {
    async load () {
      this.course = await getCourse(this._id)
      this.priv = await getPriv(await get('current-user'), this._id)
      await this.syncFile()
      await this.loadFile()
      bus.$emit('title', this.course.name)
    },
    async syncFile () {
      await syncFile(this._id)
    },
    async loadFile () {
      const count = await files.count()
      const skip = Math.max(0, count - 10)
      this.recentFiles = await files.orderBy('updated').offset(skip).toArray()
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
