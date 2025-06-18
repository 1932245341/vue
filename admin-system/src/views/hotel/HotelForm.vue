<template>
  <div class="hotel-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑酒店' : '添加酒店' }}</span>
          <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="hotel-form-content"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="酒店名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入酒店名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营销人员ID" prop="marketerId">
              <el-input-number v-model="form.marketerId" placeholder="请输入营销人员ID" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="酒店地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入酒店地址" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低价格" prop="minPrice">
              <el-input-number
                v-model="form.minPrice"
                placeholder="请输入最低价格"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间数量" prop="roomnum">
              <el-input-number v-model="form.roomnum" placeholder="请输入房间数量" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分" prop="rating">
              <el-rate v-model="form.rating" show-score allow-half />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入住时间" prop="checkinTime">
              <el-input v-model="form.checkinTime" placeholder="例如：14:00" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退房时间" prop="checkoutTime">
              <el-input v-model="form.checkoutTime" placeholder="例如：12:00" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="酒店设施" prop="facilities">
          <el-input v-model="form.facilities" placeholder="请输入酒店设施，用逗号分隔" />
        </el-form-item>

        <el-form-item label="酒店描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入酒店描述"
          />
        </el-form-item>

        <el-form-item label="酒店图片">
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
import { addHotel, updateHotel } from '@/api/hotel'

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
  minPrice: null,
  roomnum: null,
  rating: 0,
  checkinTime: '',
  checkoutTime: '',
  facilities: '',
  description: '',
  images: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入酒店名称', trigger: 'blur' },
    { min: 2, max: 50, message: '酒店名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  marketerId: [
    { required: true, message: '请输入营销人员ID', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入酒店地址', trigger: 'blur' },
    { max: 200, message: '地址长度不能超过 200 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  minPrice: [
    { required: true, message: '请输入最低价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '最低价格不能小于0', trigger: 'blur' }
  ],
  roomnum: [
    { required: true, message: '请输入房间数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '房间数量不能小于1', trigger: 'blur' }
  ],
  checkinTime: [
    { required: true, message: '请输入入住时间', trigger: 'blur' }
  ],
  checkoutTime: [
    { required: true, message: '请输入退房时间', trigger: 'blur' }
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
    
    const apiCall = isEdit.value ? updateHotel : addHotel
    const submitData = { ...form }
    
    if (isEdit.value) {
      submitData.id = route.params.id
    }
    
    const response = await apiCall(submitData)
    
    if (response.code === 1) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/hotel/list')
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
  router.push('/hotel/list')
}

// 页面加载时执行
onMounted(() => {
  // 如果是编辑模式，这里可以加载酒店详情
  // loadHotelDetail()
})
</script>

<style scoped>
.hotel-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hotel-form-content {
  max-width: 800px;
}

.upload-demo {
  display: flex;
  flex-wrap: wrap;
}
</style>