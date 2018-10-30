import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import {routerMode} from '../config/env'

//懒加载组件
const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')

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
      ]
    }
  ],
  mode: routerMode
})
