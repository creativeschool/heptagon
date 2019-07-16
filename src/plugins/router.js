import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "basic" */'../views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "basic" */'../views/login.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import(/* webpackChunkName: "basic" */'../views/info.vue')
    }
  ]
})
