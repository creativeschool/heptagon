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
      <!-- File Tree -->
      <v-flex xs3 class="pa-2">
        <v-card>
          <v-treeview :items="tree" v-model="selection" :active.sync="active" selectable return-object activatable hoverable dense open-all>
              <template v-slot:prepend="{ item, open }">
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                mdi-file
              </v-icon>
            </template>
          </v-treeview>
        </v-card>
      </v-flex>
      <!-- Main content -->
      <v-flex xs9 class="pa-2">
        <!-- Selected file operations -->
        <template v-if="selection.length">
            <v-card>
              <v-card-title>选中的文件({{ selection.length }})</v-card-title>
              <v-list two-line>
                <v-list-item v-for="(item, i) in selection" :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.file.path }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-card-actions>
              </v-card-actions>
            </v-card>
        </template>
        <!-- File browser -->
        <template v-else>
          <v-card>
            <v-text-field readonly label="当前路径" v-model="path" hide-details class="ma-2"/>
            <v-divider/>
            <v-list subheader two-line>
              <template v-if="path !== '/'">
                <v-subheader inset>父目录</v-subheader>
                <v-list-item @click="path = path.substr(0, path.substr(0, path.length - 1).lastIndexOf('/') + 1)">
                  <v-list-item-avatar>
                    <v-icon>mdi-folder</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    ..
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-subheader inset v-if="displayFolders.length">文件夹</v-subheader>
              <v-list-item v-for="([name, info], i) in displayFolders" :key="i" @click="path += name + '/'">
                <v-list-item-avatar>
                  <v-icon>mdi-folder</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ info.count }}文件</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-subheader inset v-if="displayFiles.length">文件</v-subheader>
              <v-list-item v-for="([name, item], i) in displayFiles" :key="i">
                <v-list-item-avatar>
                  <v-icon>mdi-file</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.versions.length }}版本</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon>
                    <v-icon>info</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
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
    <!-- No files -->
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
    <v-overlay absolute :value="loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
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
    displayFolders: [],
    displayFiles: [],
    loading: false,
    path: '/',
    isElectron: process.env.IS_ELECTRON,
    tree: [],
    selection: [],
    active: []
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
        .then(() => this.filter())
        .finally(() => {
          this.loading = false
          bus.$emit('title', '文件列表 - ' + this.$parent.course.name)
        })
    },
    filter () {
      if (this.path.endsWith('/')) {
        const display = this.files.filter(x => x.path.startsWith(this.path))
        const folders = new Map()
        this.displayFiles = []
        for (const file of display) {
          /** @type {string} */
          const rest = file.path.substr(this.path.length)
          const pos = rest.indexOf('/')
          if (pos === -1) {
            this.displayFiles.push([rest, file])
          } else {
            const name = rest.substr(0, pos)
            const folder = folders.get(name)
            if (folder) {
              folder.count++
            } else {
              folders.set(name, { count: 1 })
            }
          }
        }
        this.displayFolders = [...folders]
      } else {
        this.displayFolders = []
        const filename = this.path.substr(this.path.lastIndexOf('/') + 1)
        this.displayFiles = this.files.filter(x => x.path === this.path).map(x => [filename, x])
      }
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
    },
    active: {
      handler () {
        if (this.active.length) {
          this.path = this.active[0].path
        }
      }
    },
    path: {
      handler () {
        this.filter()
      }
    }
  }
}
</script>
