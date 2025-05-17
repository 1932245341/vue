import request from './request'

/**
 * 管理员 - 分页查询酒店
 * @param {Object} params - 分页参数
 * @param {number} params.page - 当前页码（必填）
 * @param {number} params.pageSize - 每页条目数（必填）
 * @param {string} [params.name] - 酒店名称模糊搜索（非必填）
 * @param {number} [params.scenicId] - 关联景区ID（非必填）
 * @param {number} [params.hotelId] - 酒店ID（非必填）
 * @param {number} [params.restaurantId] - 餐馆ID（非必填）
 * @returns {Promise<PageResult>} 分页结果
 */
export function getHotelPage(params) {
  return request({
    url: '/marketer/hotel/page',
    method: 'get',
    params
  })
}

/**
 * 管理员/商户 - 添加酒店
 * @param {Object} data - 酒店信息
 * @param {string} data.name - 酒店名称（必填）
 * @param {string} data.location - 酒店地址（必填）
 * @param {string} data.contact - 联系方式（必填）
 * @param {string} data.image - 封面图片URL（必填）
 * @param {number} data.minprice - 最低价格（必填）
 * @param {number} [data.latitude] - 纬度（非必填）
 * @param {number} [data.longitude] - 经度（非必填）
 * @param {string} [data.label] - 标签（非必填）
 * @param {string} [data.openingYear] - 开业年份（非必填）
 * @param {string} [data.fitmentYear] - 装修年份（非必填）
 * @param {string} [data.license] - 营业执照图片URL（非必填）
 * @param {number} [data.floornum] - 楼层数（非必填）
 * @param {number} [data.roomnum] - 客房数（非必填）
 * @returns {Promise}
 */
export function addHotel(data) {
  return request({
    url: '/marketer/hotel/add',
    method: 'post',
    data
  })
}

/**
 * 管理员/商户 - 更新酒店
 * @param {Object} data - 酒店信息
 * @param {number} data.id - 酒店ID（必填）
 * @param {string} [data.name] - 酒店名称（非必填）
 * @param {string} [data.location] - 酒店地址（非必填）
 * @param {string} [data.contact] - 联系方式（非必填）
 * @param {string} [data.image] - 封面图片URL（非必填）
 * @param {number} [data.minprice] - 最低价格（非必填）
 * @param {number} [data.latitude] - 纬度（非必填）
 * @param {number} [data.longitude] - 经度（非必填）
 * @param {string} [data.label] - 标签（非必填）
 * @param {string} [data.openingYear] - 开业年份（非必填）
 * @param {string} [data.fitmentYear] - 装修年份（非必填）
 * @param {string} [data.license] - 营业执照图片URL（非必填）
 * @param {number} [data.floornum] - 楼层数（非必填）
 * @param {number} [data.roomnum] - 客房数（非必填）
 * @returns {Promise}
 */
export function updateHotel(data) {
  return request({
    url: '/marketer/hotel',
    method: 'put',
    data
  })
}

/**
 * 管理员/商户 - 删除酒店
 * @param {number} id - 酒店ID（必填）
 * @returns {Promise}
 */
export function deleteHotel(id) {
  return request({
    url: `/marketer/hotel/${id}`, 
    method: 'delete'
  })
}
