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
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入停车场地址"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="总车位数" prop="totalSpaces">
            <el-input-number
              v-model="form.totalSpaces"
              :min="1"
              :max="9999"
              placeholder="请输入总车位数"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可用车位" prop="availableSpaces">
            <el-input-number
              v-model="form.availableSpaces"
              :min="0"
              :max="form.totalSpaces || 9999"
              placeholder="请输入可用车位数"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="小时费率" prop="hourlyRate">
            <el-input-number
              v-model="form.hourlyRate"
              :min="0"
              :precision="2"
              placeholder="请输入小时费率"
              style="width: 100%"
            >
              <template #append>元/小时</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业时间" prop="operatingHours">
            <el-input
              v-model="form.operatingHours"
              placeholder="如：08:00-22:00 或 24小时"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入联系电话"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">营业中</el-radio>
              <el-radio :label="0">暂停营业</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="停车场描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入停车场描述信息"
              maxlength="300"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="设施服务">
            <el-checkbox-group v-model="form.facilities">
              <el-checkbox label="监控系统">监控系统</el-checkbox>
              <el-checkbox label="24小时保安">24小时保安</el-checkbox>
              <el-checkbox label="洗车服务">洗车服务</el-checkbox>
              <el-checkbox label="充电桩">充电桩</el-checkbox>
              <el-checkbox label="室内停车">室内停车</el-checkbox>
              <el-checkbox label="无障碍通道">无障碍通道</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="位置坐标">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input
                  v-model="form.latitude"
                  placeholder="纬度"
                  type="number"
                  step="0.000001"
                >
                  <template #prepend>纬度</template>
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input
                  v-model="form.longitude"
                  placeholder="经度"
                  type="number"
                  step="0.000001"
                >
                  <template #prepend>经度</template>
                </el-input>
              </el-col>
            </el-row>
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

// 表单数据
const form = reactive({
  id: null,
  name: '',
  address: '',
  totalSpaces: null,
  availableSpaces: null,
  hourlyRate: null,
  operatingHours: '',
  phone: '',
  status: 1,
  description: '',
  facilities: [],
  latitude: '',
  longitude: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入停车场名称', trigger: 'blur' },
    { min: 2, max: 50, message: '停车场名称长度在2到50个字符', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入停车场地址', trigger: 'blur' },
    { max: 200, message: '地址长度不能超过200个字符', trigger: 'blur' }
  ],
  totalSpaces: [
    { required: true, message: '请输入总车位数', trigger: 'blur' },
    { type: 'number', min: 1, max: 9999, message: '总车位数必须在1到9999之间', trigger: 'blur' }
  ],
  availableSpaces: [
    { required: true, message: '请输入可用车位数', trigger: 'blur' },
    { type: 'number', min: 0, message: '可用车位数不能小于0', trigger: 'blur' }
  ],
  hourlyRate: [
    { required: true, message: '请输入小时费率', trigger: 'blur' },
    { type: 'number', min: 0, message: '小时费率必须大于等于0', trigger: 'blur' }
  ],
  operatingHours: [
    { required: true, message: '请输入营业时间', trigger: 'blur' },
    { max: 20, message: '营业时间长度不能超过20个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' }
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
        address: newData.address || '',
        totalSpaces: newData.totalSpaces || null,
        availableSpaces: newData.availableSpaces || null,
        hourlyRate: newData.hourlyRate || null,
        operatingHours: newData.operatingHours || '',
        phone: newData.phone || '',
        status: newData.status !== undefined ? newData.status : 1,
        description: newData.description || '',
        facilities: newData.facilities || [],
        latitude: newData.latitude || '',
        longitude: newData.longitude || ''
      })
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
    address: '',
    totalSpaces: null,
    availableSpaces: null,
    hourlyRate: null,
    operatingHours: '',
    phone: '',
    status: 1,
    description: '',
    facilities: [],
    latitude: '',
    longitude: ''
  })
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
    
    // 验证可用车位不能超过总车位
    if (form.availableSpaces > form.totalSpaces) {
      ElMessage.error('可用车位数不能超过总车位数')
      return
    }
    
    submitLoading.value = true
    
    const submitData = {
      ...form,
      facilities: form.facilities.length > 0 ? form.facilities.join(',') : '',
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