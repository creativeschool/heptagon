import Dexie from 'dexie'
import { bus } from '@/plugins/bus'

export const db = new Dexie('heptagon')
db.version(1).stores({
  users: `&_id, name, email, *tags, created, updated`,
  courses: `&_id, name, *tags, created, updated`,
  files: `&_id, course, path, *tags, created, updated`,
  msgs: `&_id, course, user, *tags, created, updated`,
  configs: `&key`,
  logs: `++id, issuer, created`
})

export const reinit = async () => {
  await db.delete()
  await db.open()
  bus.$emit('toast', '数据库初始化成功')
  bus.$emit('chrome_update')
}
