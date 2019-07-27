import { remote } from 'electron'
const current = remote.getCurrentWindow()

/**
 * @param {import('electron').OpenDialogOptions} options
 * @returns {Promise<string[]>}
 */
export const showOpenDialog = options => new Promise((resolve, reject) => {
  remote.dialog.showOpenDialog(current, options, paths => {
    if (paths && paths.length) {
      resolve(paths)
    } else {
      reject(new Error('用户取消操作'))
    }
  })
})

/**
 * @param {import('electron').SaveDialogOptions} options
 * @returns {Promise<string>}
 */
export const showSaveDialog = options => new Promise((resolve, reject) => {
  remote.dialog.showSaveDialog(current, options, path => {
    if (path) {
      resolve(path)
    } else {
      reject(new Error('用户取消操作'))
    }
  })
})
