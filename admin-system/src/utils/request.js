/**
 * HTTP请求工具函数
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getLocal, removeLocal } from './storage'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 使用代理前缀，通过vue.config.js中的代理配置转发请求
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = getLocal('token')
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
service.interceptors.response.use(
  response => {
    const res = response.data
    // 根据后端返回的状态码进行处理
    if (res.code && res.code !== 200) {
      // 处理各种错误情况
      if (res.code === 401) {
        // 未授权，跳转到登录页
        removeLocal('token')
        router.push('/login')
      }
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          removeLocal('token')
          router.push('/login')
          ElMessage.error('登录已过期，请重新登录')
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(error.message || '请求失败')
      }
    } else {
      // 请求超时或网络错误
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后再试')
      } else {
        ElMessage.error('网络错误，请检查您的网络连接')
      }
    }
    return Promise.reject(error)
  }
)

/**
 * GET请求
 * @param {string} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export const get = (url, params = {}, config = {}) => {
  return service.get(url, { params, ...config })
}

/**
 * POST请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export const post = (url, data = {}, config = {}) => {
  return service.post(url, data, config)
}

/**
 * PUT请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export const put = (url, data = {}, config = {}) => {
  return service.put(url, data, config)
}

/**
 * DELETE请求
 * @param {string} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} config 额外配置
 * @returns {Promise} 请求Promise
 */
export const del = (url, params = {}, config = {}) => {
  return service.delete(url, { params, ...config })
}

/**
 * 上传文件
 * @param {string} url 上传地址
 * @param {FormData} formData 表单数据
 * @param {Function} onProgress 上传进度回调
 * @returns {Promise} 上传Promise
 */
export const upload = (url, formData, onProgress = null) => {
  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress ? e => {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100
      }
      onProgress(e)
    } : undefined
  })
}

/**
 * 下载文件
 * @param {string} url 下载地址
 * @param {Object} params 请求参数
 * @param {string} filename 文件名
 * @returns {Promise} 下载Promise
 */
export const download = (url, params = {}, filename = '') => {
  return service.get(url, {
    params,
    responseType: 'blob'
  }).then(response => {
    // 创建blob链接并下载
    const blob = new Blob([response])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename || getFilenameFromResponse(response)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
    return response
  })
}

/**
 * 从响应头获取文件名
 * @param {Object} response 响应对象
 * @returns {string} 文件名
 */
const getFilenameFromResponse = (response) => {
  const contentDisposition = response.headers['content-disposition']
  if (contentDisposition) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = filenameRegex.exec(contentDisposition)
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]*/g, '')
    }
  }
  return 'download'
}

// 导出axios实例
export default service