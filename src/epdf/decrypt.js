import { pass } from './pass'
import { createDecipheriv } from 'crypto'
import concat from 'concat-stream'

/**
 * @param {Buffer} buffer
 * @returns {Promise<Buffer>}
 */
export const decrypt = (buffer) => new Promise((resolve, reject) => {
  const iv = buffer.slice(0, 16)
  buffer = buffer.slice(16)
  const decipher = createDecipheriv('aes-256-cfb', pass, iv)
  decipher.on('error', e => reject(e))
  decipher.pipe(concat(buf => {
    if (Buffer.compare(iv, buf.slice(0, 16))) return reject(new Error('Invalid content'))
    resolve(buf.slice(16))
  }))
  decipher.write(buffer)
  decipher.end()
})
