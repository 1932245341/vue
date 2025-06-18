import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/auth'
import { marketerLogin } from '@/api/marketer'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('user_token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('user_userInfo') || '{}'))
  const userRole = ref(localStorage.getItem('user_role') || '')

  // 登录
  const login = async (loginForm) => {
    try {
      let response
      // 根据角色选择不同的登录API
      if (loginForm.role === 'admin') {
        response = await loginApi({ username: loginForm.username, password: loginForm.password })
      } else {
        response = await marketerLogin({ username: loginForm.username, password: loginForm.password })
      }
      
      if (response.code === 1) {
        token.value = response.data.token
        userInfo.value = response.data
        userRole.value = loginForm.role
        
        localStorage.setItem('user_token', token.value)
        localStorage.setItem('user_userInfo', JSON.stringify(userInfo.value))
        localStorage.setItem('user_role', userRole.value)
        
        return response
      } else {
        throw new Error(response.msg || '登录失败')
      }
    } catch (error) {
      throw error
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    userRole.value = ''
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_userInfo')
    localStorage.removeItem('user_role')
  }

  // 获取用户信息
  const getUserInfo = () => {
    return userInfo.value
  }

  // 获取用户角色
  const getUserRole = () => {
    return userRole.value
  }

  return {
    token,
    userInfo,
    userRole,
    login,
    logout,
    getUserInfo,
    getUserRole
  }
})