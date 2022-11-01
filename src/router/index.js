import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)
// 使用路由懒加载导入组件,让首页加载文件体积减小打开更快
const routes = [
  { path: '/reg', component: () => import('@/views/register') },
  { path: '/login', component: () => import('@/views/login') },
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      { path: 'home', component: () => import('@/views/home') },
      { path: 'user-info', component: () => import('@/views/user/userInfo.vue') },
      { path: 'user-avatar', component: () => import('@/views/user/userAvatar') },
      { path: 'user-pwd', component: () => import('@/views/user/userPwd') },
      { path: 'art-cate', component: () => import('@/views/article/artCate.vue') },
      { path: 'art-list', component: () => import('@/views/article/artList.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/reg'] // 路由白名单无需登录(token)可以访问的路由地址

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 成功登录了保存了token
  if (token) {
    // 每跳转一次路由即调用一次全局前置守卫函数 则会获得一次信息所以增加限制条件防止多次请求
    // 本地有token且无用户信息才去请求用户信息存到vuex里
    if (token && !store.state.userInfo.username) {
      // 调用action方法请求数据
      store.dispatch('getUserInfoAction')
    }
    next()
  } else {
    // includes(值),作用判断值是否在数组里出现过,出现则返回true
    if (whiteList.includes(to.path)) {
      // 未登录,可以访问的路由地址(白名单里的地址)则放行直接挂载组件不再触发路防止出现递归死循环
      next()
    } else {
      // 其他情况则强制回到登录页
      next('/login')
    }
  }
})

export default router
