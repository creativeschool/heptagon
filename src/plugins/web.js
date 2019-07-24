const { bus } = require('./bus')

/* global GIT_HASH, GIT_BRANCH, BUILD_DATE, BUILD_MACHINE */

module.exports = {
  versions: {
    '版本控制散列': GIT_HASH,
    '版本控制分支': GIT_BRANCH,
    '构建时间': BUILD_DATE,
    '构建机器': BUILD_MACHINE,
    '运行时': '浏览器'
  },
  close () {
    location.href = 'about:blank'
  },
  maximize () {
  },
  minimize () {
  },
  devTools () {
    bus.$emit('toast', '请手动打开')
  },
  openUrl (url) {
    window.open(url)
  },
  showErrorBox (title, content) {
    alert(title + '\n' + content)
  },
  reload () {
    location.reload()
  }
}
