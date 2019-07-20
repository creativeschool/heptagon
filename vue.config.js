const { DefinePlugin } = require('webpack')
const gitRevision = require('git-revision')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
      new DefinePlugin({
        'GIT_HASH': JSON.stringify(gitRevision('short')),
        'GIT_BRANCH': JSON.stringify(gitRevision('branch'))
      })
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  }
}
