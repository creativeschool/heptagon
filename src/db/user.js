import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db, reinit } from './dexie'
import { set, get } from './config'
import { bus } from '@/plugins/bus'
import { minObjectSyncInterval } from './limits'

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

export const getTokenDetails = async () => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const info = await axios.get('/token/detail')
  await set('current-user', info.data.user)
}

export const isLoggedIn = async () => {
  const token = await get('x-access-token')
  return !!token
}

/**
 * @param {string} userId
 */
export const syncUser = async (userId) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const user = await users.get(userId)
  const last = user ? user.lastFetch || 0 : 0
  log(`Sync user ${userId} last ${last}`)
  const now = +new Date()
  if (now - last < minObjectSyncInterval) return
  const res = await axios.post('/user/sync', { userId, last })
  await users.put(Object.assign({ lastFetch: now }, res.data))
  if (userId === await get('current-user')) bus.$emit('chrome_update')
}

/**
 * @param {string} userId
 */
export const getUser = async (userId) => {
  log(`Get user ${userId}`)
  let user = await users.get(userId)
  if (user) return user
  throw new Error('无此用户')
}
