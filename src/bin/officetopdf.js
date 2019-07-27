import { join, resolve } from 'path'
import { binPath } from './path'
import { spawnSync } from 'child_process'
import { fileSync } from 'tmp'
import { convertPDF } from '@/epdf/writer'
import { provideNative } from '@/plugins/content'

const exe = resolve(join(binPath, 'OfficeToPDF.exe'))
const defaultArgs = [
  '/readonly',
  '/hidden',
  '/pdf_owner_pass pass',
  '/pdf_restrict_accessibility_extraction',
  '/pdf_restrict_annotation',
  '/pdf_restrict_assembly',
  '/pdf_restrict_extraction',
  '/pdf_restrict_forms',
  '/pdf_restrict_full_quality',
  '/pdf_restrict_modify',
  '/pdf_restrict_print'
]

export const officeFilters = [
  { name: 'Word', extensions: ['doc', 'dot', 'docx', 'dotx', 'docm', 'dotm', 'rtf', 'wpd'] },
  { name: 'Excel', extensions: ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm', 'csv'] },
  { name: 'Powerpoint', extensions: ['ppt', 'pptx', 'pptm', 'pps', 'ppsx', 'ppsm', 'pot', 'potx', 'potm'] },
  { name: 'Visio', extensions: ['vsd', 'vsdx', 'vsdm', 'svg'] },
  { name: 'Publisher', extensions: ['pub'] },
  { name: 'Outlook', extensions: ['msg', 'vcf', 'ics'] },
  { name: 'Project', extensions: ['mpp'] },
  { name: 'OpenOffice', extensions: ['odt', 'odp', 'ods'] }
]

export const supportedExts = officeFilters.map(x => x.extensions).flat()

export const officeToPDF = (src, dst, args = defaultArgs) => {
  const { status } = spawnSync(exe, [src, dst, ...args], { stdio: 'ignore', shell: true })
  return status
}

export const officeToEPDF = async (src, dst, args = defaultArgs) => {
  const tmp = fileSync({ postfix: '.pdf' })
  const result = officeToPDF(src, tmp.name, args)
  if (result) throw new Error('转换错误：' + result)
  await convertPDF(tmp.name, dst)
  tmp.removeCallback()
}

export const provideEPDF = async (src, args = defaultArgs) => {
  const tmp = fileSync({ postfix: '.epdf' })
  await officeToEPDF(src, tmp.name, args)
  const hash = await provideNative(tmp.name)
  tmp.removeCallback()
  return hash
}
