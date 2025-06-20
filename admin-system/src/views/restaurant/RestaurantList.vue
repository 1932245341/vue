<template>
  <div class="restaurant-list">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="餐厅名称">
          <el-input v-model="searchForm.name" placeholder="请输入餐厅名称" clearable />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="searchForm.location" placeholder="请输入位置" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
          <el-button @click="handleReset" :icon="Refresh">重置</el-button>
          <el-button type="success" @click="handleAdd" :icon="Plus">添加餐厅</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="餐厅名称" min-width="150" />
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
            />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" min-width="150" show-overflow-tooltip />
        <el-table-column prop="latitude" label="纬度" width="120" />
        <el-table-column prop="longitude" label="经度" width="120" />
        <el-table-column prop="score" label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.score" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销售量" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)" :icon="Edit">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)" :icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getRestaurantList, deleteRestaurant } from '@/api/restaurant'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const searchForm = reactive({
  name: '',
  location: ''
})
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    const response = await getRestaurantList(params)
    if (response.code === 1) {
      tableData.value = response.data.records || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.msg || '获取餐厅列表失败')
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取餐厅列表失败:', error)
    ElMessage.error('获取餐厅列表失败')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    address: ''
  })
  pagination.page = 1
  loadData()
}

// 添加
const handleAdd = () => {
  router.push('/restaurant/add')
}

// 编辑
const handleEdit = (row) => {
  router.push(`/restaurant/edit/${row.id}`)
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除餐厅"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteRestaurant(row.id)
    if (response.code === 1) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除餐厅失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.restaurant-list {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}
</style>