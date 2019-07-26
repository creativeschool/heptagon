import jayson from 'jayson'

const aria2 = jayson.Client.http({
  host: 'localhost',
  port: 6800,
  path: '/jsonrpc'
})

/**
 * @param {string[]} uris
 * @param {any} options
 */
export const addUri = (uris, options) => new Promise((resolve, reject) => {
  console.log(uris)
  aria2.request('aria2.addUri', [uris, options], (err, res) => {
    if (err) return reject(err)
    console.log(res)
    return resolve()
  })
})
