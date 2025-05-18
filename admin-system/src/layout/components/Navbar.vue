<template>
  <div class="navbar">
    <div class="left-section">
      <el-button 
        icon="el-icon-s-fold"
        size="small"
        @click="toggleSidebar"
      ></el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          {{ item.meta.title || '未知页面' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="right-section">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }} ({{ roleDisplay }})<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/index'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

// 用户名
const username = computed(() => store.userInfo?.username || '用户')

// 角色显示文本
const roleDisplay = computed(() => {
  return store.role === 'admin' ? '管理员' : '商户'
})

// 面包屑路径
const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title)
})

// 侧边栏展开/折叠状态
const sidebarCollapsed = ref(false)

// 切换侧边栏
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 下拉菜单操作
function handleCommand(command) {
  if (command === 'logout') {
    // 调用退出登录API
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.navbar {
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.left-section {
  display: flex;
  align-items: center;
}

.left-section .el-button {
  margin-right: 15px;
}

.el-breadcrumb {
  display: inline-block;
}

.right-section {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #333;
}
</style>