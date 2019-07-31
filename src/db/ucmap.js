import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { checkLogin } from './user'
import { get, set } from './config'
import { getCourse } from './course'
import { minArraySyncInterval } from './limits'

/**
 * @typedef {{ scope: string, msg: boolean }} Priv
 * @typedef {{ _id: string, user: string, course: string, created: number, updated: number, priv: Priv }} UCMap
 */

const log = debug('hep:db:ucmap')
/** @type {import('dexie').Dexie.Table<UCMap>} */
export const ucmap = db.ucmap

export const syncUserUcmap = async () => {
  await checkLogin()
  const last = await get('ucmap-sync') || 0
  const now = +new Date()
  if (now - last < minArraySyncInterval) return
  const res = await axios.post('/login/user/ucmap', { last })
  log(`Fetched ucmap from user length=${res.data.length}`)
  await ucmap.bulkPut(res.data)
  await set('ucmap-sync', now)
}

/**
 * @param {string} courseId
 */
export const syncCourseUcmap = async (courseId) => {
  await checkLogin()
  const obj = await getCourse(courseId)
  const last = await get('ucmap-sync-' + courseId)
  const now = +new Date()
  if (now - last < minArraySyncInterval) return
  const res = await axios.post('/login/course/ucmap', { courseId, last })
  log(`Fetched ucmap from course ${obj.name} length=${res.data.length}`)
  await ucmap.bulkPut(res.data)
  await set('ucmap-sync-' + courseId, now)
}

/**
 * @param {string} user
 * @param {string} course
 * @returns {Priv}
 */
export const getPriv = async (user, course) => {
  log(`GetPriv user=${user} course=${course}`)
  const mapper = await ucmap.where({ user, course }).first()
  return mapper.priv
}

/**
 * @param {string} course
 */
export const getCurrentPriv = async (course) => {
  return getPriv(await get('current-user'), course)
}
