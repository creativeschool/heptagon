export default {
  users: `&_id, name, email, *tags, created, updated`,
  courses: `&_id, name, *tags, created, updated`,
  ucmap: `&_id, user, course, [user+course], created, updated`,
  files: `&_id, course, path, *tags, created, updated`,
  msgs: `&_id, course, user, *tags, created, updated`,
  notices: `&_id, created, updated`,
  configs: `&key`,
  logs: `++id, issuer, created`
}
