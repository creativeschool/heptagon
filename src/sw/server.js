self.addEventListener('install', function (event) {
  console.log('Service Worker installing.')
})

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating.')
})

self.addEventListener('message', function (e) {
  console.log(e)
})
