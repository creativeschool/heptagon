import Dexie from 'dexie'
import { bus } from '@/plugins/bus'
import versions from './versions'
import { get, set } from './config'

export const db = new Dexie('heptagon')

versions.forEach(([i, s]) => db.version(i).stores(s))

const configsWillSave = ['base-url']

/**
 * @param {boolean} notoast
 */
export const reinit = async (notoast) => {
  const configs = await Promise.all(configsWillSave.map(x => get(x)))
  await db.delete()
  await db.open()
  await Promise.all(configsWillSave.map((x, i) => set(x, configs[i])))
  if (!notoast) {
    bus.$emit('toast', '数据库初始化成功')
  }
  bus.$emit('chrome_update')
}
