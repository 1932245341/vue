import request from './request'

/**
 * 管理员 - 分页查询特产
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {string} [params.name] - 特产名称模糊搜索（非必填）
 * @returns {Promise<PageResult>}
 */
export function getSpecialtyPage(params) {
  return request({
    url: '/marketer/specialty/page',
    method: 'get',
    params
  })
}

/**
 * 管理员 - 添加特产
 * @param {Object} data - 特产信息
 * @param {string} data.name - 特产名称（必填）
 * @param {string} data.type - 类型（食品/工艺品）（必填）
 * @param {number} data.price - 价格（必填）
 * @param {string} data.description - 描述（必填）
 * @param {string} data.image - 封面图片URL（必填）
 * @param {number} [data.status] - 状态（0禁用 1启用，默认1）（非必填）
 * @returns {Promise}
 */
export function addSpecialty(data) {
  return request({
    url: '/marketer/specialty/add',
    method: 'post',
    data
  })
}

/**
 * 管理员 - 更新特产
 * @param {Object} data - 特产信息
 * @param {number} data.id - 特产ID（必填）
 * @param {string} [data.name] - 特产名称（非必填）
 * @param {string} [data.type] - 类型（食品/工艺品）（非必填）
 * @param {number} [data.price] - 价格（非必填）
 * @param {string} [data.description] - 描述（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.status] - 状态（0禁用 1启用）（非必填）
 * @returns {Promise}
 */
export function updateSpecialty(data) {
  return request({
    url: '/marketer/specialty',
    method: 'put',
    data
  })
}

/**
 * 管理员 - 删除特产
 * @param {number} id - 特产ID（必填）
 * @returns {Promise}
 */
export function deleteSpecialty(id) {
  return request({
    url: `/marketer/specialty/${id}`,
    method: 'delete'
  })
}
