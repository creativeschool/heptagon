<template>
  <v-layout wrap>
    <template v-if="files.length">
      <v-flex xs12>
        <v-card>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="load" color="primary">同步文件</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- File Tree -->
      <v-flex xs3 v-if="showTree">
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
      <v-flex :xs9="showTree" :xs12="!showTree">
        <!-- Selected file operations -->
        <template v-if="selection.length">
          <v-card>
            <v-card-title>选中的文件({{ selection.length }})</v-card-title>
            <v-list two-line>
              <v-list-item v-for="(item, i) in selection" :key="i">
                <v-list-item-avatar>
                  <v-icon>mdi-file</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.file.path }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="primary">下载</v-btn>
              <v-btn color="error">删除</v-btn>
            </v-card-actions>
          </v-card>
        </template>
        <!-- File browser -->
        <template v-else>
          <v-card>
            <v-card-text>
              <v-text-field label="当前路径" v-model.lazy="realpath" hide-details @blur="path = realpath" @keyup.native.enter="path = realpath"/>
            </v-card-text>
            <v-divider/>
            <template v-if="displayFiles.length || displayFolders.length">
              <v-list subheader two-line>
                <v-list-item @click="path = path.substr(0, path.substr(0, path.lastIndexOf('/')).lastIndexOf('/') + 1)" :disabled="path === '/'">
                  <v-list-item-avatar>
                    <v-icon>mdi-arrow-up</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    ..
                  </v-list-item-content>
                </v-list-item>
                <v-subheader inset v-if="displayFolders.length">文件夹</v-subheader>
                <v-list-item v-for="[name, info] in displayFolders" :key="info.id" @click="path += name + '/'">
                  <v-list-item-avatar>
                    <v-icon>mdi-folder</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ info.count }}文件</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-subheader inset v-if="displayFiles.length">文件</v-subheader>
                <v-list-item v-for="[name, item] in displayFiles" :key="item.id">
                  <v-list-item-avatar v-if="item.versions.length">
                    <v-icon>{{ fileIcon(item.versions[0].type) }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-avatar v-else>
                    <v-icon>mdi-file-outline</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.versions.length }}版本</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="dialogId = item._id, dialog = true">
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
            </template>
            <template v-else>
              <v-card-text class="text-center">
                <v-icon size="5em">mdi-flask-empty-outline</v-icon>
              </v-card-text>
              <v-card-text class="text-center">
                无结果
              </v-card-text>
            </template>
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
    <v-dialog v-model="dialog" max-width="640px">
      <file-detail :id="dialogId" v-if="dialog" @update="load"/>
    </v-dialog>
  </v-layout>
</template>

<script>
import { files, syncFile } from '@/db/file'
import { bus } from '@/plugins/bus'
import { generateTreeviewData } from '@/plugins/trie'
import { fileIcon } from '@/plugins/icons'
import fileDetail from '@/components/filedetail.vue'

export default {
  name: 'file',
  components: {
    fileDetail
  },
  props: ['id'],
  data: () => ({
    files: [],
    displayFolders: [],
    displayFiles: [],
    loading: false,
    path: '/',
    realpath: '/',
    isElectron: process.env.IS_ELECTRON,
    tree: [],
    selection: [],
    active: [],
    dialog: false,
    dialogId: null,
    showTree: false
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
      if (this.path.startsWith('/')) {
        this.filterPath()
      } else {
        this.filterSearch()
      }
    },
    filterSearch () {
      this.displayFolders = []
      this.displayFiles = []
    },
    filterPath () {
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
              folders.set(name, { count: 1, id: file.id })
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
    },
    fileIcon
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
          this.filter()
        }
      }
    },
    path: {
      handler () {
        if (this.path !== this.realpath) {
          this.realpath = this.path
        }
        this.filter()
      }
    }
  }
}
</script>
