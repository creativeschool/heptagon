import '@mdi/font/css/materialdesignicons.css'
import './sw/client'
import Vue from 'vue'
import App from './App.vue'
import router from '@/plugins/router'
import vuetify from '@/plugins/vuetify'

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
