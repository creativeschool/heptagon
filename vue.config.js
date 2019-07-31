const os = require('os')
const { DefinePlugin } = require('webpack')
const gitRevision = require('git-revision')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    epdf: {
      entry: 'src/viewer.js',
      template: 'public/epdf.html',
      filename: 'epdf.html'
    }
  },
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
      new DefinePlugin({
        'GIT_HASH': JSON.stringify(gitRevision('short')),
        'GIT_BRANCH': JSON.stringify(gitRevision('branch')),
        'APP_NAME': JSON.stringify('教学资源开放平台'),
        'BUILD_DATE': JSON.stringify((new Date()).toLocaleString()),
        'BUILD_MACHINE': JSON.stringify(os.hostname()),
        'HEXAGON_URL': JSON.stringify('https://hexagon.zhangzisu.cn/api')
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
      externals: ['form-data', 'axios'],
      builderOptions: {
        directories: {
          buildResources: 'resources'
        },
        // eslint-disable-next-line no-template-curly-in-string
        artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
        win: {
          extraFiles: [
            { from: 'bin/win', to: 'bin' }
          ],
          fileAssociations: {
            ext: 'epdf',
            description: 'Encrypted Portable Document Format',
            icon: 'icons/icon.ico'
          }
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
