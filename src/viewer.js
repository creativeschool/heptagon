import '@mdi/font/css/materialdesignicons.css'
import '@/plugins/safepromise'
import Vue from 'vue'
import App from './viewer.vue'
import vuetify from '@/plugins/vuetify'
import '@/css/main.scss'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
