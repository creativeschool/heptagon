import fs from 'fs'

/**
 * @param {string} src
 * @returns {Promise<any>}
 */
export const readEPDF = src => new Promise((resolve, reject) => {
  fs.readFile(src, (err, buffer) => {
    if (err) return reject(err)
    const version = buffer.readUInt32LE(0)
    const metaLen = buffer.readUInt32LE(4)
    const meta = JSON.parse(buffer.toString('utf-8', 8, 8 + metaLen))
    const content = buffer.slice(8 + metaLen)
    return resolve({ version, meta, content })
  })
})
