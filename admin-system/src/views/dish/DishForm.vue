<template>
  <div class="dish-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑菜品' : '添加菜品' }}</span>
          <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="dish-form-content"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜品名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="餐厅ID" prop="restaurantId">
              <el-input-number v-model="form.restaurantId" placeholder="请输入餐厅ID" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜品类型" prop="category">
              <el-select v-model="form.category" placeholder="请选择菜品类型" style="width: 100%">
                <el-option label="热菜" value="热菜" />
                <el-option label="凉菜" value="凉菜" />
                <el-option label="汤类" value="汤类" />
                <el-option label="主食" value="主食" />
                <el-option label="甜品" value="甜品" />
                <el-option label="饮品" value="饮品" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number
                v-model="form.price"
                placeholder="请输入价格"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜品状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择菜品状态" style="width: 100%">
                <el-option label="可用" value="可用" />
                <el-option label="售罄" value="售罄" />
                <el-option label="下架" value="下架" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分" prop="rating">
              <el-rate v-model="form.rating" show-score text-color="#ff9900" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="制作时间" prop="cookingTime">
              <el-input-number v-model="form.cookingTime" placeholder="请输入制作时间" :min="1" style="width: 100%" />
              <span style="margin-left: 8px;">分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="热量" prop="calories">
              <el-input-number v-model="form.calories" placeholder="请输入热量" :min="0" style="width: 100%" />
              <span style="margin-left: 8px;">卡路里</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="主要食材" prop="ingredients">
          <el-input v-model="form.ingredients" placeholder="请输入主要食材，用逗号分隔" />
        </el-form-item>

        <el-form-item label="口味标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入口味标签，如：微辣、清淡、香甜等，用逗号分隔" />
        </el-form-item>

        <el-form-item label="菜品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入菜品描述"
          />
        </el-form-item>

        <el-form-item label="制作工艺" prop="cookingMethod">
          <el-input
            v-model="form.cookingMethod"
            type="textarea"
            :rows="3"
            placeholder="请输入制作工艺"
          />
        </el-form-item>

        <el-form-item label="菜品图片">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :file-list="fileList"
            list-type="picture-card"
            :limit="5"
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
import { addDish, updateDish } from '@/api/dish'

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
  restaurantId: null,
  category: '',
  price: null,
  status: '可用',
  rating: 0,
  cookingTime: null,
  calories: null,
  ingredients: '',
  tags: '',
  description: '',
  cookingMethod: '',
  images: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
    { min: 1, max: 50, message: '菜品名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  restaurantId: [
    { required: true, message: '请输入餐厅ID', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择菜品类型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择菜品状态', trigger: 'change' }
  ],
  rating: [
    { type: 'number', min: 0, max: 5, message: '评分范围为0-5', trigger: 'blur' }
  ],
  cookingTime: [
    { type: 'number', min: 1, message: '制作时间不能小于1分钟', trigger: 'blur' }
  ],
  calories: [
    { type: 'number', min: 0, message: '热量不能小于0', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '描述长度不能超过 500 个字符', trigger: 'blur' }
  ],
  cookingMethod: [
    { max: 1000, message: '制作工艺长度不能超过 1000 个字符', trigger: 'blur' }
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
    
    const apiCall = isEdit.value ? updateDish : addDish
    const submitData = { ...form }
    
    if (isEdit.value) {
      submitData.id = route.params.id
    }
    
    const response = await apiCall(submitData)
    
    if (response.code === 1) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/dish/list')
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
  router.push('/dish/list')
}

// 页面加载时执行
onMounted(() => {
  // 如果是编辑模式，这里可以加载菜品详情
  // loadDishDetail()
})
</script>

<style scoped>
.dish-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-form-content {
  max-width: 800px;
}

.upload-demo {
  display: flex;
  flex-wrap: wrap;
}
</style>