<template>
  <div class="parking-form">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>{{ isEdit ? '编辑停车场' : '添加停车场' }}</h2>
      <p>{{ isEdit ? '修改停车场信息' : '创建新的停车场' }}</p>
    </div>

    <!-- 表单卡片 -->
    <el-card class="form-card">
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
          <el-col :span="24">
            <el-form-item label="位置选择">
              <div class="location-selector">
                <el-button @click="showMapDialog = true" type="primary" plain>
                  <el-icon><Location /></el-icon>
                  在地图上选择位置
                </el-button>
                <span v-if="form.latitude && form.longitude" class="location-info">
                  已选择：{{ form.latitude }}, {{ form.longitude }}
                </span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number
                v-model="form.latitude"
                placeholder="请输入纬度或在地图上选择"
                :precision="6"
                style="width: 100%"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number
                v-model="form.longitude"
                placeholder="请输入经度或在地图上选择"
                :precision="6"
                style="width: 100%"
                readonly
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

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ isEdit ? '更新' : '添加' }}
        </el-button>
      </div>
    </el-card>

    <!-- 地图选择对话框 -->
    <el-dialog v-model="showMapDialog" title="选择位置" width="800px" :before-close="handleMapClose">
      <div class="map-container">
        <div class="map-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索地点"
            @keyup.enter="searchLocation"
            style="width: 300px; margin-bottom: 10px;"
          >
            <template #append>
              <el-button @click="searchLocation" :loading="searchLoading">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        <div id="parkingMapContainer" style="height: 400px; width: 100%;"></div>
        <div v-if="selectedLocation" class="selected-info">
          <p><strong>选中位置：</strong></p>
          <p>经度：{{ selectedLocation.lng }}</p>
          <p>纬度：{{ selectedLocation.lat }}</p>
          <p v-if="selectedLocation.address">地址：{{ selectedLocation.address }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleMapClose">取消</el-button>
        <el-button type="primary" @click="confirmLocation" :disabled="!selectedLocation">确认位置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Location, Search, Plus } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { addParking, updateParking, getParkingById } from '@/api/parking'
import AMapLoader from '@amap/amap-jsapi-loader'

// 路由
const router = useRouter()
const route = useRoute()

// 响应式数据
const formRef = ref()
const submitLoading = ref(false)
const fileList = ref([])
const isEdit = ref(false)

// 地图相关变量
const showMapDialog = ref(false)
const selectedLocation = ref(null)
const searchKeyword = ref('')
const searchLoading = ref(false)
let parkingMap = null
let parkingMarker = null
let parkingGeocoder = null

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
  latitude: null,
  longitude: null,
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
    { required: true, message: '请输入纬度', trigger: 'blur' },
    { type: 'number', message: '纬度必须为数字', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '请输入经度', trigger: 'blur' },
    { type: 'number', message: '经度必须为数字', trigger: 'blur' }
  ]
}

// 初始化页面
const initPage = async () => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    await loadParkingData(id)
  }
}

