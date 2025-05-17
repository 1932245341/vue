import request from './request'

/**
 * 管理员 - 分页查询餐馆
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {string} [params.name] - 餐馆名称模糊搜索（非必填）
 * @returns {Promise<PageResult>} 分页结果
 */
export function getRestaurantPage(params) {
  return request({
    url: '/marketer/restaurant/page',
    method: 'get',
    params
  })
}

/**
 * 管理员/商户 - 添加餐馆
 * @param {Object} data - 餐馆信息
 * @param {string} data.name - 餐馆名称（必填）
 * @param {string} data.location - 餐馆地址（必填）
 * @param {string} data.contact - 联系方式（必填）
 * @param {string} data.image - 封面图片URL（必填）
 * @param {number} data.minprice - 最低价格（必填）
 * @param {number} [data.latitude] - 纬度（非必填）
 * @param {number} [data.longitude] - 经度（非必填）
 * @param {string} [data.license] - 营业执照图片URL（非必填）
 * @param {string} [data.time] - 营业时间（非必填）
 * @returns {Promise}
 */
export function addRestaurant(data) {
  return request({
    url: '/marketer/restaurant/add',
    method: 'post',
    data
  })
}

/**
 * 管理员/商户 - 更新餐馆
 * @param {Object} data - 餐馆信息
 * @param {number} data.id - 餐馆ID（必填）
 * @param {string} [data.name] - 餐馆名称（非必填）
 * @param {string} [data.location] - 餐馆地址（非必填）
 * @param {string} [data.contact] - 联系方式（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.minprice] - 最低价格（非必填）
 * @param {number} [data.latitude] - 纬度（非必填）
 * @param {number} [data.longitude] - 经度（非必填）
 * @param {string} [data.license] - 营业执照图片URL（非必填）
 * @param {string} [data.time] - 营业时间（非必填）
 * @returns {Promise}
 */
export function updateRestaurant(data) {
  return request({
    url: '/marketer/restaurant',
    method: 'put',
    data
  })
}

/**
 * 管理员/商户 - 删除餐馆
 * @param {number} id - 餐馆ID（必填）
 * @returns {Promise}
 */
export function deleteRestaurant(id) {
  return request({
    url: `/marketer/restaurant/${id}`, 
    method: 'delete'
  })
}
