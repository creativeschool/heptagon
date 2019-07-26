import { encrypt } from './encrypt'
import { writeEPDF } from './encode'

const fs = require('fs-extra')

export const writePDF = async (src, dist) => {
  await writeEPDF(1, {}, await encrypt(await fs.readFile(src)), dist)
}
