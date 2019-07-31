<template>
  <v-layout wrap>
    <v-flex>
      <v-card>
        <v-card-title>保护PDF</v-card-title>
        <v-card-text>
          此功能可将PDF转为只能查看无法复制、打印的EPDF格式
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="convert" color="primary" :loading="ld0">选择文件</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <v-card-title>Office转PDF</v-card-title>
        <v-card-text>
          此功能可将以下Office文件转换为PDF文件：<br/>
          Word (.doc, .dot,  .docx, .dotx, .docm, .dotm, .rtf, .wpd)<br/>
          Excel  (.xls, .xlsx, .xlsm, .xlsb, .xlt, .xltx, .xltm, .csv)<br/>
          Powerpoint (.ppt, .pptx, .pptm, .pps, .ppsx, .ppsm, .pot, .potx, .potm)<br/>
          Visio (.vsd, .vsdx, .vsdm, .svg) [Requires >= Visio 2013 for .svg, .vsdx and .vsdm support]<br/>
          Publisher (.pub)<br/>
          Outlook (.msg, .vcf, .ics)<br/>
          Project (.mpp) [Requires Project >= 2010 for .mpp support]<br/>
          OpenOffice (.odt, .odp, .ods)<br/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="officeToPdf" color="primary" :loading="ld1">选择文件</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card>
        <v-card-title>Office转EPDF</v-card-title>
        <v-card-text>
          从Office文件创建受保护的EPDF文件
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="officeToEpdf" color="primary" :loading="ld2">选择文件</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { remote } from 'electron'
import { bus } from '@/plugins/bus'
import { normalizePath } from '@/plugins/path'
import { pdfFilter, epdfFilter, convertPDFToEPDF } from '@/epdf'
import { officeFilters, officeToPDF, officeToEPDF } from '@/bin/officetopdf'

const current = remote.getCurrentWindow()
const basename = p => {
  p = normalizePath(p)
  p = p.substr(p.lastIndexOf('/') + 1)
  const i = p.lastIndexOf('.')
  if (i === -1) return p
  return p.substr(0, i)
}

export default {
  name: 'tool',
  data: () => ({
    ld0: false,
    ld1: false,
    ld2: false
  }),
  methods: {
    convert () {
      this.ld0 = true
      remote.dialog.showOpenDialog(current, { filters: pdfFilter }, paths => {
        if (paths && paths.length) {
          remote.dialog.showSaveDialog(current, { filters: epdfFilter, defaultPath: basename(paths[0], '.pdf') }, path => {
            if (path) {
              convertPDFToEPDF(paths[0], path, 1, {})
                .then(() => {
                  bus.$emit('toast', '转换成功！')
                })
                .finally(() => {
                  this.ld0 = false
                })
            } else {
              this.ld0 = false
            }
          })
        } else {
          this.ld0 = false
        }
      })
    },
    officeToPdf () {
      this.ld1 = true
      remote.dialog.showOpenDialog(current, { filters: officeFilters }, paths => {
        if (paths && paths.length) {
          remote.dialog.showSaveDialog(current, { filters: pdfFilter, defaultPath: basename(paths[0], '.pdf') }, path => {
            if (path) {
              const result = officeToPDF(paths[0], path)
              bus.$emit('toast', result ? `转换失败，错误${result}` : '转换成功！')
              this.ld1 = false
            } else {
              this.ld1 = false
            }
          })
        } else {
          this.ld1 = false
        }
      })
    },
    officeToEpdf () {
      this.ld2 = true
      remote.dialog.showOpenDialog(current, { filters: officeFilters }, paths => {
        if (paths && paths.length) {
          remote.dialog.showSaveDialog(current, { filters: epdfFilter, defaultPath: basename(paths[0], '.pdf') }, path => {
            if (path) {
              officeToEPDF(paths[0], path)
                .then(() => {
                  bus.$emit('toast', '转换成功！')
                })
                .finally(() => {
                  this.ld2 = false
                })
            } else {
              this.ld2 = false
            }
          })
        } else {
          this.ld2 = false
        }
      })
    }
  }
}
</script>
