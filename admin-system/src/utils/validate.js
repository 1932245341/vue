/**
 * 数据验证工具函数
 */

/**
 * 验证手机号
 * @param {string} phone 手机号码
 * @returns {boolean} 是否为有效的手机号
 */
export const isValidPhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱地址
 * @returns {boolean} 是否为有效的邮箱
 */
export const isValidEmail = (email) => {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 * @returns {boolean} 是否为有效的身份证号
 */
export const isValidIDCard = (idCard) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证URL
 * @param {string} url URL地址
 * @returns {boolean} 是否为有效的URL
 */
export const isValidURL = (url) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 验证密码强度
 * @param {string} password 密码
 * @param {Object} options 选项
 * @param {number} options.minLength 最小长度，默认8
 * @param {boolean} options.needNumber 是否需要数字，默认true
 * @param {boolean} options.needLowercase 是否需要小写字母，默认true
 * @param {boolean} options.needUppercase 是否需要大写字母，默认true
 * @param {boolean} options.needSpecial 是否需要特殊字符，默认false
 * @returns {boolean} 是否为有效的密码
 */
export const isValidPassword = (password, options = {}) => {
  const {
    minLength = 8,
    needNumber = true,
    needLowercase = true,
    needUppercase = true,
    needSpecial = false
  } = options
  
  // 检查长度
  if (password.length < minLength) return false
  
  // 检查是否包含数字
  if (needNumber && !/\d/.test(password)) return false
  
  // 检查是否包含小写字母
  if (needLowercase && !/[a-z]/.test(password)) return false
  
  // 检查是否包含大写字母
  if (needUppercase && !/[A-Z]/.test(password)) return false
  
  // 检查是否包含特殊字符
  if (needSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false
  
  return true
}

/**
 * 验证是否为空值
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为空值
 */
export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

/**
 * 验证是否为数字
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为数字
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * 验证是否为整数
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为整数
 */
export const isInteger = (value) => {
  return Number.isInteger(Number(value))
}