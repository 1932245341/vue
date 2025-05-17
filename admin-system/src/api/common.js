import request from './request'

/**
 * 上传文件（支持图片等）
 * @param {File} file - 要上传的文件对象
 * @returns {Promise<{data: string}>} 返回文件URL
 * 调用uploadFile()上传文件获取URL
 * 调用addImage()将URL与资源关联
 * 需要时调用deleteImage()解除关联
 * 查询时调用getImages()获取关联图片
 */
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/common/file/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 添加关联图片
 * @param {Object} data - 图片信息
 * @param {number} [data.restaurantId] - 餐馆ID
 * @param {number} [data.hotelId] - 酒店ID
 * @param {number} [data.scenicId] - 景点ID
 * @param {string} data.image - 图片URL（必填）
 * @returns {Promise}
 */
export function addImage(data) {
  return request({
    url: '/common/images/insert',
    method: 'post',
    data
  })
}

/**
 * 删除图片
 * @param {number} id - 图片ID（必填）
 * @returns {Promise}
 */
export function deleteImage(id) {
  return request({
    url: '/common/images/delete',
    method: 'post',
    data: { id }
  })
}

/**
 * 获取关联图片列表
 * @param {Object} params - 查询参数
 * @param {number} [params.restaurantId] - 餐馆ID（三选一）
 * @param {number} [params.hotelId] - 酒店ID（三选一）
 * @param {number} [params.scenicId] - 景点ID（三选一）
 * @returns {Promise<{data: ImageEntity[]}>}
 */
export function getImages(params) {
  return request({
    url: '/common/images/list',
    method: 'get',
    params
  })
}
