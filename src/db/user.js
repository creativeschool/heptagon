import { axios } from '@/plugins/axios'
import debug from 'debug'
import db from './dexie'

const log = debug('hep:db:user')
/** @type {import('dexie').Dexie.Table} */
const users = db.users
/** @type {import('dexie').Dexie.Table} */
const configs = db.configs

/**
 * @param {string} name
 * @param {string} pass
 */
export const login = async (name, pass) => {
  const res = await axios.post('/login', { name, pass })
  log(res.data)
  axios.defaults.headers['x-access-token'] = res.data
  await configs.put({ key: 'token', value: res.data })
}

export const isLoggedIn = async () => {
  const token = await configs.get('token')
  if (!token) return false
  axios.defaults.headers['x-access-token'] = token.value
  return true
}

export const sync = async () => {
  if (!await isLoggedIn()) throw new Error('需要登陆')
  const count = await users.count()
  const last = count ? (await users.orderBy('updated').offset(count - 1).limit(1).toArray())[0].updated : 0
  const res = await axios.post('/user/sync', { last })
  await users.bulkPut(res.data)
}
