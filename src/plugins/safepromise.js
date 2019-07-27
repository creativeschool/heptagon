import { bus } from './bus'

window.addEventListener('unhandledrejection', function (event) {
  bus.$emit('toast', event.reason.message)
  event.preventDefault()
})
