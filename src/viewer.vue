<template>
  <v-app>
    <v-system-bar app window style="-webkit-app-region: drag">
      <v-avatar size="32" class="mr-2">
        <img src="@/../public/logo.png"/>
      </v-avatar>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text color="primary" v-on="on" style="-webkit-app-region: no-drag">文件</v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="open">
            <v-list-item-title>打开</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item @click="devTools" v-if="isDevelopment">
            <v-list-item-title>开发者工具</v-list-item-title>
          </v-list-item>
          <v-list-item @click="close">
            <v-list-item-title>退出</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer/>
        {{ title }}{{ title ? ' - ' : '' }}EPDF Viewer
      <v-spacer/>
      <v-icon @click="minimize" style="-webkit-app-region: no-drag">mdi-minus</v-icon>
      <v-icon @click="maximize" style="-webkit-app-region: no-drag">mdi-plus</v-icon>
      <v-icon @click="close" style="-webkit-app-region: no-drag">mdi-close</v-icon>
    </v-system-bar>
    <v-app-bar app>
      <v-toolbar-title>EPDF Viewer</v-toolbar-title>
      <v-spacer/>
      <v-btn icon @click="index--" :disabled="index <= 1">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="index++" :disabled="index >= doc.numPages">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn icon @click="fitWindow">
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>
      <v-btn icon @click="fitPage">
        <v-icon>mdi-fullscreen-exit</v-icon>
      </v-btn>
      <v-btn icon @click="rotation = (rotation + 90) % 360">
        <v-icon>mdi-rotate-right</v-icon>
      </v-btn>
      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">{{ index }} / {{ doc.numPages }}</v-btn>
        </template>
        <v-card class="pa-2">
          <v-text-field hide-details label="页码" type="number" v-model.number="index" :min="1" :max="doc.numPages"/>
        </v-card>
      </v-menu>
      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">{{ Math.round(scale * 100) }}%</v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(s, i) in  scales" :key="i" @click="scale = s">
            <v-list-item-content>
              <v-list-item-title>{{ s * 100 }}%</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content ref="content" class="main-content">
      <v-container fluid grid-list-md>
        <v-layout align-content-center justify-space-around>
          <v-card>
            <v-alert v-model="showAlert" type="error">
              {{ alert }}
            </v-alert>
            <canvas ref="canvas"/>
            <v-overlay :value="rendering" absolute>
              <v-progress-circular indeterminate/>
            </v-overlay>
          </v-card>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app padless>
      <v-flex text-center xs12>
        版本 {{ build.version }}.{{ build.hash }}-{{ build.branch }}({{ isElectron ? 'electron' : 'web' }})
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
import pdf from 'pdfjs-dist/webpack'
import { version } from '@/../package.json'
import { getPDF } from '@/epdf/reader'
import { epdfFilter } from '@/epdf'

const electron = require('electron')
const remote = electron.remote
const currentWindow = remote.getCurrentWindow()

/* global APP_NAME, GIT_HASH, GIT_BRANCH */

export default {
  name: 'app',
  data: () => ({
    isElectron: process.env.IS_ELECTRON,
    appName: APP_NAME,
    build: {
      version,
      hash: GIT_HASH,
      branch: GIT_BRANCH
    },
    /** @type {import('pdfjs-dist').PDFDocumentProxy */
    doc: { numPages: 0 },
    scale: 1,
    title: '',
    index: 1,
    rendering: true,
    scales: [0.5, 1, 1.5, 2, 2.5, 5],
    rotation: 0,
    wrapper: null,
    showAlert: false,
    alert: '',
    epdfPath: decodeURIComponent(location.hash.substr(1)),
    isDevelopment: process.env.NODE_ENV !== 'production'
  }),
  mounted () {
    const main = this.$refs.content
    this.wrapper = main.$el.children[0]
    this.wrapper.classList.add('main-content-wrap')
    if (!this.epdfPath) {
      this.showAlert = true
      this.alert = '未找到文件'
    } else {
      setTimeout(() => {
        this.load()
      }, 1000)
    }
  },
  methods: {
    load () {
      this.rendering = true
      getPDF(this.epdfPath)
        .then(data => {
          pdf
            .getDocument({ data })
            .promise
            .then(doc => {
              this.doc = doc
              this.render(this.index = 1)
            })
        })
        .catch(e => {
          this.showAlert = true
          this.alert = e.message
        })
        .finally(() => {
          this.rendering = false
        })
    },
    render () {
      this.rendering = true
      this.doc
        .getPage(this.index)
        .then(page => {
          const viewport = page.getViewport(this.scale, this.rotation)
          /** @type {HTMLCanvasElement} */
          const canvas = this.$refs.canvas
          canvas.width = viewport.width
          canvas.height = viewport.height
          page.render({ canvasContext: canvas.getContext('2d'), viewport })
          this.rendering = false
        })
    },
    fitWindow () {
      this.doc
        .getPage(this.index)
        .then(page => {
          const aw = this.wrapper.clientWidth * 0.97
          const ah = this.wrapper.clientHeight * 0.97
          const viewport = page.getViewport(1, this.rotation)
          const vw = viewport.width
          const vh = viewport.height
          this.scale = Math.max(aw / vw, ah / vh)
        })
    },
    fitPage () {
      this.doc
        .getPage(this.index)
        .then(page => {
          const aw = this.wrapper.clientWidth * 0.97
          const ah = this.wrapper.clientHeight * 0.97
          const viewport = page.getViewport(1, this.rotation)
          const vw = viewport.width
          const vh = viewport.height
          this.scale = Math.min(aw / vw, ah / vh)
        })
    },
    close () {
      currentWindow.close()
    },
    maximize () {
      currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()
    },
    minimize () {
      currentWindow.minimize()
    },
    devTools () {
      currentWindow.webContents.openDevTools()
    },
    openUrl (url) {
      electron.shell.openExternal(url)
    },
    open () {
      remote.dialog.showOpenDialog(currentWindow, { filters: epdfFilter }, paths => {
        if (paths && paths.length) {
          this.epdfPath = paths[0]
          this.load()
        }
      })
    }
  },
  watch: {
    index: {
      handler () {
        this.render()
      }
    },
    scale: {
      handler () {
        this.render()
      }
    },
    rotation: {
      handler () {
        this.render()
      }
    }
  }
}
</script>
