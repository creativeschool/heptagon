<template>
  <v-layout wrap>
    <template v-if="files.length">
      <v-flex xs12 class="pa-2">
        <v-card>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="load" color="primary">同步文件</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs3 class="pa-2">
        <v-card>
          <v-card-text>
            <v-treeview :items="tree" v-model="selection" selectable return-object/>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs9 class="pa-2">
        <template v-if="selection.length">
            <v-card>
              <v-card-text>
                <v-list two-line>
                  <v-list-item v-for="(item, i) in selection" :key="i">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.file.path }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
              </v-card-actions>
            </v-card>
        </template>
        <template v-else>
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
        </template>
      </v-flex>
    </template>
    <template v-else>
      <v-flex>
        <v-card color="transparent" flat>
          <v-card-title>
            <v-spacer/>
            <v-icon size="5em">mdi-flask-empty-outline</v-icon>
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
import { bus } from '@/plugins/bus'
import { generateTreeviewData } from '@/plugins/trie'

export default {
  name: 'file',
  props: ['id'],
  data: () => ({
    files: [],
    loading: false,
    path: '/',
    isElectron: process.env.IS_ELECTRON,
    tree: [],
    selection: []
  }),
  methods: {
    load () {
      this.loading = true
      syncFile(this.id)
        .then(() => files.where('course').equals(this.id).toArray())
        .then(files => {
          this.files = files
          this.tree = generateTreeviewData(this.files)
        })
        .finally(() => {
          this.loading = false
          bus.$emit('title', '文件列表 - ' + this.$parent.course.name)
        })
    },
    uploadFile () {
      this.$router.push({ path: `/course/${this.$parent.course._id}/file/upload`, query: { path: this.path } })
    },
    uploadFolder () {
      this.$router.push({ path: `/course/${this.$parent.course._id}/file/upload`, query: { path: this.path, folder: true } })
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
