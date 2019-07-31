import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { checkLogin, users, syncUser } from './user'
import { ucmap } from './ucmap'
import { get } from './config'
import { minObjectSyncInterval } from './limits'

const log = debug('hep:db:course')
/** @type {import('dexie').Dexie.Table} */
export const courses = db.courses

/**
 * @param {string} courseId
 */
export const syncCourse = async (courseId) => {
  await checkLogin()
  const course = await courses.get(courseId)
  const last = course ? course.lastFetch || 0 : 0
  log(`Sync course ${courseId} last ${last}`)
  const now = +new Date()
  if (now - last < minObjectSyncInterval) return
  const res = await axios.post('/login/course/sync', { courseId, last })
  await courses.put(Object.assign({ lastFetch: now }, res.data))
}

export const syncAllCourse = async () => {
  await checkLogin()
  const mappers = await ucmap.where({ user: await get('current-user') }).toArray()
  for (const mapper of mappers) {
    const course = await courses.get(mapper.course)
    if (!course || !course.lastFetch) {
      await syncCourse(mapper.course)
    } else {
      const updated = Math.max(course.updated, mapper.updated)
      const now = +new Date()
      const delta = Math.max(Math.ceil((now - updated) / 10), 5000)
      if (course.lastFetch + delta <= now) await syncCourse(mapper.course)
    }
  }
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

export const getUsersFromCourse = async (course) => {
  const maps = await ucmap.where({ course }).toArray()
  return Promise.all(maps.map(x => users.get(x.user)))
}

export const syncAllUserFromCourse = async (course) => {
  await checkLogin()
  const mappers = await ucmap.where({ course }).toArray()
  for (const mapper of mappers) {
    const user = await users.get(mapper.user)
    if (!user || !user.lastFetch) {
      await syncUser(mapper.user)
    } else {
      const updated = Math.max(course.updated, mapper.updated)
      const now = +new Date()
      const delta = Math.max(Math.ceil((now - updated) / 10), 5000)
      if (user.lastFetch + delta <= now) await syncUser(mapper.user)
    }
  }
}
