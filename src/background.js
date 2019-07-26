'use strict'

import path from 'path'
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'
import { existsSync } from 'fs'

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

let win

/* global __static */

const createMainWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      defaultFontFamily: {
        standard: '微软雅黑',
        sansSerif: '微软雅黑'
      }
    },
    frame: false,
    icon: path.join(__static, 'logo.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

const createFileWindow = file => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      defaultFontFamily: {
        standard: '微软雅黑',
        sansSerif: '微软雅黑'
      }
    },
    frame: false,
    icon: path.join(__static, 'logo.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'epdf.html#' + encodeURIComponent(file))
  } else {
    createProtocol('app')
    win.loadURL('app://./epdf.html#' + encodeURIComponent(file))
  }

  win.on('closed', () => {
    win = null
  })
}

const startup = () => {
  if (isDevelopment) {
    if (process.env.TEST_FILE) {
      createFileWindow(process.env.TEST_FILE)
    } else {
      createMainWindow()
    }
  } else {
    if (process.argv.length >= 2 && existsSync(process.argv[1])) {
      createFileWindow(process.argv[1])
    } else {
      createMainWindow()
    }
  }
}

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    startup()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  startup()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
