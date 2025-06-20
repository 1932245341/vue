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
            <el-input
              v-model="form.latitude"
              placeholder="请输入纬度或在地图上选择"
              type="number"
              step="0.000001"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input
              v-model="form.longitude"
              placeholder="请输入经度或在地图上选择"
              type="number"
              step="0.000001"
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

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ isEdit ? '更新' : '添加' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
  
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
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Location, Search } from '@element-plus/icons-vue'
import { addParking, updateParking } from '@/api/parking'
import AMapLoader from '@amap/amap-jsapi-loader'

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

// 初始化高德地图
const initParkingMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: '02c68a423632305cbfd1b87cb5ded8d6',
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.PlaceSearch']
    })
    
    // 创建地图实例
    parkingMap = new AMap.Map('parkingMapContainer', {
      zoom: 13,
      center: [110.299121, 25.274215] // 阳朔县中心坐标
    })
    
    // 创建地理编码实例
    parkingGeocoder = new AMap.Geocoder({
      city: '阳朔县'
    })
    
    // 添加地图点击事件
    parkingMap.on('click', async (e) => {
      const { lng, lat } = e.lnglat
      
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
      try {
        parkingGeocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            selectedLocation.value = {
              lng: lng.toFixed(6),
              lat: lat.toFixed(6),
              address: result.regeocode.formattedAddress
            }
          } else {
            selectedLocation.value = {
              lng: lng.toFixed(6),
              lat: lat.toFixed(6)
            }
          }
        })
      } catch (error) {
        selectedLocation.value = {
          lng: lng.toFixed(6),
          lat: lat.toFixed(6)
        }
      }
    })
    
  } catch (error) {
    console.error('地图加载失败:', error)
    ElMessage.error('地图加载失败，请检查网络连接')
  }
}

// 搜索地点
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
      city: '阳朔县',
      pageSize: 1
    })
    
    placeSearch.search(searchKeyword.value, (status, result) => {
      if (status === 'complete' && result.poiList && result.poiList.pois.length > 0) {
        const poi = result.poiList.pois[0]
        const location = poi.location
        
        // 移动地图中心到搜索结果
        parkingMap.setCenter([location.lng, location.lat])
        parkingMap.setZoom(16)
        
        // 清除之前的标记
        if (parkingMarker) {
          parkingMap.remove(parkingMarker)
        }
        
        // 添加新标记
        parkingMarker = new AMap.Marker({
          position: [location.lng, location.lat],
          map: parkingMap
        })
        
        selectedLocation.value = {
          lng: location.lng.toFixed(6),
          lat: location.lat.toFixed(6),
          address: poi.name + ' ' + poi.address
        }
        
        ElMessage.success('搜索成功')
      } else {
        ElMessage.warning('未找到相关地点')
      }
    })
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
  } finally {
    searchLoading.value = false
  }
}

// 确认位置选择
const confirmLocation = () => {
  if (selectedLocation.value) {
    form.longitude = selectedLocation.value.lng
    form.latitude = selectedLocation.value.lat
    showMapDialog.value = false
    ElMessage.success('位置选择成功')
  } else {
    ElMessage.warning('请先在地图上点击选择位置')
  }
}

// 关闭地图对话框
const handleMapClose = () => {
  showMapDialog.value = false
  selectedLocation.value = null
  searchKeyword.value = ''
}

// 监听地图对话框打开
watch(showMapDialog, async (newVal) => {
  if (newVal) {
    await nextTick()
    await initParkingMap()
  }
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.location-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-info {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.map-container {
  width: 100%;
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.map-search {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.selected-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
}

#parkingMapContainer {
  width: 100%;
  height: 100%;
}
</style>