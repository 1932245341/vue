import request from './request'

/**
 * 管理员 - 分页查询景点
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {string} [params.name] - 景点名称模糊搜索（非必填）
 * @returns {Promise<PageResult>} 分页结果
 */
export function getScenicPage(params) {
  return request({
    url: '/admin/scenic/page',
    method: 'get',
    params
  })
}

/**
 * 管理员 - 添加景点
 * @param {Object} data - 景点信息
 * @param {string} data.name - 景点名称（必填）
 * @param {string} data.description - 景点描述（必填）
 * @param {string} data.location - 景点地址（必填）
 * @param {string} data.contact - 联系电话（必填）
 * @param {string} data.image - 封面图片URL（必填）
 * @param {number} [data.score] - 评分（非必填）
 * @param {number} data.minprice - 最低价格（必填）
 * @param {number} [data.sale] - 销量（非必填）
 * @param {string} [data.label] - 标签（非必填）
 * @param {number} [data.latitude] - 纬度（非必填）
 * @param {number} [data.longitude] - 经度（非必填）
 * @returns {Promise}
 */
export function addScenic(data) {
  return request({
    url: '/admin/scenic/add',
    method: 'post',
    data
  })
}

/**
 * 管理员 - 更新景点
 * @param {Object} data - 景点信息
 * @param {number} data.id - 景点ID（必填）
 * @param {string} [data.name] - 景点名称（非必填）
 * @param {string} [data.description] - 景点描述（非必填）
 * @param {string} [data.location] - 景点地址（非必填）
 * @param {string} [data.contact] - 联系电话（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.score] - 评分（非必填）
 * @param {number} [data.minprice] - 最低价格（非必填）
 * @param {number} [data.sale] - 销量（非必填）
 * @param {string} [data.label] - 标签（非必填）
 * @returns {Promise}
 */
export function updateScenic(data) {
  return request({
    url: '/admin/scenic',
    method: 'put',
    data
  })
}

/**
 * 管理员 - 删除景点
 * @param {number} id - 景点ID（必填）
 * @returns {Promise}
 */
export function deleteScenic(id) {
  return request({
    url: `/admin/scenic/${id}`, 
    method: 'delete'
  })
}
