import { encrypt } from './encrypt'
import { writeEPDF } from './encode'

const fs = require('fs')

export const convertPDF = async (src, dist) => {
  writeEPDF(1, {}, await encrypt(fs.readFileSync(src)), dist)
}
