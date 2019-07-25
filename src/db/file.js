import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { isLoggedIn } from './user'
import { bus } from '@/plugins/bus'
import { getCourse } from './course'
import { get, set } from './config'
import { minArraySyncInterval } from './limits'
import { getCurrentPriv } from './ucmap'
import { provide } from '@/plugins/content'
import { compareArraySimple, compareArrayComplex } from '@/plugins/utils'

/**
 * @typedef {{name:string, type:string, hash?:string, file?:string}} Version
 * @typedef {{_id:string, course:string, path:string, tags: string[], versions:Version[], created: number, updated: number}} File
 */

const log = debug('hep:db:file')
/** @type {import('dexie').Dexie.Table<File>} */
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
 * @param {Version[]} versions
 */
export const createFile = async (courseId, path, tags, versions) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const priv = await getCurrentPriv(courseId)
  if (!path.startsWith(priv.scope)) throw new Error('无权限')
  await normalizeVersions(versions)
  const res = await axios.post('/course/file/new', { courseId, path, tags, versions })
  log(`@${obj.name} created ${res.data}`)
  await syncFile(courseId, true, true)
  bus.$emit('toast', `课程${obj.name}文件创建成功`)
}

/**
 * @param {string} courseId
 * @param {string} path
 * @param {string[]} tags
 * @param {Version[]} versions
 */
export const editFile = async (fileId, path, tags, versions) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const file = await files.get(fileId)
  if (!file) throw new Error('无此文件')
  const priv = await getCurrentPriv(file.course)
  if (!file.path.startsWith(priv.scope) || !path.startsWith(priv.scope)) throw new Error('没有权限')
  const delta = { courseId: file.course, fileId }
  if (!compareArraySimple(file.tags, tags)) delta.tags = tags
  await normalizeVersions(versions)
  if (!compareArrayComplex(file.versions, versions, ['name', 'type', 'hash'])) delta.versions = versions
  await axios.post('/course/file/edit', delta)
  log(`@${fileId} Edit 🆗`)
  await files.update(fileId, { path, tags, versions })
  bus.$emit('toast', `文件更新成功`)
}

/**
 * @param {Version[]} versions
 */
const normalizeVersions = async versions => {
  for (const version of versions) {
    if (!version.hash) {
      if (!version.file) throw new Error('请选择文件')
      version.hash = await provide(version.file)
      delete version.file
    }
  }
}
