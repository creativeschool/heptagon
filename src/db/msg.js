import { axios } from '@/plugins/axios'
import debug from 'debug'
import { isLoggedIn } from './user'
import { getCourse } from './course'
import { db } from './dexie'
import { get, set } from './config'
import { bus } from '@/plugins/bus'

const log = debug('hep:db:msg')
/** @type {import('dexie').Dexie.Table} */
export const msgs = db.msgs

export const syncMsg = async (courseId) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const last = await get('msg-sync-' + courseId) || 0
  const now = +new Date()
  const res = await axios.post('/msg/sync', { courseId, last })
  log(`@${courseId} fetched ${res.data.length} msgs`)
  await msgs.bulkPut(res.data)
  await set('msg-sync-' + courseId, now)
  bus.$emit('toast', `课程${obj.name}消息同步成功：${res.data.length}个文档已更新`)
}
