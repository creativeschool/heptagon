import { axios } from '@/plugins/axios'
import debug from 'debug'
import { db } from './dexie'
import { isLoggedIn } from './user'
import { bus } from '@/plugins/bus'
import { getCourse } from './course'

const log = debug('hep:db:file')
/** @type {import('dexie').Dexie.Table} */
export const files = db.files

/**
 * @param {string} course
 */
export const syncFile = async (course) => {
  if (!await isLoggedIn()) throw new Error('需要登录')
  const obj = await getCourse(course)
  if (!obj) throw new Error('No such course')
  const count = await files.where('course').equals(course).count()
  log(`@${course} current file count = ${count}`)
  const last = count ? (await files.where('course').equals(course).sortBy('updated'))[count - 1].updated : 0
  log(`@${course} last update = ${last}`)
  const res = await axios.post('/file/sync', { last }, { headers: { 'x-course-id': course } })
  log(`@${course} fetched ${res.data.length} files`)
  await files.bulkPut(res.data)
  bus.$emit('toast', `课程${obj.name}文件同步成功：${res.data.length}条记录已更新`)
}
