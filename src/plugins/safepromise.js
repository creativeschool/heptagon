import { bus } from './bus'
import { handleError } from './error'

window.addEventListener('unhandledrejection', function (event) {
  bus.$emit('toast', event.reason.message)
  handleError(event.reason)
  event.preventDefault()
})
