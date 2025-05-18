<template>
  <div class="login-container">
    <div class="login-box">
      <el-form :model="loginForm" :rules="loginRules" label-width="80px" class="login-form">
        <h2 class="title">i游阳朔后台管理平台</h2>
        
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.enter="handleLogin"></el-input>
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="loginForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="商户" value="marketer"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
        
        <div class="tips">
          <p>测试账号:</p>
          <p>管理员:LZC / 112119</p>
          <p>商户:marketer / 123456</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/index'
import { adminLogin } from '@/api/admin'
import { marketerLogin } from '@/api/marketer'

const store = useUserStore()
const router = useRouter()


const loginForm = reactive({
  username: '',
  password: '',
  role: ''
})

// 登录表单验证
const loginRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const handleLogin = async () => {
  try {
    let token, userInfo, loginInfo
    
    loginInfo = { 
      username: loginForm.username,
      password: loginForm.password
    }
    console.log(loginForm)  
    console.log(loginForm.value)
    console.log(loginInfo)
  
    if (loginForm.role === 'admin') {
      // 调用管理员登录接口
      const res = await adminLogin(loginInfo)
      token = res.token
      userInfo = {
        id: res.id,
        username: res.username,
        role: 'admin'
      }
    } else {
      // 调用商户登录接口
      const res = await marketerLogin(loginInfo)
      token = res.token
      userInfo = {
        id: res.id,
        username: res.username,
        role: 'marketer',
        marketerId: res.marketerId,
        status: res.status
      }
    }
    
    // 存储token和用户信息到Pinia
    store.setToken(token)
    store.setUserInfo(userInfo)
    
    // 跳转到首页
    router.push('/home/dashboard')
  } catch (error) {
    ElMessage.error('登录失败,请检查账号密码')
    console.error('登录错误:', error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e5799 0%, #2989d8 50%, #207cca 100%);
  padding: 20px;
  width: 100%;
}

.login-box {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  padding: 30px;
  transition: all 0.3s ease;
}

.login-form {
  margin-top: 20px;
}

.title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input,
.el-select {
  width: 100%;
}

.el-button {
  width: 100%;
  height: 42px;
  font-size: 16px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.el-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.tips {
  margin-top: 20px;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
}

.tips p {
  margin: 5px 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    padding: 20px;
  }
  
  .title {
    font-size: 22px;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .login-box {
    padding: 15px;
  }
  
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .el-form-item {
    margin-bottom: 15px;
  }
  
  .tips {
    padding: 10px;
    font-size: 12px;
  }
}

/* 确保在大屏幕上的适配 */
@media (min-width: 1024px) {
  .login-container {
    width: 100%;
  }
  
  .login-box {
    width: 100%;
    /* 增加了min-width确保在大屏幕上不会缩得太小 */
    min-width: 380px;
  }
}
</style>