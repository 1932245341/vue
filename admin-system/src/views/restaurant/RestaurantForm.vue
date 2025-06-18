<template>
  <div class="restaurant-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑餐厅' : '添加餐厅' }}</span>
          <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="restaurant-form-content"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="餐厅名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入餐厅名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营销人员ID" prop="marketerId">
              <el-input-number v-model="form.marketerId" placeholder="请输入营销人员ID" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="餐厅地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入餐厅地址" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人均消费" prop="avgPrice">
              <el-input-number
                v-model="form.avgPrice"
                placeholder="请输入人均消费"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业时间" prop="businessHours">
              <el-input v-model="form.businessHours" placeholder="例如：09:00-22:00" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分" prop="rating">
              <el-rate v-model="form.rating" show-score allow-half />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="餐厅描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入餐厅描述"
          />
        </el-form-item>

        <el-form-item label="餐厅图片">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :file-list="fileList"
            list-type="picture-card"
            :limit="3"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { addRestaurant, updateRestaurant } from '@/api/restaurant'

const router = useRouter()
const route = useRoute()

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 响应式数据
const loading = ref(false)
const formRef = ref()
const fileList = ref([])

const form = reactive({
  name: '',
  marketerId: null,
  address: '',
  phone: '',
  avgPrice: null,
  businessHours: '',
  rating: 0,
  description: '',
  images: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入餐厅名称', trigger: 'blur' },
    { min: 2, max: 50, message: '餐厅名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  marketerId: [
    { required: true, message: '请输入营销人员ID', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入餐厅地址', trigger: 'blur' },
    { max: 200, message: '地址长度不能超过 200 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  avgPrice: [
    { required: true, message: '请输入人均消费', trigger: 'blur' },
    { type: 'number', min: 0, message: '人均消费不能小于0', trigger: 'blur' }
  ],
  businessHours: [
    { required: true, message: '请输入营业时间', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '描述长度不能超过 500 个字符', trigger: 'blur' }
  ]
}

// 上传配置
const uploadUrl = computed(() => '/api/common/file/upload')
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('admin_token')
  return {
    'Authorization': `Bearer ${token}`
  }
})

// 上传成功回调
const handleUploadSuccess = (response) => {
  if (response.code === 1) {
    form.images.push(response.data)
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.msg || '图片上传失败')
  }
}

// 上传失败回调
const handleUploadError = () => {
  ElMessage.error('图片上传失败')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const apiCall = isEdit.value ? updateRestaurant : addRestaurant
    const submitData = { ...form }
    
    if (isEdit.value) {
      submitData.id = route.params.id
    }
    
    const response = await apiCall(submitData)
    
    if (response.code === 1) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/restaurant/list')
    } else {
      ElMessage.error(response.msg || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    if (error !== false) {
      console.error('提交失败:', error)
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  fileList.value = []
  form.images = []
}

// 返回列表
const goBack = () => {
  router.push('/restaurant/list')
}

// 页面加载时执行
onMounted(() => {
  // 如果是编辑模式，这里可以加载餐厅详情
  // loadRestaurantDetail()
})
</script>

<style scoped>
.restaurant-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.restaurant-form-content {
  max-width: 800px;
}

.upload-demo {
  display: flex;
  flex-wrap: wrap;
}
</style>