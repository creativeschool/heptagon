import Dexie from 'dexie'
import { bus } from '@/plugins/bus'
import versions from './versions'

export const db = new Dexie('heptagon')

versions.forEach(([i, s]) => db.version(i).stores(s))

export const reinit = async () => {
  await db.delete()
  await db.open()
  bus.$emit('toast', '数据库初始化成功')
  bus.$emit('chrome_update')
}
