import Dexie from 'dexie'

const db = new Dexie('heptagon')
db.version(1).stores({
  users: `_id, name, email, *tags, created, updated`,
  courses: `_id, name, *tags, created, updated`,
  files: `_id, course, path, *tags, created, updated`,
  msgs: `_id, course, user, *tags, created, updated`,
  configs: `key`,
  logs: `++id, issuer, created`
})

export default db
