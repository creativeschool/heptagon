export const normalizePath = path =>
  process.platform === 'win32' ? path.replace(/\\/g, '/') : path

export const filetype = path => {
  path = path.substr(path.lastIndexOf('/') + 1)
  const i = path.lastIndexOf('.')
  return i === -1 ? 'plain' : path.substr(i + 1)
}
