<template>
  <v-tab-item>
    <v-card-text>
      <v-alert :value="exist" type="warning">
        对应文件已经存在。上传将创建同名文件，请注意区分。
      </v-alert>
      <v-form v-model="validate">
        <v-text-field label="上传到" v-model="remote" :rules="[ validatePath ]"/>
        <v-file-input label="选择文件" v-model="file"/>
        <v-combobox label="标签" multiple chips/>
        <v-text-field label="文件名" v-model="filename"/>
        <v-text-field label="版本名" v-model="vername"/>
        <v-text-field label="类型" v-model="vertype"/>
        <v-checkbox label="添加公开EPDF版本" v-model="convert"/>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn color="primary" @click="create" :loading="loading" :disabled="!validate">上传</v-btn>
    </v-card-actions>
  </v-tab-item>
</template>

<script>
import { createFile } from '@/db/file'
import { provide } from '@/plugins/content'
import { bus } from '@/plugins/bus'
import { normalizePath } from '@/plugins/path'
import { provideOfficeEPDF } from '@/bin/officetopdf'

export default {
  name: 'fileUpload',
  data: () => ({
    remote: '/',
    tags: [],
    /** @type {File} */
    file: null,
    filename: '',
    vername: '',
    vertype: '',
    exist: false,
    convert: false,
    loading: false,
    validate: false
  }),
  props: ['id'],
  methods: {
    create () {
      this.loading = true
      // Make sure UI is updated
      setTimeout(() => {
        if (this.convert) {
          Promise.all([provide(this.file), provideOfficeEPDF(this.file.path)])
            .then(([o, c]) => {
              const convertVer = this.vername.startsWith('!') ? this.vername : '!' + this.vername
              return createFile(this.id, this.remote + this.filename, this.tags, [
                { hash: o, name: this.vername, type: this.vertype },
                { hash: c, name: convertVer, type: 'epdf' }
              ])
            })
            .then(() => {
              bus.$emit('toast', '上传成功')
              this.$router.push('/course/' + this.id + '/file')
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          provide(this.file)
            .then(hash => createFile(this.id, this.remote + this.filename, this.tags, [ { hash, name: this.vername, type: this.vertype } ]))
            .then(() => {
              bus.$emit('toast', '上传成功')
              this.$router.push('/course/' + this.id + '/file')
            })
            .finally(() => {
              this.loading = false
            })
        }
      }, 100)
    },
    validatePath () {
      return this.remote.endsWith('/') || '路径必须以/结尾'
    }
  },
  watch: {
    file: {
      handler () {
        if (this.file) {
          const selected = normalizePath(this.file.path)
          if (!this.filename) {
            const tokens = selected.substr(selected.lastIndexOf('/') + 1).split('.')
            if (tokens.length === 1) {
              this.filename = tokens[0]
              this.vername = '默认'
              this.vertype = 'plain'
            } else if (tokens.length === 2) {
              this.filename = tokens[0]
              this.vername = '默认'
              this.vertype = tokens[1]
            } else {
              this.filename = tokens.shift()
              this.vertype = tokens.pop()
              this.vername = tokens.join('.')
            }
          }
        }
      }
    }
  },
  created () {
    const query = this.$route.query
    this.remote = query.path || '/'
    this.filename = this.remote.substr(this.remote.lastIndexOf('/') + 1)
    this.remote = this.remote.substr(0, this.remote.length - this.filename.length)
  }
}
</script>
