import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './db'
import Vue from 'vue'
import App from './app.vue'
import router from '@/plugins/router'
import vuetify from '@/plugins/vuetify'

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
