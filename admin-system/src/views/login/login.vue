<template>
  <div class="login-container">
    <div class="login-form">
      <div class="title-container">
        <h3 class="title">i游阳朔后台管理系统</h3>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            type="text"
            autocomplete="off"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            type="password"
            autocomplete="off"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width: 100%" @click="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// 导入API
// import { login } from '@/api/admin'

const router = useRouter()
const loading = ref(false)
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用登录API
        const res = await login(loginForm)
        if (res.code === 200) {
          localStorage.setItem('token', res.data.token)
          router.push('/')
          ElMessage.success('登录成功')
        } else {
          ElMessage.error(res.msg || '登录失败')
        }
        
        // 模拟登录成功
        // localStorage.setItem('token', 'admin-token')
        // router.push('/')
        // ElMessage.success('登录成功')
      } catch (error) {
        console.error(error)
        ElMessage.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-form {
  width: 350px;
  padding: 35px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.title-container {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 22px;
  color: #333;
  margin: 0;
}
</style>