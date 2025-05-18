<template>
  <div class="app-wrapper">
    <sidebar />
    <div class="main-container">
      <navbar />
      <tags-view />
      <app-main />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import TagsView from './components/TagsView.vue'
</script>

<style scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>