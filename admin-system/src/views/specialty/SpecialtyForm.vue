<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑特产' : '添加特产'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="特产名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入特产名称"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input-number
              v-model="form.price"
              :min="0"
              :precision="2"
              placeholder="请输入价格"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择类型"
              style="width: 100%"
            >
              <el-option label="工艺品" value="工艺品" />
              <el-option label="食品" value="食品" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入特产描述"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="特产图片">
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
              <template #tip>
                <div class="el-upload__tip">
                  支持jpg/png文件，且不超过2MB
                </div>
              </template>
            </el-upload>
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
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { addSpecialty, updateSpecialty } from '@/api/specialty'

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

// 表单数据
const form = reactive({
  id: null,
  name: '',
  description: '',
  price: null,
  type: '工艺品',
  image: ''
})

// 上传配置
const uploadAction = 'http://localhost:8080/common/file/upload'
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('userToken')
  return token ? { token } : {}
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入特产名称', trigger: 'blur' },
    { min: 2, max: 50, message: '特产名称长度在2到50个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' },
    { max: 500, message: '描述长度不能超过500个字符', trigger: 'blur' }
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
        description: newData.description || '',
        price: newData.price || null,
        origin: newData.origin || '',
        category: newData.category || '',
        status: newData.status !== undefined ? newData.status : 1,
        images: newData.images || []
      })
      
      // 设置文件列表
      if (newData.images && newData.images.length > 0) {
        fileList.value = newData.images.map((url, index) => ({
          name: `image-${index}`,
          url: url
        }))
      } else {
        fileList.value = []
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
    description: '',
    price: null,
    type: '工艺品',
    image: ''
  })
  fileList.value = []
}

// 文件上传前验证
const beforeUpload = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('只能上传JPG/PNG格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  return true
}

// 文件上传成功
const handleUploadSuccess = (response) => {
  if (response.code === 1 || response.data) {
    form.image = response.data
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.msg || '图片上传失败')
  }
}

// 移除图片
const handleRemove = () => {
  form.image = ''
}

// 文件上传失败
const handleUploadError = () => {
  ElMessage.error('图片上传失败')
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
      ...form
    }
    
    let response
    if (props.isEdit) {
      response = await updateSpecialty(submitData)
    } else {
      const { id, ...addData } = submitData
      response = await addSpecialty(addData)
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

.upload-demo {
  width: 100%;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}
</style>