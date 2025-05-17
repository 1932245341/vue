/**
 * 本地存储管理工具
 */

/**
 * 设置localStorage
 * @param {string} key 键名
 * @param {any} value 值
 * @param {number} expire 过期时间（毫秒），可选
 */
export const setLocal = (key, value, expire = 0) => {
  const data = {
    value,
    time: Date.now(),
    expire: expire > 0 ? Date.now() + expire : 0
  }
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * 获取localStorage
 * @param {string} key 键名
 * @returns {any} 存储的值，如果过期或不存在则返回null
 */
export const getLocal = (key) => {
  const dataStr = localStorage.getItem(key)
  if (!dataStr) return null
  
  try {
    const data = JSON.parse(dataStr)
    // 检查是否过期
    if (data.expire && data.expire < Date.now()) {
      localStorage.removeItem(key)
      return null
    }
    return data.value
  } catch (err) {
    return null
  }
}

/**
 * 移除localStorage
 * @param {string} key 键名
 */
export const removeLocal = (key) => {
  localStorage.removeItem(key)
}

/**
 * 清空所有localStorage
 */
export const clearLocal = () => {
  localStorage.clear()
}

/**
 * 设置sessionStorage
 * @param {string} key 键名
 * @param {any} value 值
 */
export const setSession = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify({ value }))
}

/**
 * 获取sessionStorage
 * @param {string} key 键名
 * @returns {any} 存储的值，如果不存在则返回null
 */
export const getSession = (key) => {
  const dataStr = sessionStorage.getItem(key)
  if (!dataStr) return null
  
  try {
    const data = JSON.parse(dataStr)
    return data.value
  } catch (err) {
    return null
  }
}

/**
 * 移除sessionStorage
 * @param {string} key 键名
 */
export const removeSession = (key) => {
  sessionStorage.removeItem(key)
}

/**
 * 清空所有sessionStorage
 */
export const clearSession = () => {
  sessionStorage.clear()
}