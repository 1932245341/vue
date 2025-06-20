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
        <el-form-item label="餐厅名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入餐厅名称" />
        </el-form-item>

        <el-form-item label="餐厅位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入餐厅位置" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number
                v-model="form.latitude"
                placeholder="请输入纬度"
                :precision="6"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number
                v-model="form.longitude"
                placeholder="请输入经度"
                :precision="6"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="餐厅图片">
          <el-upload
            class="upload-demo"
            :action="uploadAction"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture-card"
            :limit="1"
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
  location: '',
  latitude: null,
  longitude: null,
  image: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入餐厅名称', trigger: 'blur' },
    { min: 2, max: 50, message: '餐厅名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入餐厅位置', trigger: 'blur' },
    { max: 200, message: '位置长度不能超过 200 个字符', trigger: 'blur' }
  ],
  latitude: [
    { required: true, message: '请输入纬度', trigger: 'blur' },
    { type: 'number', message: '纬度必须为数字', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '请输入经度', trigger: 'blur' },
    { type: 'number', message: '经度必须为数字', trigger: 'blur' }
  ]
}

// 上传配置
const uploadAction = 'http://localhost:8080/common/file/upload'
const uploadHeaders = computed(() => {
  const userToken = localStorage.getItem('userToken')
  return {
    'token': userToken
  }
})

// 文件上传前验证
const beforeUpload = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传成功回调
const handleUploadSuccess = (response) => {
  if (response.code === 1) {
    form.image = response.data
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.msg || '图片上传失败')
  }
}

// 上传失败回调
const handleUploadError = () => {
  ElMessage.error('图片上传失败')
}

// 移除图片
const handleRemove = () => {
  form.image = ''
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
  form.image = ''
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