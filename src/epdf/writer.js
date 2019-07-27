import fs from 'fs'
import { encrypt } from './encrypt'
import { writeEPDF } from './encode'

export const convertPDF = async (src, dist) => {
  writeEPDF(1, {}, await encrypt(fs.readFileSync(src)), dist)
}
