import debug from 'debug'
import { db } from './dexie'
import { checkLogin } from './user'
import { axios } from '@/plugins/axios'
import { get, set } from './config'
import { minArraySyncInterval } from './limits'

/**
 * @typedef {{_id:string, content:string, created: number, updated: number}} Notice
 */

const log = debug('hep:db:notice')
/** @type {import('dexie').Dexie.Table<Notice>} */
export const notices = db.notices

export const syncNotice = async () => {
  await checkLogin()
  const last = await get('notice-sync') || 0
  const now = +new Date()
  if (now - last < minArraySyncInterval) return
  const res = await axios.post('/login/notice/sync', { last })
  log(`Fetched notices length=${res.data.length}`)
  await notices.bulkPut(res.data)
  await set('notice-sync', now)
}
