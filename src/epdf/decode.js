const fs = require('fs-extra')

export const readEPDF = async src => {
  const buffer = await fs.readFile(src)
  const version = buffer.readUInt32LE(0)
  const metaLen = buffer.readUInt32LE(4)
  const meta = JSON.parse(buffer.toString('utf-8', 8, 8 + metaLen))
  const content = buffer.slice(8 + metaLen)
  return { version, meta, content }
}
