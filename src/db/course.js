import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { isLoggedIn } from './user'

const log = debug('hep:db:course')
/** @type {import('dexie').Dexie.Table} */
export const courses = db.courses

/**
 * @param {string} courseId
 */
export const syncCourse = async (courseId) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const course = await courses.get(courseId)
  const last = course ? course.lastFetch || 0 : 0
  log(`Sync course ${courseId} last ${last}`)
  const now = +new Date()
  const res = await axios.post('/course/sync', { courseId, last })
  await courses.put(Object.assign({ lastFetch: now }, res.data))
}

/**
 * @param {string} courseId
 */
export const getCourse = async (courseId) => {
  log(`Get course ${courseId}`)
  let course = await courses.get(courseId)
  if (course) return course
  // await syncCourse()
  // course = await courses.get(courseId)
  // if (course) return course
  throw new Error('无此课程')
}
