<template>
  <div class="marketer-dashboard">
    <div class="dashboard-header">
      <h1>商户控制台</h1>
      <p>欢迎回来，{{ userInfo.username || '商户' }}！</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon restaurant">
          <el-icon><Food /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.restaurant }}</h3>
          <p>餐厅数量</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon hotel">
          <el-icon><House /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.hotel }}</h3>
          <p>酒店数量</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon room">
          <el-icon><House /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.room }}</h3>
          <p>房间数量</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon dish">
          <el-icon><Food /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.dish }}</h3>
          <p>菜品数量</p>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h2>快捷操作</h2>
      <div class="action-grid">
        <el-card class="action-card" @click="$router.push('/restaurant/add')">
          <div class="action-content">
            <el-icon class="action-icon"><Plus /></el-icon>
            <span>添加餐厅</span>
          </div>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/hotel/add')">
          <div class="action-content">
            <el-icon class="action-icon"><Plus /></el-icon>
            <span>添加酒店</span>
          </div>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/room/add')">
          <div class="action-content">
            <el-icon class="action-icon"><Plus /></el-icon>
            <span>添加房间</span>
          </div>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/dish/add')">
          <div class="action-content">
            <el-icon class="action-icon"><Plus /></el-icon>
            <span>添加菜品</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 业务概览 -->
    <div class="business-overview">
      <h2>业务概览</h2>
      <div class="overview-grid">
        <el-card class="overview-card">
          <div class="overview-header">
            <h3>餐厅管理</h3>
            <el-button type="primary" size="small" @click="$router.push('/restaurant/list')">查看全部</el-button>
          </div>
          <p>管理您的餐厅信息、菜品和营业状态</p>
        </el-card>
        
        <el-card class="overview-card">
          <div class="overview-header">
            <h3>酒店管理</h3>
            <el-button type="primary" size="small" @click="$router.push('/hotel/list')">查看全部</el-button>
          </div>
          <p>管理您的酒店信息、房间和预订状态</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getRestaurantList } from '@/api/restaurant'
import { getHotelList } from '@/api/hotel'
import { getRoomList } from '@/api/room'
import { getDishList } from '@/api/dish'

const userStore = useUserStore()
const userInfo = userStore.getUserInfo()

// 统计数据
const statsData = ref({
  restaurant: 0,
  hotel: 0,
  room: 0,
  dish: 0
})

// 加载统计数据
const loadStatsData = async () => {
  try {
    const [restaurantRes, hotelRes, roomRes, dishRes] = await Promise.allSettled([
      getRestaurantList({ page: 1, pageSize: 1 }),
      getHotelList({ page: 1, pageSize: 1 }),
      getRoomList({ page: 1, pageSize: 1 }),
      getDishList({ page: 1, pageSize: 1 })
    ])

    if (restaurantRes.status === 'fulfilled' && restaurantRes.value.code === 1) {
      statsData.value.restaurant = restaurantRes.value.data.total
    }
    if (hotelRes.status === 'fulfilled' && hotelRes.value.code === 1) {
      statsData.value.hotel = hotelRes.value.data.total
    }
    if (roomRes.status === 'fulfilled' && roomRes.value.code === 1) {
      statsData.value.room = roomRes.value.data.total
    }
    if (dishRes.status === 'fulfilled' && dishRes.value.code === 1) {
      statsData.value.dish = dishRes.value.data.total
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStatsData()
})
</script>

<style scoped>
.marketer-dashboard {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #303133;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.dashboard-header p {
  color: #606266;
  font-size: 16px;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.stat-icon.restaurant {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.stat-icon.hotel {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.stat-icon.room {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.stat-icon.dish {
  background: linear-gradient(135deg, #ff8a80 0%, #ffb74d 100%);
}

.stat-content h3 {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.stat-content p {
  color: #909399;
  margin: 0;
  font-size: 14px;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  color: #303133;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ebeef5;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.action-icon {
  font-size: 32px;
  color: #409eff;
  margin-bottom: 12px;
}

.action-content span {
  color: #303133;
  font-weight: 500;
}

.business-overview h2 {
  color: #303133;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.overview-card {
  padding: 20px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.overview-header h3 {
  color: #303133;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.overview-card p {
  color: #606266;
  margin: 0;
  line-height: 1.5;
}
</style>