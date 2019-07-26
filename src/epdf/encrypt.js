import { pass } from './pass'
import { randomBytes, createCipheriv } from 'crypto'

const concat = require('concat-stream')

/**
 * @param {Buffer} content
 * @returns {Promise<Buffer>}
 */
export const encrypt = (content) => new Promise((resolve, reject) => {
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-cfb', pass, iv)
  cipher.on('error', e => reject(e))
  cipher.pipe(concat(buf => resolve(Buffer.concat([iv, cipher]))))
  cipher.write(iv)
  cipher.write(content)
  cipher.end()
})
