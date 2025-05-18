import axios from 'axios'
import router from '../router'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',  // 修改为相对路径，通过代理转发
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 根据后端返回的状态码进行处理
    if (res.code && res.code !== 200) {
      // 处理各种错误情况
      if (res.code === 401) {
        // 未授权，跳转到登录页
        localStorage.removeItem('token')
        router.push('/login')
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    if (error.response && error.response.status === 401) {
      // 未授权，跳转到登录页
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request