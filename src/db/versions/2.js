export default {
  users: `&_id, name, email, *tags`,
  courses: `&_id, name, *tags`,
  ucmap: `&_id, user, course, [user+course]`,
  files: `&_id, course, path, *tags`,
  msgs: `&_id, course, user, *tags`,
  configs: `&key`,
  logs: `++id, issuer, created`
}
