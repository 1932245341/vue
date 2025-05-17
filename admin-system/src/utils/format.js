/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象、日期字符串或时间戳
 * @param {string} format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  
  // 如果是时间戳或日期字符串，转为日期对象
  if (typeof date !== 'object') {
    date = new Date(date)
  }
  
  // 如果转换失败，返回空字符串
  if (date.toString() === 'Invalid Date') {
    return ''
  }
  
  const options = {
    'Y+': date.getFullYear(), // 年份
    'M+': date.getMonth() + 1, // 月份
    'D+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'h+': date.getHours() % 12 || 12, // 12小时制
    'm+': date.getMinutes(), // 分钟
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  
  // 替换年份
  if (/(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  
  // 替换其他时间单位
  for (let key in options) {
    if (new RegExp('(' + key + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? options[key] : ('00' + options[key]).substr(('' + options[key]).length)
      )
    }
  }
  
  return format
}

/**
 * 格式化金额为千分位
 * @param {number} num 数字
 * @param {number} decimals 小数位数，默认2位
 * @returns {string} 格式化后的金额字符串
 */
export const formatMoney = (num, decimals = 2) => {
  if (num === undefined || num === null || isNaN(num)) return '0.00'
  
  // 保留指定小数位数
  num = parseFloat(num).toFixed(decimals)
  
  // 千分位格式化
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return parts.join('.')
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @param {number} decimals 小数位数，默认2位
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * 格式化手机号码 (例如：188****8888)
 * @param {string} phone 手机号码
 * @returns {string} 格式化后的手机号码
 */
export const formatPhone = (phone) => {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化银行卡号 (每4位添加一个空格)
 * @param {string} cardNo 银行卡号
 * @returns {string} 格式化后的银行卡号
 */
export const formatBankCard = (cardNo) => {
  if (!cardNo) return ''
  return cardNo.toString().replace(/(\d{4})(?=\d)/g, '$1 ')
}