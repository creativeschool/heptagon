import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/plugins/safepromise'
import '@/db'
import Vue from 'vue'
import App from '@/app.vue'
import router from '@/plugins/router'
import vuetify from '@/plugins/vuetify'
import '@/css/main.scss'

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
