import { promisify } from 'util'
import { readdir } from 'fs'
import klaw from 'klaw'

export const readdirAsync = promisify(readdir)

export const walkAsync = path => new Promise((resolve) => {
  const succ = []
  const fail = []
  klaw(path)
    .on('data', item => {
      if (!item.stats.isFile()) return
      succ.push(item.path)
    })
    .on('error', (err, item) => {
      if (!item.stats.isFile()) return
      fail.push([err.message, item.path])
    })
    .on('end', () => resolve([succ, fail]))
})
