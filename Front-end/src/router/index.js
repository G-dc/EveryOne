import Vue from 'vue'
import Router from 'vue-router'

import { Message } from 'element-ui'

// import api from '@/api/index'
import * as publicFunction from '../../static/js/public'

const _import = require(`@/utils/import-${process.env.NODE_ENV}`)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/myDoing',
      component: _import('layout/layout'),
      children: [{
        path: '/myDoing',
        name: 'myDoing',
        component: _import('myDoing/myDoing')
      }, {
        path: '/myDone',
        name: 'myDone',
        component: _import('myDone/myDone')
      }]
    }, {
      path: '/login',
      name: 'Login',
      component: _import('login/login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 获取当前登录状态
  // const loginStatus = publicFunction.getCookieVal('isLogin')
  // const userInfo = publicFunction.getCookieVal('userId')

  let token = publicFunction.getCookieVal()

  // api.common.checkStatus().then(res => {
  //   if (res.code === 200) {
  //     next()
  //   } else {
  //     Message({
  //       message: '当前尚未登录，请先登录',
  //       type: 'warning',
  //       duration: 2000
  //     })
  //     next({
  //       path: '/login'
  //     })
  //   }
  // })
  if (to.path !== '/login') {
    if (token) {
      next()
    } else {
      Message({
        message: '当前尚未登录，请先登录',
        type: 'warning',
        duration: 2000
      })
      next({
        path: '/login'
      })
    }
  }
  next()
})

export default router
