<template>
  <div class="dashboard-container">
    <!-- 欢迎信息 -->
    <div class="welcome-card">
      <el-card>
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ userInfo.username || '管理员' }}！</h2>
            <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
          </div>
          <div class="welcome-avatar">
            <el-avatar :size="80" :src="userInfo.avatar">
              <el-icon size="40"><User /></el-icon>
            </el-avatar>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="stat in statsData" :key="stat.title">
          <el-card class="stat-card" :class="stat.type">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon :size="30">
                  <component :is="stat.icon" />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stat.value }}</div>
                <div class="stat-title">{{ stat.title }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 访问量趋势 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>访问量趋势</span>
                <el-button type="text">查看详情</el-button>
              </div>
            </template>
            <div class="chart-container" id="visitChart">
              <!-- 这里可以集成 ECharts 或其他图表库 -->
              <div class="chart-placeholder">
                <el-icon size="60" color="#ddd"><TrendCharts /></el-icon>
                <p>图表数据加载中...</p>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 订单统计 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>订单统计</span>
                <el-button type="text">查看详情</el-button>
              </div>
            </template>
            <div class="chart-container" id="orderChart">
              <div class="chart-placeholder">
                <el-icon size="60" color="#ddd"><PieChart /></el-icon>
                <p>图表数据加载中...</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 快捷操作 -->
    <div class="quick-actions">
      <el-card>
        <template #header>
          <span>快捷操作</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="4" v-for="action in quickActions" :key="action.title">
            <div class="action-item" @click="handleQuickAction(action.path)">
              <el-icon :size="24" :color="action.color">
                <component :is="action.icon" />
              </el-icon>
              <span>{{ action.title }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getScenicList } from '@/api/scenic'
import { getSpecialtyList } from '@/api/specialty'
import { getParkingList } from '@/api/parking'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.getUserInfo())

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 统计数据
const statsData = ref([
  {
    title: '景点数量',
    value: '0',
    icon: 'Location',
    type: 'primary'
  },
  {
    title: '特产数量',
    value: '0',
    icon: 'ShoppingBag',
    type: 'success'
  },
  {
    title: '停车场数量',
    value: '0',
    icon: 'Van',
    type: 'warning'
  },
  {
    title: '今日订单',
    value: '0',
    icon: 'Document',
    type: 'danger'
  }
])

// 快捷操作
const quickActions = ref([
  {
    title: '景点管理',
    icon: 'Location',
    color: '#409EFF',
    path: '/scenic/list'
  },
  {
    title: '特产管理',
    icon: 'ShoppingBag',
    color: '#67C23A',
    path: '/specialty/list'
  },
  {
    title: '停车场管理',
    icon: 'Van',
    color: '#E6A23C',
    path: '/parking/list'
  },
  {
    title: '订单管理',
    icon: 'List',
    color: '#F56C6C',
    path: '/order'
  },
  {
    title: '用户管理',
    icon: 'User',
    color: '#909399',
    path: '/admin'
  },
  {
    title: '系统设置',
    icon: 'Setting',
    color: '#606266',
    path: '/settings'
  }
])

// 处理快捷操作点击
const handleQuickAction = (path) => {
  router.push(path)
}

// 组件挂载后的操作
onMounted(() => {
  // 这里可以加载统计数据
  loadDashboardData()
})

// 加载仪表板数据
const loadDashboardData = async () => {
  try {
    // 并行请求提高性能
    const [scenicRes, specialtyRes, parkingRes] = await Promise.allSettled([
      getScenicList({ page: 1, pageSize: 1 }),
      getSpecialtyList({ page: 1, pageSize: 1 }),
      getParkingList({ page: 1, pageSize: 1 })
    ])
    
    // 更新景点数量
    if (scenicRes.status === 'fulfilled' && scenicRes.value.code === 1) {
      statsData.value[0].value = scenicRes.value.data?.total || 0
    }
    
    // 更新特产数量
    if (specialtyRes.status === 'fulfilled' && specialtyRes.value.code === 1) {
      statsData.value[1].value = specialtyRes.value.data?.total || 0
    }
    
    // 更新停车场数量
    if (parkingRes.status === 'fulfilled' && parkingRes.value.code === 1) {
      statsData.value[2].value = parkingRes.value.data?.total || 0
    }
    
    console.log('仪表板统计数据加载完成')
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
    ElMessage.error('加载统计数据失败')
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-weight: 500;
}

.welcome-text p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  color: white;
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #67C23A, #85ce61);
  color: white;
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #E6A23C, #ebb563);
  color: white;
}

.stat-card.danger .stat-icon {
  background: linear-gradient(135deg, #F56C6C, #f78989);
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.charts-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-placeholder p {
  margin-top: 10px;
  font-size: 14px;
}

.quick-actions {
  margin-bottom: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.action-item:hover {
  background-color: #f8f9fa;
  border-color: #409EFF;
  transform: translateY(-2px);
}

.action-item span {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>