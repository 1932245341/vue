<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>管理员控制台</h1>
      <p>欢迎回来，{{ userInfo.username || '管理员' }}！</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon scenic">
          <el-icon><Location /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.scenic }}</h3>
          <p>景点数量</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon specialty">
          <el-icon><ShoppingBag /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.specialty }}</h3>
          <p>特产数量</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon parking">
          <el-icon><Van /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.parking }}</h3>
          <p>停车场数量</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon ticket">
          <el-icon><Ticket /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statsData.ticket }}</h3>
          <p>门票数量</p>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h2>快捷操作</h2>
      <div class="action-grid">
        <el-card class="action-card" @click="$router.push('/scenic/add')">
          <div class="action-content">
            <el-icon class="action-icon"><Plus /></el-icon>
            <span>添加景点</span>
          </div>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/ticket/add')">
          <div class="action-content">
            <el-icon class="action-icon"><Plus /></el-icon>
            <span>添加门票</span>
          </div>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/parking/list')">
          <div class="action-content">
            <el-icon class="action-icon"><Van /></el-icon>
            <span>管理停车场</span>
          </div>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/specialty/list')">
          <div class="action-content">
            <el-icon class="action-icon"><ShoppingBag /></el-icon>
            <span>管理特产</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getScenicList } from '@/api/scenic'
import { getSpecialtyList } from '@/api/specialty'
import { getParkingList } from '@/api/parking'
import { getTicketList } from '@/api/ticket'

const userStore = useUserStore()
const userInfo = userStore.getUserInfo()

// 统计数据
const statsData = ref({
  scenic: 0,
  specialty: 0,
  parking: 0,
  ticket: 0
})

// 加载统计数据
const loadStatsData = async () => {
  try {
    const [scenicRes, specialtyRes, parkingRes, ticketRes] = await Promise.allSettled([
      getScenicList({ page: 1, pageSize: 1 }),
      getSpecialtyList({ page: 1, pageSize: 1 }),
      getParkingList({ page: 1, pageSize: 1 }),
      getTicketList({ page: 1, pageSize: 1 })
    ])

    if (scenicRes.status === 'fulfilled' && scenicRes.value.code === 1) {
      statsData.value.scenic = scenicRes.value.data.total
    }
    if (specialtyRes.status === 'fulfilled' && specialtyRes.value.code === 1) {
      statsData.value.specialty = specialtyRes.value.data.total
    }
    if (parkingRes.status === 'fulfilled' && parkingRes.value.code === 1) {
      statsData.value.parking = parkingRes.value.data.total
    }
    if (ticketRes.status === 'fulfilled' && ticketRes.value.code === 1) {
      statsData.value.ticket = ticketRes.value.data.total
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
.admin-dashboard {
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

.stat-icon.scenic {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.specialty {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.parking {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.ticket {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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
  margin-top: 40px;
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
</style>