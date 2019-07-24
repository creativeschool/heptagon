/**
 * @param {any[]} files
 */
export const generateCompressedTrie = (files) => {
  const m = new Map()
  m.path = '/'
  for (const file of files) {
    // path is in the form of `/folder/subfolder/.../name`
    // So ignore the first '/'
    /** @type {string[]} */
    const tokens = file.path.substr(1).split('/')
    let n = m
    for (let i = 0; i < tokens.length - 1; i++) {
      const token = tokens[i]
      if (!n.has(token)) {
        const newNode = new Map()
        newNode.path = n.path + '/' + token
        n.set(token, newNode)
      }
      n = n.get(token)
    }
    const name = tokens[tokens.length - 1]
    if (!n.has(name)) {
      n.set(name, [file])
    } else {
      n.get(name).push(file)
    }
  }
  return m
}

export const generateTreeviewData = (files) => {
  const root = { id: 0, name: '/', children: [] }
  const queue = [[generateCompressedTrie(files), root]]
  let counter = 0
  while (queue.length) {
    const [head, root] = queue.shift()
    for (const [key, value] of head) {
      if (value instanceof Map) {
        // Subfolder
        const newRoot = { id: ++counter, name: key + '/', children: [] }
        root.children.push(newRoot)
        queue.push([value, newRoot])
      } else {
        // Files
        for (const file of value) {
          root.children.push({ id: ++counter, name: key, file })
        }
      }
    }
  }
  return [root]
}
