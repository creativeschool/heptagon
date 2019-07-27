const fs = require('fs')

/**
 * @param {number} version
 * @param {any} meta
 * @param {Buffer} content
 * @returns {Promise<void>}
 */
export const writeEPDF = (version, meta, content, dist) => new Promise((resolve, reject) => {
  meta = Buffer.from(JSON.stringify(meta), 'utf-8')
  const header = Buffer.allocUnsafe(8)
  header.writeUInt32LE(version, 0)
  header.writeUInt32LE(meta.length, 4)
  return fs.writeFile(dist, Buffer.concat([header, meta, content]), (err) => {
    if (err) return reject(err)
    return resolve()
  })
})
