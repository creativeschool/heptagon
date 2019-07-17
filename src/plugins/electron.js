export const electron = require('electron')
export const remote = electron.remote
export const currentWindow = remote.getCurrentWindow()
export const close = () => currentWindow.close()
export const maximize = () => currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize()
export const minimize = () => currentWindow.minimize()
export const devTools = () => currentWindow.webContents.openDevTools()
