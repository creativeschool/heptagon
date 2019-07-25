<template>
  <v-card>
    <v-card-title>
      <div>
        <div class="title" v-text="name"/>
        <div class="subtitle-1" v-text="path"/>
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
        版本({{ file.versions.length }})
        <v-list two-line subheader>
          <v-list-item v-for="(version, i) in file.versions" :key="i">
            <v-list-item-avatar>
              <v-icon>{{ fileIcon(version.type) }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ version.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ version.type || '未知类型' }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>mdi-download-network</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
      <template v-else>
        无版本
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import { files } from '@/db/file'
import { formatDate } from '@/plugins/formatter'
import { fileIcon } from '@/plugins/icons'

export default {
  name: 'fileDetail',
  props: ['id'],
  data: () => ({
    file: { tags: [], versions: [] },
    name: '',
    path: ''
  }),
  methods: {
    async load () {
      this.file = await files.get(this.id)
      this.path = this.file.path
      this.name = this.path.substr(this.path.lastIndexOf('/') + 1)
      this.path = this.path.substr(0, this.path.length - this.name.length)
    },
    formatDate,
    fileIcon
  },
  created () {
    this.load()
  }
}
</script>
