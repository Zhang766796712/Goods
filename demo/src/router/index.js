import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决跳转子路由报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login', //登录页面
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    name: 'home',
    meta: {
      auth: true
    },
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/users', // 用户列表页面
        name: 'Users',
        component: () => import('@/views/Home/Users')
      },
      {
        path: '/roles', // 角色列表页面
        name: 'Roles',
        component: () => import('../views/Home/Roles')
      },
      {
        path: '/rights', // 权限列表页面
        name: 'Rights',
        component: () => import('../views/Home/Rights')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 实现页面鉴权
router.beforeEach((to, from, next) => {
  // console.log(to)
  // 判断meta里面的auth是否为true
  const flag = to.matched.some((item) => {
    return item.meta.auth
  })
  if (!flag) {
    // 不需要鉴权 直接放行
    next()
  } else {
    // 需要鉴权还有判断有没有token
    const token = sessionStorage.getItem('token')
    // 如果没有token 跳转到登录页
    if (!token) {
      return next({
        path: '/login'
      })
    }
    next()
  }
  next()
})

export default router
