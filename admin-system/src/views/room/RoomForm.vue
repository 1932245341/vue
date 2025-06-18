<template>
  <div class="room-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑房间' : '添加房间' }}</span>
          <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="room-form-content"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间号" prop="roomNumber">
              <el-input v-model="form.roomNumber" placeholder="请输入房间号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="酒店ID" prop="hotelId">
              <el-input-number v-model="form.hotelId" placeholder="请输入酒店ID" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间类型" prop="roomType">
              <el-select v-model="form.roomType" placeholder="请选择房间类型" style="width: 100%">
                <el-option label="标准间" value="标准间" />
                <el-option label="大床房" value="大床房" />
                <el-option label="双床房" value="双床房" />
                <el-option label="套房" value="套房" />
                <el-option label="豪华套房" value="豪华套房" />
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
            <el-form-item label="房间状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择房间状态" style="width: 100%">
                <el-option label="可用" value="可用" />
                <el-option label="已预订" value="已预订" />
                <el-option label="已入住" value="已入住" />
                <el-option label="维护中" value="维护中" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="床型" prop="bedType">
              <el-select v-model="form.bedType" placeholder="请选择床型" style="width: 100%">
                <el-option label="单人床" value="单人床" />
                <el-option label="双人床" value="双人床" />
                <el-option label="大床" value="大床" />
                <el-option label="双床" value="双床" />
                <el-option label="沙发床" value="沙发床" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="面积" prop="area">
              <el-input-number
                v-model="form.area"
                placeholder="请输入面积"
                :min="1"
                :precision="1"
                style="width: 100%"
              />
              <span style="margin-left: 8px;">㎡</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大入住人数" prop="maxOccupancy">
              <el-input-number v-model="form.maxOccupancy" placeholder="请输入最大入住人数" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="房间设施" prop="facilities">
          <el-input v-model="form.facilities" placeholder="请输入房间设施，用逗号分隔" />
        </el-form-item>

        <el-form-item label="房间描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入房间描述"
          />
        </el-form-item>

        <el-form-item label="房间图片">
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
import { addRoom, updateRoom } from '@/api/room'

const router = useRouter()
const route = useRoute()

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 响应式数据
const loading = ref(false)
const formRef = ref()
const fileList = ref([])

const form = reactive({
  roomNumber: '',
  hotelId: null,
  roomType: '',
  price: null,
  status: '可用',
  bedType: '',
  area: null,
  maxOccupancy: null,
  facilities: '',
  description: '',
  images: []
})

// 表单验证规则
const rules = {
  roomNumber: [
    { required: true, message: '请输入房间号', trigger: 'blur' },
    { min: 1, max: 20, message: '房间号长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  hotelId: [
    { required: true, message: '请输入酒店ID', trigger: 'blur' }
  ],
  roomType: [
    { required: true, message: '请选择房间类型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择房间状态', trigger: 'change' }
  ],
  bedType: [
    { required: true, message: '请选择床型', trigger: 'change' }
  ],
  area: [
    { required: true, message: '请输入面积', trigger: 'blur' },
    { type: 'number', min: 1, message: '面积不能小于1', trigger: 'blur' }
  ],
  maxOccupancy: [
    { required: true, message: '请输入最大入住人数', trigger: 'blur' },
    { type: 'number', min: 1, message: '最大入住人数不能小于1', trigger: 'blur' }
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
    
    const apiCall = isEdit.value ? updateRoom : addRoom
    const submitData = { ...form }
    
    if (isEdit.value) {
      submitData.id = route.params.id
    }
    
    const response = await apiCall(submitData)
    
    if (response.code === 1) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/room/list')
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
  router.push('/room/list')
}

// 页面加载时执行
onMounted(() => {
  // 如果是编辑模式，这里可以加载房间详情
  // loadRoomDetail()
})
</script>

<style scoped>
.room-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-form-content {
  max-width: 800px;
}

.upload-demo {
  display: flex;
  flex-wrap: wrap;
}
</style>