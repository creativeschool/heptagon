import { readEPDF } from './decode'
import { decrypt } from './decrypt'

export const getPDF = async src => {
  const { content } = readEPDF(src)
  return new Uint8Array(await decrypt(content))
}
