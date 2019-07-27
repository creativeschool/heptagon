import fs from 'fs'
import crypto from 'crypto'
import concat from 'concat-stream'
import NodeFormData from 'form-data'
import { axios } from './axios'
import { normalizePath, filetype } from './path'
import { createFile } from '@/db/file'
import { provideOfficeEPDF, providePdfEPDF, supportedExts } from '@/bin/officetopdf'

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

/**
 * @param {string} courseId
 * @param {string[]} tags
 * @param {string} remote
 * @param {string} npath
 */
export const createJobCreator = (courseId, tags, remote, npath) =>
  async path => {
    let p = normalizePath(path)
    p = p.substr(npath.length + 1)
    p = remote + p
    const fhash = await provideNative(path)
    const ftype = filetype(path)
    if (ftype === 'pdf') {
      const shash = await providePdfEPDF(path)
      await createFile(courseId, p, tags, [
        { hash: fhash, name: '默认', type: filetype(path) },
        { hash: shash, name: '!公开', type: 'epdf' }
      ])
    } else if (supportedExts.includes(ftype)) {
      const shash = await provideOfficeEPDF(path)
      await createFile(courseId, p, tags, [
        { hash: fhash, name: '默认', type: filetype(path) },
        { hash: shash, name: '!公开', type: 'epdf' }
      ])
    } else {
      await createFile(courseId, p, tags, [
        { hash: fhash, name: '默认', type: filetype(path) }
      ])
    }
    return `${path} → ${p}`
  }
