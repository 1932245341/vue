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
          <el-form-item label="产地" prop="origin">
            <el-input
              v-model="form.origin"
              placeholder="请输入产地"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分类" prop="category">
            <el-select
              v-model="form.category"
              placeholder="请选择分类"
              style="width: 100%"
            >
              <el-option label="茶叶" value="茶叶" />
              <el-option label="熟食" value="熟食" />
              <el-option label="调料" value="调料" />
              <el-option label="糕点" value="糕点" />
              <el-option label="干果" value="干果" />
              <el-option label="工艺品" value="工艺品" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
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
              :action="uploadUrl"
              :headers="uploadHeaders"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :file-list="fileList"
              list-type="picture-card"
              :limit="3"
            >
              <el-icon><Plus /></el-icon>
              <template #tip>
                <div class="el-upload__tip">
                  支持jpg/png文件，且不超过2MB，最多上传3张
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
  origin: '',
  category: '',
  status: 1,
  images: []
})

// 上传配置
const uploadUrl = computed(() => '/api/common/file/upload')
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('admin_token')
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
  origin: [
    { required: true, message: '请输入产地', trigger: 'blur' },
    { max: 30, message: '产地长度不能超过30个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
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
    origin: '',
    category: '',
    status: 1,
    images: []
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
  if (response.code === 1) {
    form.images.push(response.data)
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.msg || '图片上传失败')
  }
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
      ...form,
      images: form.images.length > 0 ? form.images : undefined
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