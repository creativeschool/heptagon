import Dexie from 'dexie'
import { bus } from '@/plugins/bus'

export const db = new Dexie('heptagon')

db.version(2).stores({
  users: `&_id, name, email, *tags`,
  courses: `&_id, name, *tags`,
  ucmap: `&_id, user, course, [user+course]`,
  files: `&_id, course, path, *tags`,
  msgs: `&_id, course, user, *tags`,
  configs: `&key`,
  logs: `++id, issuer, created`
})

export const reinit = async () => {
  await db.delete()
  await db.open()
  bus.$emit('toast', '数据库初始化成功')
  bus.$emit('chrome_update')
}
