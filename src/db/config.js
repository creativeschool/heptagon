import debug from 'debug'
import { db } from './dexie'

const log = debug('hep:db:config')
/** @type {import('dexie'.Dexie.Table} */
export const configs = db.configs

/**
 * @param {string} key
 * @param {string} value
 */
export const set = async (key, value) => {
  log(`${key} = ${value}`)
  await configs.put({ key, value })
}

/**
 * @param {string} key
 */
export const get = async (key) => {
  log(`get ${key}`)
  const config = await configs.get(key)
  if (!config) return null
  return config.value
}

/**
 * @param {string} key
 */
export const reset = async (key) => {
  log(`delete ${key}`)
  await configs.delete(key)
}
