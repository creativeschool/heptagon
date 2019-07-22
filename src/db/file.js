import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { isLoggedIn } from './user'
import { bus } from '@/plugins/bus'
import { getCourse } from './course'
import { get, set } from './config'
import { minArraySyncInterval } from './limits'
import { getPriv } from './ucmap'

const log = debug('hep:db:file')
/** @type {import('dexie').Dexie.Table} */
export const files = db.files

/**
 * @param {string} courseId
 * @param {boolean} noLimit
 * @param {boolean} noToast
 */
export const syncFile = async (courseId, noLimit, noToast) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const last = await get('file-sync-' + courseId) || 0
  const now = +new Date()
  if (!noLimit && now - last < minArraySyncInterval) return
  const res = await axios.post('/course/file/sync', { courseId, last })
  log(`@${obj.name} fetched ${res.data.length} files`)
  await files.bulkPut(res.data)
  await set('file-sync-' + courseId, now)
  if (!noToast) {
    bus.$emit('toast', `课程${obj.name}文件同步成功：${res.data.length}个文档已更新`)
  }
}

/**
 * @param {string} courseId
 * @param {string} path
 * @param {string[]} tags
 * @param {{name:string,hash:string}[]} versions
 */
export const createFile = async (courseId, path, tags, versions) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const priv = await getPriv(await get('current-user'), courseId)
  if (!path.startsWith(priv.scope)) throw new Error('无权限')
  const res = await axios.post('/course/file/new', { courseId, path, tags, versions })
  log(`@${obj.name} created ${res.data}`)
  await syncFile(courseId, true, true)
  bus.$emit('toast', `课程${obj.name}文件创建成功`)
}
