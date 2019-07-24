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
      path: '/client',
      component: () => import(/* webpackChunkName: "basic" */'@/views/client.vue')
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
      path: '/course/:id',
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
          path: 'file/upload',
          props: true,
          component: () => process.env.IS_ELECTRON
            ? import(/* webpackChunkName: "require-login" */'@/views/course/electronfileupload.vue')
            : import(/* webpackChunkName: "require-login" */'@/views/course/webfileupload.vue')
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
