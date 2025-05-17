import request from './request'

/**
 * 管理员 - 登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function adminLogin(data) {
  return request({
    url: '/admin/admin/login',
    method: 'post',
    data
  })
}

