const { bus } = require('./bus')

/* global GIT_HASH, GIT_BRANCH, BUILD_DATE, BUILD_MACHINE */

const electron = require('electron')
const remote = electron.remote
const shell = electron.shell
const currentWindow = remote.getCurrentWindow()

module.exports = {
  versions: Object.assign({
    '版本控制散列': GIT_HASH,
    '版本控制分支': GIT_BRANCH,
    '构建时间': BUILD_DATE,
    '构建机器': BUILD_MACHINE,
    '运行时': 'electron'
  }, process.versions),
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
    bus.$emit('toast', '仅供开发人员使用')
    currentWindow.webContents.openDevTools()
  },
  openUrl (url) {
    shell.openExternal(url)
  },
  showErrorBox (title, content) {
    remote.dialog.showErrorBox(title, content)
  },
  reload () {
    remote.app.relaunch()
    remote.app.exit(0)
  }
}
