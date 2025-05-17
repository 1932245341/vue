import request from './request'

/**
 * 管理员 - 分页查询门票
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {number} [params.scenicId] - 关联景区ID（非必填）
 * @param {string} [params.name] - 门票名称模糊搜索（非必填）
 * @returns {Promise<PageResult>}
 */
export function getTicketPage(params) {
  return request({
    url: '/admin/ticket/page',
    method: 'get',
    params
  })
}

/**
 * 管理员 - 添加门票
 * @param {Object} data - 门票信息
 * @param {number} data.scenicId - 所属景区ID（必填）
 * @param {string} data.name - 门票名称（必填）
 * @param {number} data.price - 价格（必填）
 * @param {string} data.description - 描述（必填）
 * @param {string} [data.label] - 标签（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @returns {Promise}
 */
export function addTicket(data) {
  return request({
    url: '/admin/ticket/add',
    method: 'post',
    data
  })
}

/**
 * 管理员 - 更新门票
 * @param {Object} data - 门票信息
 * @param {number} data.id - 门票ID（必填）
 * @param {number} [data.scenicId] - 所属景区ID（非必填）
 * @param {string} [data.name] - 门票名称（非必填）
 * @param {number} [data.price] - 价格（非必填）
 * @param {string} [data.description] - 描述（非必填）
 * @param {string} [data.label] - 标签（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @returns {Promise}
 */
export function updateTicket(data) {
  return request({
    url: '/admin/ticket',
    method: 'put',
    data
  })
}

/**
 * 管理员 - 删除门票
 * @param {number} id - 门票ID（必填）
 * @returns {Promise}
 */
export function deleteTicket(id) {
  return request({
    url: `/admin/ticket/${id}`,
    method: 'delete'
  })
}
