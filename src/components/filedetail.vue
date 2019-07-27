<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab :key="0">详细</v-tab>
      <v-tab :key="1" :disabled="!showEdit">编辑</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :key="0">
        <v-card-title>
          <div>
            <div class="title" v-text="name"/>
            <div class="subtitle-1" v-text="folder"/>
          </div>
        </v-card-title>
        <v-card-text>
          <template v-if="file.tags.length">
            <v-chip label v-for="(tag, i) in file.tags" :key="i">
              {{ tag }}
            </v-chip>
          </template>
          <template v-else>
            无标签
          </template>
        </v-card-text>
        <v-divider/>
        <v-card-text>
          <v-chip outlined>
            <v-icon>publish</v-icon>
            {{ formatDate(file.created) }}
          </v-chip>
          <v-chip outlined>
            <v-icon>mdi-email-edit</v-icon>
            {{ formatDate(file.updated) }}
          </v-chip>
        </v-card-text>
        <v-divider/>
        <v-card-text>
          <template v-if="file.versions.length">
            版本
            <v-list two-line subheader>
              <template v-for="(version, i) in file.versions">
                <v-list-item :key="i" v-if="showEdit || version.name.startsWith('!')">
                  <v-list-item-avatar>
                    <v-icon>{{ fileIcon(version.type) }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ version.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ version.type || '未知类型' }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="download(i)">
                      <v-icon>mdi-download-network</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </template>
          <template v-else>
            无版本
          </template>
        </v-card-text>
      </v-tab-item>
      <v-tab-item :key="1">
        <v-card-text>
          <v-text-field :disabled="loading" v-model="path" label="路径" :rules="[ validPath ]"/>
          <v-combobox :disabled="loading" v-model="tags" label="标签" multiple chips/>
        </v-card-text>
        <v-card-text v-for="(version, i) in versions" :key="i">
          <v-card-title>
            # {{ i }}
            <v-spacer/>
            <v-tooltip bottom v-if="version.name.startsWith('!')">
              <template v-slot:activator="{ on }">
                <v-btn icon color="warning" v-on="on" @click="version.name = version.name.substr(1)">
                  <v-icon>mdi-lock-open-outline</v-icon>
                </v-btn>
              </template>
              <span>以!开头的版本可以被学生下载</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-btn icon color="success" v-on="on" @click="version.name = '!' + version.name">
                  <v-icon>mdi-lock-outline</v-icon>
                </v-btn>
              </template>
              <span>不以!开头的版本无法被下载</span>
            </v-tooltip>
            <v-btn icon color="error" @click="versions.splice(i, 1)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-container grid-list-xl fluid>
            <v-layout wrap>
              <v-flex xs6>
                <v-text-field :disabled="loading" v-model="version.name" label="版本名"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field :disabled="loading" v-model="version.type" label="文件类型"/>
              </v-flex>
            </v-layout>
          </v-container>
          <v-file-input :disabled="loading" v-model="version.file" label="选择文件" :placeholder="version.hash ? '若不希望替换请勿选择' : ''"/>
          <v-divider/>
        </v-card-text>
        <v-card-actions>
          <v-file-input :disabled="loading" label="新版本" v-model="newVersion" prepend-icon="mdi-plus"/>
          <v-spacer/>
          <v-btn color="error" @click="load" :disabled="loading">重置</v-btn>
          <v-btn color="primary" @click="save" :loading="loading">提交</v-btn>
        </v-card-actions>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { files, editFile, getDownloadToken } from '@/db/file'
import { getCurrentPriv } from '@/db/ucmap'
import { formatDate } from '@/plugins/formatter'
import { fileIcon } from '@/plugins/icons'
import { axios } from '@/plugins/axios'
import core from '@/plugins/core'

export default {
  name: 'fileDetail',
  props: ['id'],
  data: () => ({
    /** @type {import('@/db/file').File} */
    file: { tags: [], versions: [] },
    path: '',
    name: '',
    folder: '',
    tags: [],
    versions: [],
    tab: 0,
    showEdit: false,
    scope: '',
    loading: false,
    /** @type {File} */
    newVersion: null
  }),
  methods: {
    async load () {
      this.file = await files.get(this.id)
      this.path = this.file.path
      this.name = this.path.substr(this.path.lastIndexOf('/') + 1)
      this.folder = this.path.substr(0, this.path.length - this.name.length)
      this.tags = this.file.tags
      this.versions = this.file.versions
      const priv = await getCurrentPriv(this.file.course)
      this.scope = priv.scope
      this.showEdit = this.file.path.startsWith(this.scope)
    },
    async save () {
      this.loading = true
      editFile(this.id, this.path, this.tags, this.versions)
        .then(this.load)
        .then(() => this.$emit('update'))
        .finally(() => { this.loading = false })
    },
    formatDate,
    fileIcon,
    validPath () {
      return this.path.startsWith(this.scope) || `路径必须位于\`${this.scope}\`下`
    },
    async download (version) {
      const token = await getDownloadToken(this.id, version)
      const filename = `${this.file.versions[version].name}.${this.file.versions[version].type}`
      const url = axios.defaults.baseURL + '/download/' + token + '?filename=' + filename
      core.openUrl(url)
    }
  },
  created () {
    this.load()
  },
  watch: {
    newVersion: {
      handler () {
        if (this.newVersion) {
          const path = process.platform === 'win32' ? this.newVersion.path.replace(/\\/g, '/') : this.newVersion.path
          const name = path.substr(path.lastIndexOf('/') + 1)
          const ext = name.substr(name.lastIndexOf('.') + 1)
          this.versions.push({
            name: name.substr(0, name.length - ext.length - 1),
            type: ext,
            file: this.newVersion
          })
        }
      }
    }
  }
}
</script>
