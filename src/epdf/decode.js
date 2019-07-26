const fs = require('fs')

export const readEPDF = src => {
  const buffer = fs.readFileSync(src)
  const version = buffer.readUInt32LE(0)
  const metaLen = buffer.readUInt32LE(4)
  const meta = JSON.parse(buffer.toString('utf-8', 8, 8 + metaLen))
  const content = buffer.slice(8 + metaLen)
  return { version, meta, content }
}
