import { remote } from 'electron'
import { dirname, join } from 'path'

const mainExePath = remote.app.getPath('exe')
const installPath = dirname(mainExePath)
export const binPath = process.env.NODE_ENV === 'production'
  ? join(installPath, 'bin')
  : join('.', 'bin', process.platform)
