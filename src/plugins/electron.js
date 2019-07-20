export let isElectron = false

export let versions = {}

export let close = () => {
  window.close()
}
export let maximize = () => {
}
export let minimize = () => {
}
export let devTools = () => {
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
  versions = process.versions
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
