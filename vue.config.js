const path = require('path')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'src/sw/server.js')
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
