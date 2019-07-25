const os = require('os')
const { DefinePlugin } = require('webpack')
const gitRevision = require('git-revision')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const packageInfo = require('./package.json')

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
      new DefinePlugin({
        'GIT_HASH': JSON.stringify(gitRevision('short')),
        'GIT_BRANCH': JSON.stringify(gitRevision('branch')),
        'APP_NAME': JSON.stringify('教学资源开放平台'),
        'BUILD_DATE': JSON.stringify((new Date()).toLocaleString()),
        'BUILD_MACHINE': JSON.stringify(os.hostname())
      })
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    },
    disableHostCheck: true
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['form-data'],
      builderOptions: {
        // eslint-disable-next-line no-template-curly-in-string
        artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
        win: {
          publisherName: packageInfo.author
        },
        linux: {
          target: [
            { target: 'AppImage', arch: ['x64', 'ia32'] },
            { target: 'rpm', arch: ['x64', 'ia32'] },
            { target: 'pacman', arch: ['x64', 'ia32'] },
            { target: 'deb', arch: ['x64', 'ia32'] },
            { target: 'tar.xz', arch: ['x64', 'ia32'] }
          ]
        }
      }
    }
  }
}
