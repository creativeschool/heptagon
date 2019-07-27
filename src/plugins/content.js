import { axios } from './axios'

const fs = require('fs')
const crypto = require('crypto')
const concat = require('concat-stream')
const NodeFormData = require('form-data')

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export const provide = file => provideNative(file.path)

/**
 * @param {string} file
 * @returns {Promise<string>}
 */
export const provideNative = file => new Promise((resolve, reject) => {
  if (!fs.existsSync(file)) return reject(new Error('文件未找到'))
  const hasher = crypto.createHash('sha1')
  fs
    .createReadStream(file)
    .on('error', err => reject(err))
    .pipe(hasher)
    .pipe(concat(buf => {
      const sha = buf.toString('hex')
      axios
        .post('/content/try', JSON.stringify(sha), { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
          if (res.data) return resolve(sha)
          const form = new NodeFormData()
          form.append('file', fs.createReadStream(file))
          return axios.post('/content/provide', form, { headers: form.getHeaders() })
        })
        .then(res => {
          if (res) return resolve(res.data)
        })
        .catch(reject)
    }))
})
