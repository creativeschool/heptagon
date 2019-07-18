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
      component: () => import(/* webpackChunkName: "basic" */'@/views/home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "basic" */'@/views/about.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "basic" */'@/views/login.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import(/* webpackChunkName: "basic" */'@/views/info.vue')
    },
    {
      path: '/course/:_id',
      name: 'course',
      props: true,
      component: () => import(/* webpackChunkName: "course" */'@/views/course.vue')
    },
    {
      path: '/course/:_id/file',
      name: 'file',
      props: true,
      component: () => import(/* webpackChunkName: "course" */'@/views/file.vue')
    },
    {
      path: '/course/:_id/msg',
      name: 'msg',
      props: true,
      component: () => import(/* webpackChunkName: "course" */'@/views/msg.vue')
    }
  ]
})
