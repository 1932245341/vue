<template>
  <el-dialog
    :model-value="visible"
    title="停车场详情"
    width="800px"
    @close="handleClose"
  >
    <div class="parking-detail">
      <!-- 基本信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">停车场名称：</span>
              <span class="value">{{ parkingData.name || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">状态：</span>
              <el-tag :type="parkingData.status === 1 ? 'success' : 'danger'">
                {{ parkingData.status === 1 ? '营业中' : '暂停营业' }}
              </el-tag>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="detail-item">
              <span class="label">地址：</span>
              <span class="value">{{ parkingData.address || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">联系电话：</span>
              <span class="value">{{ parkingData.phone || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">营业时间：</span>
              <span class="value">{{ parkingData.operatingHours || '-' }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 车位信息 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">车位信息</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="stat-item">
              <div class="stat-value total">{{ parkingData.totalSpaces || 0 }}</div>
              <div class="stat-label">总车位</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item">
              <div class="stat-value available">{{ parkingData.availableSpaces || 0 }}</div>
              <div class="stat-label">可用车位</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item">
              <div class="stat-value occupied">{{ (parkingData.totalSpaces || 0) - (parkingData.availableSpaces || 0) }}</div>
              <div class="stat-label">已占用</div>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">小时费率：</span>
              <span class="value price">¥{{ parkingData.hourlyRate || 0 }}/小时</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">使用率：</span>
              <span class="value">
                <el-progress 
                  :percentage="usageRate" 
                  :color="progressColor"
                  :stroke-width="8"
                  style="width: 120px;"
                />
              </span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 设施服务 -->
      <el-card class="detail-card" shadow="never" v-if="facilitiesList.length > 0">
        <template #header>
          <div class="card-header">
            <span class="card-title">设施服务</span>
          </div>
        </template>
        
        <div class="facilities-container">
          <el-tag 
            v-for="facility in facilitiesList" 
            :key="facility"
            type="info"
            class="facility-tag"
          >
            {{ facility }}
          </el-tag>
        </div>
      </el-card>

      <!-- 位置信息 -->
      <el-card class="detail-card" shadow="never" v-if="parkingData.latitude && parkingData.longitude">
        <template #header>
          <div class="card-header">
            <span class="card-title">位置信息</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">纬度：</span>
              <span class="value">{{ parkingData.latitude }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item">
              <span class="label">经度：</span>
              <span class="value">{{ parkingData.longitude }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 描述信息 -->
      <el-card class="detail-card" shadow="never" v-if="parkingData.description">
        <template #header>
          <div class="card-header">
            <span class="card-title">描述信息</span>
          </div>
        </template>
        
        <div class="description-content">
          {{ parkingData.description }}
        </div>
      </el-card>

      <!-- 创建时间 -->
      <el-card class="detail-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">其他信息</span>
          </div>
        </template>
        
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ parkingData.createTime || '-' }}</span>
        </div>
      </el-card>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  parkingData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:visible'])

// 计算使用率
const usageRate = computed(() => {
  const total = props.parkingData.totalSpaces || 0
  const available = props.parkingData.availableSpaces || 0
  if (total === 0) return 0
  return Math.round(((total - available) / total) * 100)
})

// 进度条颜色
const progressColor = computed(() => {
  const rate = usageRate.value
  if (rate < 50) return '#67c23a'
  if (rate < 80) return '#e6a23c'
  return '#f56c6c'
})

// 设施列表
const facilitiesList = computed(() => {
  if (!props.parkingData.facilities) return []
  if (Array.isArray(props.parkingData.facilities)) {
    return props.parkingData.facilities
  }
  if (typeof props.parkingData.facilities === 'string') {
    return props.parkingData.facilities.split(',').filter(item => item.trim())
  }
  return []
})

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.parking-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-card {
  margin-bottom: 16px;
}

.detail-card:last-child {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.detail-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #606266;
  min-width: 100px;
  margin-right: 8px;
}

.value {
  color: #303133;
  flex: 1;
}

.value.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-value.total {
  color: #409eff;
}

.stat-value.available {
  color: #67c23a;
}

.stat-value.occupied {
  color: #f56c6c;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.facilities-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.facility-tag {
  margin: 0;
}

.description-content {
  line-height: 1.6;
  color: #606266;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.dialog-footer {
  text-align: right;
}
</style>