<template>
  <div class="scenic-form-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑景点' : '添加景点' }}</span>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="scenic-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="景点名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入景点名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="位置" prop="location">
              <el-input
                v-model="formData.location"
                placeholder="请输入景点位置"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开放时间" prop="time">
              <el-input
                v-model="formData.time"
                placeholder="例如：08:00-18:00"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input
                v-model="formData.contact"
                placeholder="请输入联系人"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input
                v-model="formData.latitude"
                placeholder="请输入纬度"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input
                v-model="formData.longitude"
                placeholder="请输入经度"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签" prop="label">
              <el-input
                v-model="formData.label"
                placeholder="请输入标签"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="景点图片" prop="image">
          <div class="image-upload-container">
            <el-upload
              v-model:file-list="fileList"
              :action="uploadAction"
              :headers="uploadHeaders"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              list-type="picture-card"
              :limit="1"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">
              支持 jpg、png 格式，单张图片不超过 2MB
            </div>
          </div>
        </el-form-item>
        

        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getScenicDetail, addScenic, updateScenic } from '@/api/scenic'
import { uploadFile } from '@/api/upload'

const route = useRoute()
const router = useRouter()

// 表单引用
const formRef = ref()

// 提交加载状态
const submitLoading = ref(false)

// 是否编辑模式
const isEdit = computed(() => {
  return route.params.id && route.params.id !== 'add'
})

// 文件列表
const fileList = ref([])

// 上传配置
const uploadAction = ref('http://localhost:8080/common/file/upload')
const uploadHeaders = ref({
  'token': localStorage.getItem('userToken')
})

// 表单数据
const formData = reactive({
  name: '',
  location: '',
  time: '',
  latitude: '',
  longitude: '',
  contact: '',
  label: '',
  image: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入景点名称', trigger: 'blur' },
    { min: 2, max: 50, message: '景点名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入景点位置', trigger: 'blur' },
    { max: 100, message: '位置长度不能超过 100 个字符', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请输入开放时间', trigger: 'blur' }
  ],
  latitude: [
    { required: true, message: '请输入纬度', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '请输入经度', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  label: [
    { max: 50, message: '标签长度不能超过 50 个字符', trigger: 'blur' }
  ]
}

// 加载景点详情
const loadScenicDetail = async () => {
  if (!isEdit.value) return
  
  try {
    const response = await getScenicDetail(route.params.id)
    const data = response.data
    
    Object.keys(formData).forEach(key => {
      if (data[key] !== undefined) {
        formData[key] = data[key]
      }
    })
    
    // 处理图片
    if (data.image) {
      fileList.value = [{
        uid: 1,
        name: 'image',
        status: 'done',
        url: data.image
      }]
    }
  } catch (error) {
    console.error('加载景点详情失败:', error)
    ElMessage.error('加载景点详情失败')
  }
}

// 上传成功回调
const handleUploadSuccess = (response, file) => {
  if (response.code === 200) {
    formData.image = response.data.url || response.data
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
  }
}

// 移除图片
const handleRemove = (file) => {
  formData.image = ''
}

// 上传前检查
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  
  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    const submitData = { ...formData }
    
    if (isEdit.value) {
      submitData.id = route.params.id
      await updateScenic(submitData)
      ElMessage.success('更新成功')
    } else {
      await addScenic(submitData)
      ElMessage.success('创建成功')
    }
    
    goBack()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  fileList.value = []
  formData.image = ''
}

// 返回列表
const goBack = () => {
  router.push('/scenic')
}

// 组件挂载时加载数据
onMounted(() => {
  if (isEdit.value) {
    loadScenicDetail()
  }
})
</script>

<style scoped>
.scenic-form-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scenic-form {
  max-width: 800px;
}

.image-upload-container {
  width: 100%;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>