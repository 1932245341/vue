<template>
  <div class="restaurant-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑餐厅' : '添加餐厅' }}</span>
          <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="restaurant-form-content"
      >
        <el-form-item label="餐厅名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入餐厅名称" />
        </el-form-item>

        <el-form-item label="餐厅位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入餐厅位置" />
        </el-form-item>

        <el-form-item label="位置选择">
          <div class="location-selector">
            <el-button type="primary" :icon="Location" @click="showMapDialog = true">
              位置选择
            </el-button>
            <span v-if="form.longitude && form.latitude" class="location-info">
              经度: {{ form.longitude }}, 纬度: {{ form.latitude }}
            </span>
          </div>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number
                v-model="form.latitude"
                placeholder="请输入纬度"
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
                placeholder="请输入经度"
                :precision="6"
                style="width: 100%"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="餐厅图片">
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

    <!-- 地图选择对话框 -->
    <el-dialog
      v-model="showMapDialog"
      title="选择餐厅位置"
      width="80%"
      @close="handleMapClose"
    >
      <div class="map-search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索地点"
          :prefix-icon="Search"
          @keyup.enter="searchLocation"
        />
        <el-button type="primary" @click="searchLocation" :loading="searchLoading">
          搜索
        </el-button>
      </div>
      
      <div class="map-container">
        <div id="restaurantMapContainer"></div>
      </div>
      
      <div v-if="selectedLocation" class="selected-info">
        <p><strong>选中位置：</strong></p>
        <p>经度：{{ selectedLocation.lng }}</p>
        <p>纬度：{{ selectedLocation.lat }}</p>
        <p v-if="selectedLocation.address">地址：{{ selectedLocation.address }}</p>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleMapClose">取消</el-button>
          <el-button type="primary" @click="confirmLocation">确认位置</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus, Location, Search } from '@element-plus/icons-vue'
import { addRestaurant, updateRestaurant } from '@/api/restaurant'
import AMapLoader from '@amap/amap-jsapi-loader'

const router = useRouter()
const route = useRoute()

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 响应式数据
const loading = ref(false)
const formRef = ref()
const fileList = ref([])

// 地图相关变量
const showMapDialog = ref(false)
const selectedLocation = ref(null)
const searchKeyword = ref('')
const searchLoading = ref(false)
let restaurantMap = null
let restaurantMarker = null
let restaurantGeocoder = null

const form = reactive({
  name: '',
  location: '',
  latitude: null,
  longitude: null,
  image: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入餐厅名称', trigger: 'blur' },
    { min: 2, max: 50, message: '餐厅名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入餐厅位置', trigger: 'blur' },
    { max: 200, message: '位置长度不能超过 200 个字符', trigger: 'blur' }
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

// 上传配置
const uploadAction = 'http://localhost:8080/common/file/upload'
const uploadHeaders = computed(() => {
  const userToken = localStorage.getItem('userToken')
  return {
    'token': userToken
  }
})

// 文件上传前验证
const beforeUpload = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

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

// 移除图片
const handleRemove = () => {
  form.image = ''
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const apiCall = isEdit.value ? updateRestaurant : addRestaurant
    const submitData = { ...form }
    
    if (isEdit.value) {
      submitData.id = route.params.id
    }
    
    const response = await apiCall(submitData)
    
    if (response.code === 1) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/restaurant/list')
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
  form.image = ''
}

// 返回列表
const goBack = () => {
  router.push('/restaurant/list')
}

// 页面加载时执行
onMounted(() => {
  // 如果是编辑模式，这里可以加载餐厅详情
  // loadRestaurantDetail()
})

// 初始化高德地图
const initRestaurantMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: '02c68a423632305cbfd1b87cb5ded8d6',
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.PlaceSearch']
    })
    
    // 创建地图实例
    restaurantMap = new AMap.Map('restaurantMapContainer', {
      zoom: 13,
      center: [110.299121, 25.274215] // 阳朔县中心坐标
    })
    
    // 创建地理编码实例
    restaurantGeocoder = new AMap.Geocoder({
      city: '阳朔县'
    })
    
    // 添加地图点击事件
    restaurantMap.on('click', async (e) => {
      const { lng, lat } = e.lnglat
      
      // 清除之前的标记
      if (restaurantMarker) {
        restaurantMap.remove(restaurantMarker)
      }
      
      // 添加新标记
      restaurantMarker = new AMap.Marker({
        position: [lng, lat],
        map: restaurantMap
      })
      
      // 逆地理编码获取地址
      try {
        restaurantGeocoder.getAddress([lng, lat], (status, result) => {
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
        restaurantMap.setCenter([location.lng, location.lat])
        restaurantMap.setZoom(16)
        
        // 清除之前的标记
        if (restaurantMarker) {
          restaurantMap.remove(restaurantMarker)
        }
        
        // 添加新标记
        restaurantMarker = new AMap.Marker({
          position: [location.lng, location.lat],
          map: restaurantMap
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
    await initRestaurantMap()
  }
})
</script>

<style scoped>
.restaurant-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.restaurant-form-content {
  max-width: 800px;
}

.upload-demo {
  display: flex;
  flex-wrap: wrap;
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

#restaurantMapContainer {
  width: 100%;
  height: 100%;
}

.dialog-footer {
  text-align: right;
}
</style>