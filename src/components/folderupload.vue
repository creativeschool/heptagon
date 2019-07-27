<template>
  <v-tab-item>
    <v-card-text>
      <v-alert type="warning" :value="exist">
        这个文件夹下已经存在内容。<br/>
        系统支持同名文件，原有文件将被保留。
      </v-alert>
      说明：这个功能可以上传文件夹。<br/>
      版本名称将设置为“默认”。<br/>
      <template v-if="convert">
        对于所有支持的Office格式或pdf格式的课件，将转换为EPDF格式并作为“!公开”版本
      </template>
    </v-card-text>
    <v-card-text>
      <v-form v-model="validate">
        <v-text-field label="上传到" v-model="remote" :rules="[ validatePath ]"/>
        <v-combobox label="标签" multiple chips v-model="tags"/>
        <v-checkbox label="为可识别的课件自动添加公开保护版本" v-model="convert"/>
      </v-form>
    </v-card-text>
    <v-card-text class="logs">
      <template v-for="(log, i) in logs">
        {{ log }}<br :key="i"/>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" :loading="loading" :disabled="!validate" @click="upload">选择文件夹</v-btn>
    </v-card-actions>
  </v-tab-item>
</template>

<script>
import { showOpenDialog } from '@/plugins/dialog'
import { walkAsync } from '@/plugins/fs'
import { normalizePath } from '@/plugins/path'
import { createJobCreator } from '@/plugins/content'

export default {
  name: 'folderUpload',
  data: () => ({
    remote: '/',
    tags: [],
    convert: false,
    loading: false,
    validate: false,
    exist: false,
    logs: []
  }),
  props: ['id'],
  methods: {
    async upload () {
      this.loading = true
      try {
        const paths = await showOpenDialog({ properties: ['openDirectory'] })
        const [succ, fail] = await walkAsync(paths[0])
        this.logs.push(...fail.map(([a, b]) => `文件${b}打开失败: ${a}`))
        this.logs.push(`找到${succ.length}文件，失败${fail.length}文件`)
        const npath = normalizePath(paths[0])
        const createJob = createJobCreator(this.id, this.tags, this.remote, npath)
        await Promise.all(succ.map(async p => this.logs.push(await createJob(p))))
      } finally {
        this.loading = false
      }
    },
    validatePath () {
      return this.remote.endsWith('/') || '路径必须以/结尾'
    }
  },
  created () {
    const query = this.$route.query
    this.remote = query.path || '/'
    this.remote = this.remote.substr(0, this.remote.lastIndexOf('/') + 1)
  }
}
</script>

<style scoped>
.logs {
  max-height: 200px;
  overflow: auto;
  font-family: 'Courier New', Courier, monospace;
}
</style>
