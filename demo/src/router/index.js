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
    redirect: '/welcome',
    meta: {
      auth: true
    },
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/views/Home/Welcome')
      },
      {
        path: '/users', // 用户列表页面
        name: 'Users',
        component: () => import('@/views/Home/Users')
      },
      {
        path: '/roles', // 角色列表页面
        name: 'Roles',
        component: () => import('../views/Home/Rights/roles.vue')
      },
      {
        path: '/rights', // 权限列表页面
        name: 'Rights',
        component: () => import('../views/Home/Rights/rights.vue')
      },
      {
        path: '/goods', // 商品列表页面
        name: 'goods',
        component: () => import('../views/Home/Goods/goodsList')
      },
      {
        path: '/params', // 分类参数列表页面
        name: 'params',
        component: () => import('../views/Home/Goods/params')
      },
      {
        path: '/categories', // 商品分类列表页面
        name: 'categories',
        component: () => import('../views/Home/Goods/categories')
      },
      {
        path: '/add', // 添加商品列表页面
        name: 'add',
        component: () => import('../views/Home/Goods/goodsAdd')
      },
      {
        path: '/orders', // 订单列表页面
        name: 'orders',
        component: () => import('../views/Home/Orders')
      },
      {
        path: '/reports', // 数据统计页面
        name: 'reports',
        component: () => import('../views/Home/Reports')
      },
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
