<template>
  <div class="sidebar-container">
    <!-- Logo -->
    <div class="sidebar-logo">
      <img src="/favicon.ico" alt="Logo" class="logo-img" />
      <span class="logo-text">后台管理系统</span>
    </div>
    
    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapsed"
      :unique-opened="true"
      :router="true"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#ffffff"
      class="sidebar-menu"
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <!-- 单级菜单 -->
        <el-menu-item
          v-if="!route.children || route.children.length === 1"
          :index="route.children ? getFullPath(route.path, route.children[0].path) : route.path"
          @click="handleMenuClick(route.children ? route.children[0] : route, route.path)"
        >
          <el-icon><component :is="route.meta?.icon || 'Menu'" /></el-icon>
          <template #title>
            {{ route.children ? route.children[0].meta?.title : route.meta?.title }}
          </template>
        </el-menu-item>
        
        <!-- 多级菜单 -->
        <el-sub-menu v-else :index="route.path">
          <template #title>
            <el-icon><component :is="route.meta?.icon || 'Menu'" /></el-icon>
            <span>{{ route.meta?.title }}</span>
          </template>
          
          <el-menu-item
            v-for="child in route.children"
            :key="child.path"
            :index="getFullPath(route.path, child.path)"
            @click="handleMenuClick(child, route.path)"
          >
            <el-icon><component :is="child.meta?.icon || 'Menu'" /></el-icon>
            <template #title>{{ child.meta?.title }}</template>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 计算当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 从路由配置中过滤出菜单项
const menuRoutes = computed(() => {
  const userRole = userStore.getUserRole()
  
  return router.options.routes.filter(route => {
    // 排除登录页、404页面和通配符路由
    if (route.path === '/login' || route.path === '/404' || route.path.includes('*')) {
      return false
    }
    
    // 排除原始的dashboard路由
    if (route.path === '/') {
      return false
    }
    
    // 如果路由有角色限制，检查用户角色
    if (route.meta?.role) {
      return route.meta.role === userRole
    }
    
    // 检查子路由是否有角色限制
    if (route.children && route.children.length > 0) {
      // 如果所有子路由都有角色限制且不匹配当前用户角色，则不显示该路由
      const hasMatchingChild = route.children.some(child => {
        if (child.meta?.role) {
          return child.meta.role === userRole
        }
        return true // 没有角色限制的子路由
      })
      return hasMatchingChild
    }
    
    // 没有角色限制的路由只有在用户有角色时才显示
    return userRole !== ''
  })
})

// 获取完整路径
const getFullPath = (parentPath, childPath) => {
  if (childPath.startsWith('/')) {
    return childPath
  }
  // 处理根路径的特殊情况
  if (parentPath === '/') {
    return '/' + childPath
  }
  return parentPath + '/' + childPath
}

// 处理菜单点击
const handleMenuClick = (menuItem, parentPath = '') => {
  let fullPath = menuItem.path
  
  // 如果是子路由且路径不是以/开头，需要拼接父路径
  if (parentPath && !menuItem.path.startsWith('/')) {
    // 处理根路径的特殊情况
    if (parentPath === '/') {
      fullPath = '/' + menuItem.path
    } else {
      fullPath = parentPath + '/' + menuItem.path
    }
  }
  
  if (fullPath && fullPath !== route.path) {
    router.push(fullPath)
  }
}

// 是否折叠（从父组件传入）
defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #2b3a4b;
  color: #fff;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.logo-text {
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  border: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 250px;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #409EFF !important;
  color: #ffffff !important;
}

:deep(.el-menu-item.is-active .el-icon) {
  color: #ffffff !important;
}
</style>