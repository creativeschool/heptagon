import { bus } from './bus'

/* global GIT_HASH, GIT_BRANCH, BUILD_DATE, BUILD_MACHINE */

export let isElectron = false

export let versions = {
  '版本控制散列': GIT_HASH,
  '版本控制分支': GIT_BRANCH,
  '构建时间': BUILD_DATE,
  '构建机器': BUILD_MACHINE,
  '运行时': 'web'
}

export let close = () => {
  bus.$emit('toast', '不支持')
}
export let maximize = () => {
  bus.$emit('toast', '不支持')
}
export let minimize = () => {
  bus.$emit('toast', '不支持')
}
export let devTools = () => {
  bus.$emit('toast', '请手动打开')
}
export let openUrl = (url) => {
  window.open(url)
}
export let showErrorBox = (title, content) => {
  alert(title + '\n' + content)
}
export let reload = () => {
  location.reload()
}

if (typeof process !== 'undefined' && process.versions && process.versions.electron !== undefined) {
  isElectron = true
  versions['运行时'] = 'electron'
  Object.assign(versions, process.versions)
  const electron = require('electron')
  const remote = electron.remote
  const shell = electron.shell
  const currentWindow = remote.getCurrentWindow()
  close = () => {
    currentWindow.close()
  }
  maximize = () => {
    currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()
  }
  minimize = () => {
    currentWindow.minimize()
  }
  devTools = () => {
    bus.$emit('toast', '仅供开发人员使用')
    currentWindow.webContents.openDevTools()
  }
  openUrl = (url) => {
    shell.openExternal(url)
  }
  showErrorBox = (title, content) => remote.dialog.showErrorBox(title, content)
  reload = () => {
    remote.app.relaunch()
    remote.app.exit(0)
  }
}
