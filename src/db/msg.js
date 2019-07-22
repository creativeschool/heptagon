import { axios } from '@/plugins/axios'
import debug from 'debug'
import { isLoggedIn } from './user'
import { getCourse } from './course'
import { db } from './dexie'
import { get, set } from './config'
import { bus } from '@/plugins/bus'
import { minArraySyncInterval } from './limits'
import { getPriv } from './ucmap'

const log = debug('hep:db:msg')
/** @type {import('dexie').Dexie.Table} */
export const msgs = db.msgs

/**
 * @param {string} courseId
 * @param {boolean} noLimit
 * @param {boolean} noToast
 */
export const syncMsg = async (courseId, noLimit, noToast) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const last = await get('msg-sync-' + courseId) || 0
  const now = +new Date()
  if (!noLimit && now - last < minArraySyncInterval) return
  const res = await axios.post('/course/msg/sync', { courseId, last })
  log(`@${obj.name} fetched ${res.data.length} msgs`)
  await msgs.bulkPut(res.data)
  await set('msg-sync-' + courseId, now)
  if (!noToast) {
    bus.$emit('toast', `课程${obj.name}消息同步成功：${res.data.length}个文档已更新`)
  }
}

/**
 * @param {string} courseId
 * @param {string} content
 * @param {string[]} tags
 */
export const createMsg = async (courseId, content, tags) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const priv = await getPriv(await get('current-user'), courseId)
  if (!priv.msg) throw new Error('无权限')
  const res = await axios.post('/course/msg/new', { courseId, content, tags })
  log(`@${obj.name} created ${res.data}`)
  await syncMsg(courseId, true, true)
  bus.$emit('toast', `课程${obj.name}通知发布成功`)
}
