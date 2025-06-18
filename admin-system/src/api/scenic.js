import request from './request'

// 获取景点列表（分页）
export const getScenicList = (params) => {
  return request({
    url: '/admin/scenic/page',
    method: 'get',
    params
  })
}

// 添加景点
export const addScenic = (data) => {
  return request({
    url: '/admin/scenic/add',
    method: 'post',
    data
  })
}

// 更新景点
export const updateScenic = (data) => {
  return request({
    url: '/admin/scenic',
    method: 'put',
    data
  })
}

// 删除景点
export const deleteScenic = (id) => {
  return request({
    url: '/admin/scenic',
    method: 'delete',
    params: { id }
  })
}

// 获取景点详情
export const getScenicDetail = (id) => {
  return request({
    url: `/admin/scenic/${id}`,
    method: 'get'
  })
}