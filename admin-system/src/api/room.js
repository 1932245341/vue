import request from './request'

/**
 * 管理员/商户 - 分页查询套房
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {number} params.hotelId - 所属酒店ID（必填）
 * @returns {Promise<PageResult>}
 */
export function getRoomPage(params) {
  return request({
    url: '/marketer/room/page',
    method: 'get',
    params
  })
}

/**
 * 管理员/商户 - 添加套房
 * @param {Object} data - 套房信息
 * @param {number} data.hotelId - 所属酒店ID（必填）
 * @param {string} data.name - 套房名称（必填）
 * @param {string} data.bed - 床型（必填）
 * @param {number} data.price - 房价（必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.status] - 状态（0禁用 1启用，默认1）（非必填）
 * @returns {Promise}
 */
export function addRoom(data) {
  return request({
    url: '/marketer/room/add',
    method: 'post',
    data
  })
}

/**
 * 管理员/商户 - 更新套房
 * @param {Object} data - 套房信息
 * @param {number} data.id - 套房ID（必填）
 * @param {string} [data.name] - 套房名称（非必填）
 * @param {string} [data.bed] - 床型（非必填）
 * @param {number} [data.price] - 房价（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.status] - 状态（0禁用 1启用）（非必填）
 * @returns {Promise}
 */
export function updateRoom(data) {
  return request({
    url: '/marketer/room',
    method: 'put',
    data
  })
}

/**
 * 管理员/商户 - 删除套房
 * @param {number} id - 套房ID（必填）
 * @returns {Promise}
 */
export function deleteRoom(id) {
  return request({
    url: `/marketer/room/${id}`,
    method: 'delete'
  })
}
