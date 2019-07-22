import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "basic" */'@/views/index.vue')
    },
    {
      path: '/about',
      component: () => import(/* webpackChunkName: "basic" */'@/views/about.vue')
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "basic" */'@/views/login.vue')
    },
    {
      path: '/info',
      component: () => import(/* webpackChunkName: "basic" */'@/views/info.vue')
    },
    {
      path: '/settings',
      component: () => import(/* webpackChunkName: "basic" */'@/views/settings.vue')
    },
    {
      path: '/profile',
      component: () => import(/* webpackChunkName: "require-login" */'@/views/profile.vue')
    },
    {
      path: '/course/:_id',
      props: true,
      component: () => import(/* webpackChunkName: "require-login" */'@/views/course/base.vue'),
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "require-login" */'@/views/course/index.vue'),
          props: true
        },
        {
          path: 'file',
          props: true,
          component: () => import(/* webpackChunkName: "require-login" */'@/views/course/file.vue')
        },
        {
          path: 'msg',
          props: true,
          component: () => import(/* webpackChunkName: "require-login" */'@/views/course/msg.vue')
        },
        {
          path: 'msg/new',
          props: true,
          component: () => import(/* webpackChunkName: "require-login" */'@/views/course/msgnew.vue')
        },
        {
          path: 'member',
          props: true,
          component: () => import(/* webpackChunkName: "require-login" */'@/views/course/member.vue')
        }
      ]
    }
  ]
})
