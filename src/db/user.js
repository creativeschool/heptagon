import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db, reinit } from './dexie'
import { set, get } from './config'
import { bus } from '@/plugins/bus'

const log = debug('hep:db:user')
/** @type {import('dexie').Dexie.Table} */
export const users = db.users

/**
 * User login
 * **Warning! Will drop the whole IndexDB!**
 * @param {string} name
 * @param {string} pass
 */
export const login = async (name, pass) => {
  await reinit()
  const res = await axios.post('/login', { name, pass })
  log(res.data)
  axios.defaults.headers['x-access-token'] = res.data
  await set('x-access-token', res.data)
}

export const isLoggedIn = async () => {
  const token = await get('x-access-token')
  if (!token) return false
  axios.defaults.headers['x-access-token'] = token
  return true
}

export const syncUser = async () => {
  if (!await isLoggedIn()) throw new Error('需要登陆')
  const count = await users.count()
  log('Current user count = ' + count)
  const last = count ? (await users.orderBy('updated').offset(count - 1).limit(1).toArray())[0].updated : 0
  log('Last update = ' + last)
  const res = await axios.post('/user/sync', { last })
  log(`Fetched ${res.data.length} users`)
  await users.bulkPut(res.data)
  bus.$emit('toast', `用户同步成功：${res.data.length}条记录已更新`)
}
