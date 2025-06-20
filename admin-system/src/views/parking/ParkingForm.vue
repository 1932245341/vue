<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑停车场' : '添加停车场'"
    width="700px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="停车场名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入停车场名称"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="停车场位置" prop="location">
            <el-input
              v-model="form.location"
              placeholder="请输入停车场位置"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input
              v-model="form.latitude"
              placeholder="请输入纬度"
              type="number"
              step="0.000001"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input
              v-model="form.longitude"
              placeholder="请输入经度"
              type="number"
              step="0.000001"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="停车场图片" prop="image">
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
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ isEdit ? '更新' : '添加' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addParking, updateParking } from '@/api/parking'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:visible', 'success'])

// 响应式数据
const formRef = ref()
const submitLoading = ref(false)
const fileList = ref([])

// 上传配置
const uploadAction = ref('http://localhost:8080/common/file/upload')
const uploadHeaders = ref({
  'token': localStorage.getItem('userToken')
})

// 表单数据
const form = reactive({
  id: null,
  name: '',
  location: '',
  latitude: '',
  longitude: '',
  image: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入停车场名称', trigger: 'blur' },
    { min: 2, max: 50, message: '停车场名称长度在2到50个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入停车场位置', trigger: 'blur' },
    { max: 200, message: '位置长度不能超过200个字符', trigger: 'blur' }
  ],
  latitude: [
    { required: true, message: '请输入纬度', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '请输入经度', trigger: 'blur' }
  ]
}

// 监听表单数据变化
watch(
  () => props.formData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      Object.assign(form, {
        id: newData.id || null,
        name: newData.name || '',
        location: newData.location || '',
        latitude: newData.latitude || '',
        longitude: newData.longitude || '',
        image: newData.image || ''
      })
      
      // 处理图片
      if (newData.image) {
        fileList.value = [{
          uid: 1,
          name: 'image',
          status: 'done',
          url: newData.image
        }]
      }
    }
  },
  { immediate: true, deep: true }
)

// 监听对话框显示状态
watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      resetForm()
    }
  }
)

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: null,
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    image: ''
  })
  fileList.value = []
}

// 上传前检查
const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 上传成功回调
const handleUploadSuccess = (response, file) => {
  if (response.code === 200) {
    form.image = response.data.url || response.data
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
  }
}

// 移除图片
const handleRemove = (file) => {
  form.image = ''
}

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    const submitData = {
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null
    }
    
    let response
    if (props.isEdit) {
      response = await updateParking(submitData)
    } else {
      const { id, ...addData } = submitData
      response = await addParking(addData)
    }
    
    if (response.code === 1) {
      ElMessage.success(props.isEdit ? '更新成功' : '添加成功')
      emit('success')
    } else {
      ElMessage.error(response.msg || (props.isEdit ? '更新失败' : '添加失败'))
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error(props.isEdit ? '更新失败' : '添加失败')
  } finally {
    submitLoading.value = false
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>