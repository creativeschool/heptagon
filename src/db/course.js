import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { isLoggedIn } from './user'
import { bus } from '@/plugins/bus'

const log = debug('hep:db:course')
/** @type {import('dexie').Dexie.Table} */
export const courses = db.courses

export const syncCourse = async () => {
  if (!await isLoggedIn()) throw new Error('需要登陆')
  const count = await courses.count()
  log('Current course count = ' + count)
  const last = count ? (await courses.orderBy('updated').offset(count - 1).limit(1).toArray())[0].updated : 0
  log('Last update = ' + last)
  const res = await axios.post('/course/sync', { last })
  log(`Fetched ${res.data.length} courses`)
  await courses.bulkPut(res.data)
  bus.$emit('toast', `课程同步成功：${res.data.length}条记录已更新`)
}

export const getCourse = async (_id) => {
  log(`Get course ${_id}`)
  let course = await courses.get(_id)
  if (course) return course
  await syncCourse()
  course = await courses.get(_id)
  if (course) return course
  throw new Error('无此课程')
}
