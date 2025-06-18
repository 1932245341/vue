<template>
  <div class="ticket-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑门票' : '添加门票' }}</span>
          <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="ticket-form-content"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门票名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入门票名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="景点ID" prop="scenicId">
              <el-input-number v-model="form.scenicId" placeholder="请输入景点ID" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
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
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="form.stock" placeholder="请输入库存" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="门票描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入门票描述"
          />
        </el-form-item>

        <el-form-item label="门票图片">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
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
import { addTicket, updateTicket, getTicketDetail } from '@/api/ticket'

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
  scenicId: null,
  price: null,
  stock: null,
  description: '',
  image: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入门票名称', trigger: 'blur' },
    { min: 2, max: 50, message: '门票名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  scenicId: [
    { required: true, message: '请输入景点ID', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
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

// 加载门票详情（编辑模式）
const loadTicketDetail = async () => {
  if (!isEdit.value) return
  
  try {
    const response = await getTicketDetail(route.params.id)
    if (response.code === 1) {
      Object.assign(form, response.data)
      if (form.image) {
        fileList.value = [{
          name: 'image',
          url: form.image
        }]
      }
    } else {
      ElMessage.error(response.msg || '获取门票详情失败')
    }
  } catch (error) {
    console.error('获取门票详情失败:', error)
    ElMessage.error('获取门票详情失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const apiCall = isEdit.value ? updateTicket : addTicket
    const submitData = { ...form }
    
    if (isEdit.value) {
      submitData.id = route.params.id
    }
    
    const response = await apiCall(submitData)
    
    if (response.code === 1) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/ticket/list')
    } else {
      ElMessage.error(response.msg || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    if (error !== false) { // 表单验证失败时error为false
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
  router.push('/ticket/list')
}

// 页面加载时执行
onMounted(() => {
  loadTicketDetail()
})
</script>

<style scoped>
.ticket-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-form-content {
  max-width: 800px;
}

.upload-demo {
  display: flex;
  flex-wrap: wrap;
}
</style>