// 加载停车场数据
const loadParkingData = async (id) => {
  try {
    const response = await getParkingById(id)
    if (response.code === 1) {
      const data = response.data
      Object.assign(form, {
        id: data.id,
        name: data.name || '',
        location: data.location || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        image: data.image || ''
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
    } else {
      ElMessage.error(response.msg || '获取停车场信息失败')
      router.push('/parking/list')
    }
  } catch (error) {
    console.error('获取停车场信息失败:', error)
    ElMessage.error('获取停车场信息失败')
    router.push('/parking/list')
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: null,
    name: '',
    location: '',
    latitude: null,
    longitude: null,
    image: ''
  })
  fileList.value = []
}

// 取消操作
const handleCancel = () => {
  router.push('/parking/list')
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
const handleRemove = () => {
  form.image = ''
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    const submitData = {
      name: form.name,
      location: form.location,
      latitude: form.latitude,
      longitude: form.longitude,
      image: form.image
    }
    
    let response
    if (isEdit.value) {
      submitData.id = form.id
      response = await updateParking(submitData)
    } else {
      response = await addParking(submitData)
    }
    
    if (response.code === 1) {
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
      router.push('/parking/list')
    } else {
      ElMessage.error(response.msg || (isEdit.value ? '更新失败' : '添加失败'))
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请检查网络连接')
  } finally {
    submitLoading.value = false
  }
}

// 初始化地图
const initMap = async () => {
  try {
    const AMap = await AMapLoader.load({
        key: '02c68a423632305cbfd1b87cb5ded8d6',
        version: '2.0',
        plugins: ['AMap.Geocoder', 'AMap.PlaceSearch']
      })
    
    parkingMap = new AMap.Map('parkingMapContainer', {
      zoom: 13,
      center: [116.397428, 39.90923]
    })
    
    parkingGeocoder = new AMap.Geocoder()
    
    // 地图点击事件
    parkingMap.on('click', (e) => {
      const { lng, lat } = e.lnglat
      selectedLocation.value = { lng, lat }
      
      // 清除之前的标记
      if (parkingMarker) {
        parkingMap.remove(parkingMarker)
      }
      
      // 添加新标记
      parkingMarker = new AMap.Marker({
        position: [lng, lat],
        map: parkingMap
      })
      
      // 逆地理编码获取地址
      parkingGeocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.regeocode) {
          selectedLocation.value.address = result.regeocode.formattedAddress
        }
      })
    })
  } catch (error) {
    console.error('地图初始化失败:', error)
    ElMessage.error('地图初始化失败')
  }
}

// 搜索位置
const searchLocation = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  searchLoading.value = true
  try {
    const AMap = await AMapLoader.load({
      key: '02c68a423632305cbfd1b87cb5ded8d6',
      version: '2.0',
      plugins: ['AMap.PlaceSearch']
    })
    
    const placeSearch = new AMap.PlaceSearch({
      pageSize: 1,
      pageIndex: 1
    })
    
    placeSearch.search(searchKeyword.value, (status, result) => {
      if (status === 'complete' && result.poiList.pois.length > 0) {
        const poi = result.poiList.pois[0]
        const { lng, lat } = poi.location
        
        selectedLocation.value = {
          lng,
          lat,
          address: poi.name + ' ' + poi.address
        }
        
        // 清除之前的标记
        if (parkingMarker) {
          parkingMap.remove(parkingMarker)
        }
        
        // 添加新标记
        parkingMarker = new AMap.Marker({
          position: [lng, lat],
          map: parkingMap
        })
        
        // 移动地图中心
        parkingMap.setCenter([lng, lat])
      } else {
        ElMessage.warning('未找到相关位置')
      }
      searchLoading.value = false
    })
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
    searchLoading.value = false
  }
}

// 确认位置
const confirmLocation = () => {
  if (selectedLocation.value) {
    form.latitude = parseFloat(selectedLocation.value.lat)
    form.longitude = parseFloat(selectedLocation.value.lng)
    showMapDialog.value = false
    ElMessage.success('位置选择成功')
  }
}

// 关闭地图对话框
const handleMapClose = () => {
  showMapDialog.value = false
  selectedLocation.value = null
  if (parkingMarker) {
    parkingMap.remove(parkingMarker)
    parkingMarker = null
  }
}

// 监听地图对话框显示
const watchMapDialog = () => {
  if (showMapDialog.value) {
    nextTick(() => {
      initMap()
    })
  }
}

// 页面挂载
onMounted(() => {
  initPage()
})

// 监听地图对话框
watch(() => showMapDialog.value, watchMapDialog)
</script>

<style scoped>
.parking-form {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.form-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.location-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-info {
  color: #67c23a;
  font-size: 14px;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.form-actions .el-button {
  margin: 0 10px;
}

.map-container {
  position: relative;
}

.map-search {
  margin-bottom: 10px;
}

.selected-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.selected-info p {
  margin: 5px 0;
  font-size: 14px;
}
</style>