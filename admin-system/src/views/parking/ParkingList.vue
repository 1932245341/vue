<template>
  <div class="parking-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>停车场管理</h2>
      <p>管理系统中的停车场信息</p>
    </div>

    <!-- 搜索和操作区域 -->
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入停车场名称"
            clearable
            @keyup.enter="handleSearch"
            style="width: 300px; margin-right: 10px;"
          />
          <el-button type="primary" @click="handleSearch" :icon="Search">
            搜索
          </el-button>
          <el-button @click="handleReset" :icon="Refresh">
            重置
          </el-button>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-button type="primary" @click="handleAdd" :icon="Plus">
            添加停车场
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="停车场名称" min-width="150" />
        <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="totalSpaces" label="总车位" width="100">
          <template #default="{ row }">
            <span style="color: #409eff; font-weight: bold;">{{ row.totalSpaces }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="availableSpaces" label="可用车位" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.availableSpaces > 0 ? '#67c23a' : '#f56c6c', fontWeight: 'bold' }">
              {{ row.availableSpaces }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="hourlyRate" label="小时费率" width="100">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold;">¥{{ row.hourlyRate }}/h</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatingHours" label="营业时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '营业中' : '暂停营业' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(row)"
              :icon="Edit"
            >
              编辑
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="handleViewDetails(row)"
              :icon="View"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <ParkingForm
      v-model:visible="formVisible"
      :form-data="currentRow"
      :is-edit="isEdit"
      @success="handleFormSuccess"
    />

    <!-- 详情对话框 -->
    <ParkingDetail
      v-model:visible="detailVisible"
      :parking-data="currentRow"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus, Edit, View } from '@element-plus/icons-vue'
import { getParkingList } from '@/api/parking'
import ParkingForm from './ParkingForm.vue'
import ParkingDetail from './ParkingDetail.vue'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const formVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const currentRow = ref({})

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 获取停车场列表
const getList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      name: searchForm.name || undefined
    }
    
    const response = await getParkingList(params)
    
    if (response.code === 1) {
      // 从后端API获取真实数据
      tableData.value = response.data.records || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.msg || '获取停车场列表失败')
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取停车场列表失败:', error)
    ElMessage.error('获取停车场列表失败，请检查网络连接或联系管理员')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}



// 搜索
const handleSearch = () => {
  pagination.page = 1
  getList()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  pagination.page = 1
  getList()
}

// 添加
const handleAdd = () => {
  currentRow.value = {}
  isEdit.value = false
  formVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  currentRow.value = { ...row }
  isEdit.value = true
  formVisible.value = true
}

// 查看详情
const handleViewDetails = (row) => {
  currentRow.value = { ...row }
  detailVisible.value = true
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  getList()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.page = page
  getList()
}

// 表单提交成功
const handleFormSuccess = () => {
  formVisible.value = false
  getList()
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped>
.parking-list {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>