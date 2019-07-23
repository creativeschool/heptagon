<template>
  <v-layout wrap>
    <template v-if="files.length">
      <v-flex xs12 class="pa-2">
        <v-card>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="sync" color="primary">同步文件</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs3 class="pa-2">
        <v-card>
          <v-card-title>文件树</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs9 class="pa-2">
        <v-card>
          <v-text-field readonly label="当前路径" v-model="path" hide-details class="ma-2"/>
          <v-divider/>
          <v-card-text>
            <!-- TODO -->
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <v-spacer/>
            <v-btn icon @click="uploadFile">
              <v-icon>mdi-file-upload</v-icon>
            </v-btn>
            <v-btn icon @click="uploadFolder" v-if="isElectron">
              <v-icon>mdi-folder-upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </template>
    <template v-else>
      <v-flex>
        <v-card color="transparent" flat>
          <v-card-title>
            <v-spacer/>
            <v-icon size="5em">mdi-test-tube-empty</v-icon>
            <v-spacer/>
          </v-card-title>
          <v-card-title>
            <v-spacer/>
            常无，欲以观其妙
            <v-spacer/>
          </v-card-title>
          <v-card-actions>
            <v-spacer/>
            <v-btn large outlined color="primary" @click="uploadFile">上传文件</v-btn>
            <template v-if="isElectron">
              &nbsp;或&nbsp;
              <v-btn large outlined color="green" @click="uploadFolder">上传文件夹</v-btn>
            </template>
            <v-spacer/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import { files, syncFile } from '@/db/file'
import { isElectron } from '@/plugins/electron'

export default {
  name: 'file',
  props: ['id'],
  data: () => ({
    files: [],
    loading: false,
    path: '/',
    isElectron
  }),
  methods: {
    async load () {
      this.files = await files.where('course').equals(this.id).toArray()
    },
    sync () {
      this.loading = true
      syncFile(this.id)
        .then(this.load)
        .finally(() => { this.loading = false })
    },
    uploadFile () {
      this.$router.push({ path: `/course/${this.$parent.course._id}/file/upload/file`, query: { path: this.path } })
    },
    uploadFolder () {
      this.$router.push({ path: `/course/${this.$parent.course._id}/file/upload/folder`, query: { path: this.path } })
    }
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
