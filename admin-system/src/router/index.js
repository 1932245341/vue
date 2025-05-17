import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/login.vue'),
      meta: { title: '登录', hidden: true }
    },
    // {
    //   path: '/',
    //   component: Layout,
    //   redirect: '/dashboard',
    //   children: [
    //     {
    //       path: 'dashboard',
    //       name: 'Dashboard',
    //       component: () => import('../views/dashboard/index.vue'),
    //       meta: { title: '仪表盘', icon: 'dashboard' }
    //     }
    //   ]
    // },
    // {
    //   path: '/scenic',
    //   component: Layout,
    //   redirect: '/scenic/list',
    //   meta: { title: '景点管理', icon: 'scenic' },
    //   children: [
    //     {
    //       path: 'list',
    //       name: 'ScenicList',
    //       component: () => import('../views/scenic/list.vue'),
    //       meta: { title: '景点列表' }
    //     },
    //     {
    //       path: 'add',
    //       name: 'ScenicAdd',
    //       component: () => import('../views/scenic/form.vue'),
    //       meta: { title: '添加景点' }
    //     },
    //     {
    //       path: 'edit/:id',
    //       name: 'ScenicEdit',
    //       component: () => import('../views/scenic/form.vue'),
    //       meta: { title: '编辑景点', hidden: true }
    //     }
    //   ]
    // },
    // // 其他模块路由配置...
  ]
})

export default router