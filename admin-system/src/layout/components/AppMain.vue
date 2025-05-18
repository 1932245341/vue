<template>
  <div class="app-main-container">
    <router-view />
  </div>
</template>

<script setup>
// 这里可以添加页面切换动画等增强功能
</script>

<style scoped>
.app-main-container {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
}
</style>