import { createRouter, createWebHistory } from 'vue-router'

// 导入布局组件
const Layout = () => import('@/layout/index.vue')

// 导入页面组件
const Login = () => import('@/views/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const AdminDashboard = () => import('@/views/AdminDashboard.vue')
const MarketerDashboard = () => import('@/views/MarketerDashboard.vue')
const ScenicList = () => import('@/views/scenic/ScenicList.vue')
const ScenicForm = () => import('@/views/scenic/ScenicForm.vue')
const SpecialtyList = () => import('@/views/specialty/SpecialtyList.vue')
const ParkingList = () => import('@/views/parking/ParkingList.vue')
const ParkingForm = () => import('@/views/parking/ParkingForm.vue')
const TicketList = () => import('@/views/ticket/TicketList.vue')
const TicketForm = () => import('@/views/ticket/TicketForm.vue')
const RestaurantList = () => import('@/views/restaurant/RestaurantList.vue')
const RestaurantForm = () => import('@/views/restaurant/RestaurantForm.vue')
const HotelList = () => import('@/views/hotel/HotelList.vue')
const HotelForm = () => import('@/views/hotel/HotelForm.vue')
const RoomList = () => import('@/views/room/RoomList.vue')
const RoomForm = () => import('@/views/room/RoomForm.vue')
const DishList = () => import('@/views/dish/DishList.vue')
const DishForm = () => import('@/views/dish/DishForm.vue')
const MarketerList = () => import('@/views/marketer/MarketerList.vue')
const MarketerForm = () => import('@/views/marketer/MarketerForm.vue')
const NotFound = () => import('@/views/404.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '首页', icon: 'House' }
      }
    ]
  },
  {
    path: '/admin-dashboard',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: '管理员首页', icon: 'House', role: 'admin' }
      }
    ]
  },
  {
    path: '/marketer-dashboard',
    component: Layout,
    children: [
      {
        path: '',
        name: 'MarketerDashboard',
        component: MarketerDashboard,
        meta: { title: '商户首页', icon: 'House', role: 'marketer' }
      }
    ]
  },
  {
    path: '/scenic',
    component: Layout,
    redirect: '/scenic/list',
    meta: { title: '景点管理', icon: 'Location', role: 'admin' },
    children: [
      {
        path: 'list',
        name: 'ScenicList',
        component: ScenicList,
        meta: { title: '景点列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'ScenicAdd',
        component: ScenicForm,
        meta: { title: '添加景点', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'ScenicEdit',
        component: ScenicForm,
        meta: { title: '编辑景点', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/specialty',
    component: Layout,
    redirect: '/specialty/list',
    meta: { title: '特产管理', icon: 'ShoppingBag', role: 'admin' },
    children: [
      {
        path: 'list',
        name: 'SpecialtyList',
        component: SpecialtyList,
        meta: { title: '特产列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/ticket',
    component: Layout,
    redirect: '/ticket/list',
    meta: { title: '门票管理', icon: 'Ticket', role: 'admin' },
    children: [
      {
        path: 'list',
        name: 'TicketList',
        component: TicketList,
        meta: { title: '门票列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'TicketAdd',
        component: TicketForm,
        meta: { title: '添加门票', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'TicketEdit',
        component: TicketForm,
        meta: { title: '编辑门票', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/restaurant',
    component: Layout,
    redirect: '/restaurant/list',
    meta: { title: '餐厅管理', icon: 'Food', role: 'marketer' },
    children: [
      {
        path: 'list',
        name: 'RestaurantList',
        component: RestaurantList,
        meta: { title: '餐厅列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'RestaurantAdd',
        component: RestaurantForm,
        meta: { title: '添加餐厅', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'RestaurantEdit',
        component: RestaurantForm,
        meta: { title: '编辑餐厅', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/hotel',
    component: Layout,
    redirect: '/hotel/list',
    meta: { title: '酒店管理', icon: 'House', role: 'marketer' },
    children: [
      {
        path: 'list',
        name: 'HotelList',
        component: HotelList,
        meta: { title: '酒店列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'HotelAdd',
        component: HotelForm,
        meta: { title: '添加酒店', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'HotelEdit',
        component: HotelForm,
        meta: { title: '编辑酒店', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/room',
    component: Layout,
    redirect: '/room/list',
    meta: { title: '房间管理', icon: 'House', role: 'marketer' },
    children: [
      {
        path: 'list',
        name: 'RoomList',
        component: RoomList,
        meta: { title: '房间列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'RoomAdd',
        component: RoomForm,
        meta: { title: '添加房间', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'RoomEdit',
        component: RoomForm,
        meta: { title: '编辑房间', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/dish',
    component: Layout,
    redirect: '/dish/list',
    meta: { title: '菜品管理', icon: 'Food', role: 'marketer' },
    children: [
      {
        path: 'list',
        name: 'DishList',
        component: DishList,
        meta: { title: '菜品列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'DishAdd',
        component: DishForm,
        meta: { title: '添加菜品', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'DishEdit',
        component: DishForm,
        meta: { title: '编辑菜品', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/marketer',
    component: Layout,
    redirect: '/marketer/list',
    meta: { title: '营销人员管理', icon: 'User', role: 'admin' },
    children: [
      {
        path: 'list',
        name: 'MarketerList',
        component: MarketerList,
        meta: { title: '营销人员列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'MarketerAdd',
        component: MarketerForm,
        meta: { title: '添加营销人员', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'MarketerEdit',
        component: MarketerForm,
        meta: { title: '编辑营销人员', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/parking',
    component: Layout,
    redirect: '/parking/list',
    meta: { title: '停车场管理', icon: 'Van', role: 'admin' },
    children: [
      {
        path: 'list',
        name: 'ParkingList',
        component: ParkingList,
        meta: { title: '停车场列表', icon: 'List' }
      },
      {
        path: 'add',
        name: 'ParkingAdd',
        component: ParkingForm,
        meta: { title: '添加停车场', icon: 'Plus' }
      },
      {
        path: 'edit/:id',
        name: 'ParkingEdit',
        component: ParkingForm,
        meta: { title: '编辑停车场', icon: 'Edit' }
      }
    ]
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '页面未找到' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('user_token')
  const userRole = localStorage.getItem('user_role')
  
  if (to.path === '/login') {
    if (token) {
      // 已登录用户根据角色跳转到对应首页
      if (userRole === 'admin') {
        next('/admin-dashboard')
      } else if (userRole === 'marketer') {
        next('/marketer-dashboard')
      } else {
        next('/')
      }
    } else {
      next()
    }
  } else {
    if (token) {
      // 检查路由权限
      if (to.meta?.role && to.meta.role !== userRole) {
        // 没有权限访问该路由，跳转到对应的首页
        if (userRole === 'admin') {
          next('/admin-dashboard')
        } else if (userRole === 'marketer') {
          next('/marketer-dashboard')
        } else {
          next('/login')
        }
      } else {
        next()
      }
    } else {
      next('/login')
    }
  }
})

export default router