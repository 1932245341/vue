/**
 * 通用工具函数
 */
import * as storage from './storage'
import * as format from './format'
import * as validate from './validate'
import * as request from './request'

/**
 * 防抖函数
 * @param {Function} fn 需要防抖的函数
 * @param {number} delay 延迟时间，单位毫秒
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 需要节流的函数
 * @param {number} delay 延迟时间，单位毫秒
 * @returns {Function} 节流后的函数
 */
export const throttle = (fn, delay = 300) => {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 深拷贝对象
 * @param {Object} obj 需要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  
  // 处理日期对象
  if (obj instanceof Date) return new Date(obj)
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))
  }
  
  // 处理对象
  const cloned = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  
  return cloned
}

/**
 * 生成唯一ID
 * @param {number} length ID长度，默认为16
 * @returns {string} 唯一ID
 */
export const generateUniqueId = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charsLength = chars.length
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }
  
  return result
}

/**
 * 获取URL参数
 * @param {string} name 参数名
 * @param {string} url URL，默认为当前页面URL
 * @returns {string|null} 参数值
 */
export const getUrlParam = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的文本
 * @returns {Promise} 复制结果Promise
 */
export const copyToClipboard = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    // 使用现代API
    return navigator.clipboard.writeText(text)
  } else {
    // 兼容旧浏览器
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (successful) {
          resolve()
        } else {
          reject(new Error('复制失败'))
        }
      } catch (err) {
        document.body.removeChild(textArea)
        reject(err)
      }
    })
  }
}

/**
 * 导出所有工具模块
 */
export {
  storage,
  format,
  validate,
  request
}

/**
 * 默认导出所有工具函数
 */
export default {
  ...storage,
  ...format,
  ...validate,
  ...request,
  debounce,
  throttle,
  deepClone,
  generateUniqueId,
  getUrlParam,
  copyToClipboard
}