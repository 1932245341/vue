import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/layout/index.vue'
import { useUserStore } from '@/store/index.js'
import { useRoute, useRouter } from 'vue-router'

// 定义公共路由
const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    name: 'Login',
    meta: { title: '登录' }
  },
  {
    path: '/home',
    name: 'layout',
    component: Layout, // 使用布局组件
    redirect: '/home/dashboard',
    meta: { title: '管理系统' },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘' }
      }
      // 其他管理页面可在此添加为子路由
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 路由守卫
const publicRoutes = ['/login'];

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = !publicRoutes.includes(to.path);

  if (requiresAuth && !userStore.isAuthenticated) {
    // 未登录且访问受保护路由
    next('/login');
  } else if (!requiresAuth && userStore.isAuthenticated) {
    // 已登录且访问登录页，重定向到首页
    next('/home/dashboard');
  } else {
    // 角色权限验证
    if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
      // 没有权限访问该路由
      next('/403');
    } else {
      next();
    }
  }
});

export default router