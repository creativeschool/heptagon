import uuid from 'uuid/v4'
import debug from 'debug'
import { db } from './dexie'
import { bus } from '@/plugins/bus'

const log = debug('hep:db:log')
export const pageId = uuid()
/** @type {import('dexie').Dexie.Table} */
export const logs = db.logs

bus.$on('toast', (msg) => {
  log(msg)
  logs.add({ issuer: pageId, created: +new Date(), msg })
})
