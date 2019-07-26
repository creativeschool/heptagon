const fs = require('fs-extra')

/**
 * @param {number} version
 * @param {any} meta
 * @param {Buffer} content
 */
export const writeEPDF = async (version, meta, content, dist) => {
  meta = Buffer.from(JSON.stringify(meta), 'utf-8')
  const header = Buffer.allocUnsafe(8)
  header.writeUInt32LE(version, 0)
  header.writeUInt32LE(meta.length, 4)
  return fs.writeFile(dist, Buffer.concat([header, meta, content]))
}
