<template>
  <v-app>
    <v-system-bar app window style="-webkit-app-region: drag">
      <v-avatar size="32" class="mr-2">
        <img src="@/../public/logo.png"/>
      </v-avatar>
      <v-spacer/>
        {{ title }}{{ title ? ' - ' : '' }}EPDF Viewer
      <v-spacer/>
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
    <v-content ref="content" class="content">
      <v-container fluid grid-list-md>
        <v-layout align-content-center justify-space-around>
          <v-card>
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
    rendering: false,
    scales: [0.5, 1, 1.5, 2],
    rotation: 0,
    wrapper: null
  }),
  created () {
    pdf
      .getDocument('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
      .promise
      .then(doc => {
        this.doc = doc
        this.render(this.index = 1)
        doc.getOutline().then(x => console.log(x))
      })
  },
  mounted () {
    const main = this.$refs.content
    this.wrapper = main.$el.children[0]
    this.wrapper.classList.add('content-wrap')
  },
  methods: {
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
          console.log(aw, ah, vw, vh)
          this.scale = Math.min(aw / vw, ah / vh)
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

<style>
.content {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.content-wrap {
  overflow: scroll;
}
</style>
