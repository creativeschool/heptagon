import runtime from 'serviceworker-webpack-plugin/lib/runtime'

/** @type {Promise<ServiceWorkerRegistration>} */
const registration = runtime.register()

registration.then(registration => {
  registration.active.postMessage('ddd')
})
