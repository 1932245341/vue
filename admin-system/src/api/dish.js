import request from './request'

/**
 * 管理员/商户 - 分页查询菜品
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {number} [params.restaurantId] - 关联餐馆ID（非必填）
 * @param {string} [params.name] - 菜品名称模糊搜索（非必填）
 * @returns {Promise<PageResult>}
 */
export function getDishPage(params) {
  return request({
    url: '/marketer/dish/page',
    method: 'get',
    params
  })
}

/**
 * 管理员/商户 - 添加菜品
 * @param {Object} data - 菜品信息
 * @param {number} data.restaurantId - 所属餐馆ID（必填）
 * @param {string} data.name - 菜品名称（必填）
 * @param {string} data.image - 菜品图片URL（必填）
 * @param {number} data.price - 菜品价格（必填）
 * @param {string} [data.description] - 描述（非必填）
 * @param {number} [data.status] - 状态（0禁用 1启用，默认1）（非必填）
 * @returns {Promise}
 */
export function addDish(data) {
  return request({
    url: '/marketer/dish/add',
    method: 'post',
    data
  })
}

/**
 * 管理员/商户 - 更新菜品
 * @param {Object} data - 菜品信息
 * @param {number} data.id - 菜品ID（必填）
 * @param {number} [data.restaurantId] - 所属餐馆ID（非必填）
 * @param {string} [data.name] - 菜品名称（非必填）
 * @param {string} [data.image] - 菜品图片URL（非必填）
 * @param {number} [data.price] - 菜品价格（非必填）
 * @param {string} [data.description] - 描述（非必填）
 * @param {number} [data.status] - 状态（0禁用 1启用）（非必填）
 * @returns {Promise}
 */
export function updateDish(data) {
  return request({
    url: '/marketer/dish',
    method: 'put',
    data
  })
}

/**
 * 管理员/商户 - 删除菜品
 * @param {number} id - 菜品ID（必填）
 * @returns {Promise}
 */
export function deleteDish(id) {
  return request({
    url: `/marketer/dish/${id}`,
    method: 'delete'
  })
}
