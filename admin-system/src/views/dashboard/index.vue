<template>
  <div class="dashboard-container">
    <header class="page-header">
      <h1>数据看板</h1>
    </header>
    <main class="content">
      <section class="stats-overview">
        <h2>数据概览</h2>
        <div class="stats-grid">
          <div class="stat-card merchant">
            <div class="stat-icon">🏢</div>
            <div class="stat-content">
              <div class="stat-title">商户总数</div>
              <div class="stat-value">{{ merchantCount }}</div>
            </div>
          </div>
          
          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-title">待审核商户</div>
              <div class="stat-value">{{ pendingMerchants }}</div>
            </div>
          </div>
          
          <div class="stat-card hotel">
            <div class="stat-icon">🏨</div>
            <div class="stat-content">
              <div class="stat-title">酒店数量</div>
              <div class="stat-value">{{ hotelCount }}</div>
            </div>
          </div>
          
          <div class="stat-card restaurant">
            <div class="stat-icon">🍽️</div>
            <div class="stat-content">
              <div class="stat-title">餐厅数量</div>
              <div class="stat-value">{{ restaurantCount }}</div>
            </div>
          </div>
          
          <div class="stat-card scenic">
            <div class="stat-icon">风景</div>
            <div class="stat-content">
              <div class="stat-title">景点数量</div>
              <div class="stat-value">{{ scenicCount }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getMarketerPage, getHotelPage, getRestaurantPage, getScenicPage } from '@/api/index';
// 数据概览
const merchantCount = getMarketerPage({page : 1,pageSize : 114514});
const pendingMerchants = getMarketerPage({page : 1,pageSize : 114514});
const hotelCount = ref(42);
const restaurantCount = ref(89);
const scenicCount = ref(33);

</script>

<style scoped>

</style>
