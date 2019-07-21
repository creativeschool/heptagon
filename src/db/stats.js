import { db } from './dexie'

export const getStats = async () => {
  return Promise.all(['users', 'courses', 'ucmap', 'files', 'msgs', 'configs', 'logs'].map(async x => [x, await db[x].count()]))
}
