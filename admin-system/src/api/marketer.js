import request from './request'

/**
 * 商户 - 登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 商户账号（必填）
 * @param {string} data.password - 登录密码（必填）
 * @returns {Promise<{data: MarketerLoginVO}>} 包含token的登录结果
 */
export function marketerLogin(data) {
  return request({
    url: '/marketer/login',
    method: 'post',
    data
  })
}

/**
 * 商户 - 申请入驻
 * @param {Object} data - 商户信息
 * @param {string} data.username - 商户账号（必填）
 * @param {string} data.password - 登录密码（必填）
 * @param {string} data.name - 真实姓名（必填）
 * @param {string} data.idcard - 身份证号（必填）
 * @param {string} data.contact - 联系方式（必填）
 * @param {string} [data.license] - 营业执照图片URL（非必填）
 * @returns {Promise}
 */
export function applyMarketer(data) {
  return request({
    url: '/marketer/add',
    method: 'post',
    data
  })
}

/**
 * 管理员 - 分页查询商户
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {string} [params.username] - 账号模糊搜索（非必填）
 * @param {string} [params.name] - 姓名模糊搜索（非必填）
 * @returns {Promise<PageResult>}
 */
export function getMarketerPage(params) {
  return request({
    url: '/marketer/page',
    method: 'get',
    params
  })
}

/**
 * 管理员 - 更新商户信息
 * @param {Object} data - 商户信息
 * @param {number} data.id - 商户ID（必填）
 * @param {string} [data.username] - 商户账号（非必填）
 * @param {string} [data.name] - 姓名（非必填）
 * @param {string} [data.idcard] - 身份证号（非必填）
 * @param {string} [data.contact] - 联系方式（非必填）
 * @param {string} [data.license] - 营业执照图片URL（非必填）
 * @param {number} [data.status] - 状态（0申请中 1已通过 2已拒绝）（非必填）
 * @returns {Promise}
 */
export function updateMarketer(data) {
  return request({
    url: '/marketer/update',
    method: 'put',
    data
  })
}

/**
 * 管理员 - 删除商户
 * @param {number} id - 商户ID（必填）
 * @returns {Promise}
 */
export function deleteMarketer(id) {
  return request({
    url: `/marketer/${id}`,
    method: 'delete'
  })
}
