import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { isLoggedIn } from './user'
import { get, set } from './config'
import { getCourse } from './course'

const log = debug('hep:db:ucmap')
/** @type {import('dexie').Dexie.Table} */
export const ucmap = db.ucmap

export const syncUserUcmap = async () => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const last = await get('ucmap-sync') || 0
  const now = +new Date()
  const res = await axios.post('/user/ucmap', { last })
  log(`Fetched ucmap from user length=${res.data.length}`)
  await ucmap.bulkPut(res.data)
  await set('ucmap-sync', now)
}

/**
 * @param {string} courseId
 */
export const syncCourseUcmap = async (courseId) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(courseId)
  const last = await get('ucmap-sync-' + courseId)
  const now = +new Date()
  const res = await axios.post('/course/ucmap', { courseId, last })
  log(`Fetched ucmap from course ${obj.name} length=${res.data.length}`)
  await ucmap.bulkPut(res.data)
  await set('ucmap-sync-' + courseId, now)
}

export const getPriv = async (user, course) => {
  log(`GetPriv user=${user} course=${course}`)
  const mapper = await ucmap.where({ user, course }).first()
  return mapper.priv
}
