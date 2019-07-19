import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db, reinit } from './dexie'
import { set, get } from './config'
import { bus } from '@/plugins/bus'

const log = debug('hep:db:user')
/** @type {import('dexie').Dexie.Table} */
export const users = db.users

/**
 * User signin
 * **Warning! Will drop the whole IndexDB!**
 * @param {string} login
 * @param {string} pass
 */
export const signin = async (login, pass) => {
  await reinit()
  const res = await axios.post('/signin', { login, pass })
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

export const getTokenDetails = async () => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const info = await axios.get('/token/detail')
  await set('current-user', info.data.user)
}

export const syncUser = async () => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const count = await users.count()
  log('Current user count = ' + count)
  const last = count ? (await users.orderBy('updated').offset(count - 1).limit(1).toArray())[0].updated : 0
  log('Last update = ' + last)
  const res = await axios.post('/user/sync', { last })
  log(`Fetched ${res.data.length} users`)
  await users.bulkPut(res.data)
  bus.$emit('toast', `用户同步成功：${res.data.length}条记录已更新`)
  bus.$emit('chrome_update')
}

/**
 * @param {string} _id
 */
export const getUser = async (_id) => {
  log(`Get user ${_id}`)
  let user = await users.get(_id)
  if (user) return user
  throw new Error('无此用户')
}
