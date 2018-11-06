import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import {routerMode} from '../config/env'

//懒加载组件
const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const city = r => require.ensure([], () => r(require('@/page/city/city')), 'city')
const msite = r => require.ensure([], () => r(require('@/page/msite/msite')), 'msite')
const search = r => require.ensure([], () => r(require('@/page/search/search')), 'search')
const order = r => require.ensure([], () => r(require('@/page/order/order')), 'order')
const profile = r => require.ensure([], () => r(require('@/page/profile/profile')), 'profile')  

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: App, //顶层路由
      children: [	//二级路由。对应App.vue
      	//地址为空时跳转home页面
        {
            path: '',
            redirect: '/home'
        },
        {
            path: '/home',
            component: home
        },
        {
            path: '/city/:cityid',
            component: city
        },
        {
            path: '/msite',
            component: msite
        },
        {
            path: '/search/:geohash',
            component: search
        },
        {
            path: '/order',
            component: order
        },
        {
            path: '/profile',
            component: profile
        }
      ]
    }
  ],
  mode: routerMode
})
