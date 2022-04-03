import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import About from '../components/About.vue'
import Users from '../components/users/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import AddGoods from '../components/goods/Add.vue'
import Orders from '../components/order/Orders.vue'
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/about',
    component: About,
    redireck: '/welcome',
    children: [
      {
        path: '/',
        component: Users
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/add',
        component: AddGoods
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }

]

const router = new VueRouter({
  routes
})
// 全局守卫
router.beforeEach((to, from, next) => {
  // 用户进入登录页放行
  if (to.path === '/login') return next()
  const val = window.sessionStorage.getItem('token')
  // 如果没有登录跳转到登录界面
  if (!val) return next('/login')
  next()
})
export default router
