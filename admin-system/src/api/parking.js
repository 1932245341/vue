import request from './request'

/**
 * 管理员 - 分页查询停车场
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {string} [params.name] - 停车场名称模糊搜索（非必填）
 * @returns {Promise<PageResult>}
 */
export function getParkingPage(params) {
  return request({
    url: '/marketer/parking/page',
    method: 'get',
    params
  })
}

/**
 * 管理员 - 添加停车场
 * @param {Object} data - 停车场信息
 * @param {string} data.name - 停车场名称（必填）
 * @param {string} data.location - 地址（必填）
 * @param {number} data.capacity - 总车位数（必填）
 * @param {number} [data.available] - 剩余车位数（非必填）
 * @param {string} [data.contact] - 联系方式（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.status] - 状态（0禁用 1启用，默认1）（非必填）
 * @returns {Promise}
 */
export function addParking(data) {
  return request({
    url: '/marketer/parking/add',
    method: 'post',
    data
  })
}

/**
 * 管理员 - 更新停车场
 * @param {Object} data - 停车场信息
 * @param {number} data.id - 停车场ID（必填）
 * @param {string} [data.name] - 停车场名称（非必填）
 * @param {string} [data.location] - 地址（非必填）
 * @param {number} [data.capacity] - 总车位数（非必填）
 * @param {number} [data.available] - 剩余车位数（非必填）
 * @param {string} [data.contact] - 联系方式（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.status] - 状态（0禁用 1启用）（非必填）
 * @returns {Promise}
 */
export function updateParking(data) {
  return request({
    url: '/marketer/parking',
    method: 'put',
    data
  })
}

/**
 * 管理员 - 删除停车场
 * @param {number} id - 停车场ID（必填）
 * @returns {Promise}
 */
export function deleteParking(id) {
  return request({
    url: `/marketer/parking/${id}`,
    method: 'delete'
  })
}
