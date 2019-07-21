import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { isLoggedIn } from './user'
import { bus } from '@/plugins/bus'
import { getCourse } from './course'
import { get, set } from './config'

const log = debug('hep:db:file')
/** @type {import('dexie').Dexie.Table} */
export const files = db.files

/**
 * @param {string} courseId
 */
export const syncFile = async (courseId) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const last = await get('file-sync-' + courseId) || 0
  const now = +new Date()
  const res = await axios.post('/course/file/sync', { courseId, last })
  log(`@${courseId} fetched ${res.data.length} files`)
  await files.bulkPut(res.data)
  await set('file-sync-' + courseId, now)
  bus.$emit('toast', `课程${obj.name}文件同步成功：${res.data.length}个文档已更新`)
}
