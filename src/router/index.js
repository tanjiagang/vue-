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
const shop = r => require.ensure([], () => r(require('@/page/shop/shop')), 'shop')
const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login')  
const confirmOrder = r => require.ensure([], () => r(require('@/page/confirmOrder/confirmOrder')), 'confirmOrder')  
const payment = r => require.ensure([], () => r(require('@/page/confirmOrder/childcompoents/payment')), 'payment')  
const food = r => require.ensure([], () => r(require('@/page/food/food')), 'food')

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
        //特色商铺列表页
        {
            path: '/food',
            component: food
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
        },
        {
            path: '/shop',
            component: shop
        },
        {
            path: '/login',
            component: login
        },
        {
            path: '/confirmOrder',
            component: confirmOrder,  
            children: [{
                path: '/confirmOrder/payment',
                component: payment
            }]
        }
      ]
    }
  ],
  mode: routerMode
})
