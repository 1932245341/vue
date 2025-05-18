<template>
  <div class="sidebar-wrapper">
    <div class="logo">
      <img src="../../assets/logo.svg" alt="Logo">
      <span v-if="!isCollapse">旅游服务平台</span>
    </div>
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      unique-opened
      router
    >
      <el-menu-item index="/dashboard">
        <i class="el-icon-house"></i>
        <span>控制台</span>
      </el-menu-item>
      
      <!-- 系统管理模块 - 仅管理员可见 -->
      <el-sub-menu v-if="role === 'admin'" index="admin">
        <template #title>
          <i class="el-icon-user"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/marketer">商户管理</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="scenic">
        <template #title>
          <i class="el-icon-location"></i>
          <span>景点管理</span>
        </template>
        <el-menu-item index="/scenic">景点列表</el-menu-item>
        <el-menu-item index="/ticket">门票管理</el-menu-item>
        <el-menu-item v-if="role === 'admin' || marketerStatus === 1" index="/specialty">特产管理</el-menu-item>
        <el-menu-item v-if="role === 'admin' || marketerStatus === 1" index="/parking">停车场管理</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="hotel">
        <template #title>
          <i class="el-icon-office-building"></i>
          <span>酒店管理</span>
        </template>
        <el-menu-item v-if="role === 'admin'" index="/hotel">酒店列表</el-menu-item>
        <el-menu-item v-if="role === 'admin' || marketerStatus === 1" index="/room">房间管理</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="restaurant">
        <template #title>
          <i class="el-icon-food"></i>
          <span>餐厅管理</span>
        </template>
        <el-menu-item v-if="role === 'admin'" index="/restaurant">餐厅列表</el-menu-item>
        <el-menu-item v-if="role === 'admin' || marketerStatus === 1" index="/dish">菜品管理</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/index';

const store = useUserStore()

const role = computed(() => store.role)
const marketerStatus = computed(() => store.marketerStatus)

const isCollapse = ref(false)
</script>

<style scoped>
.sidebar-wrapper {
  width: 210px;
  background-color: #304156;
  height: 100vh;
  overflow-y: auto;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #2b2f3a;
  color: #fff;
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
</style>