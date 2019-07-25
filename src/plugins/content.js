import { axios } from './axios'

const fs = require('fs')
const crypto = require('crypto')
const concat = require('concat-stream')

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export const provide = file => new Promise((resolve, reject) => {
  if (!fs.existsSync(file.path)) return reject(new Error('文件未找到'))
  const hasher = crypto.createHash('sha1')
  fs
    .createReadStream(file.path)
    .on('error', err => reject(err))
    .pipe(hasher)
    .pipe(concat(buf => {
      const sha = buf.toString('hex')
      axios
        .post('/content/try', JSON.stringify(sha), { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
          if (res.data) return resolve(sha)
          const form = new FormData()
          form.append('file', file)
          return axios.post('/content/provide', form)
        })
        .then(res => {
          if (res) return resolve(res.data)
        })
        .catch(reject)
    }))
})
