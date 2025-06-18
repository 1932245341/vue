import request from './request'

// 获取特产列表（分页）
export const getSpecialtyList = (params) => {
  return request({
    url: '/admin/specialty/page',
    method: 'get',
    params
  })
}

// 添加特产
export const addSpecialty = (data) => {
  return request({
    url: '/admin/specialty/add',
    method: 'post',
    data
  })
}

// 更新特产
export const updateSpecialty = (data) => {
  return request({
    url: '/admin/specialty/update',
    method: 'put',
    data
  })
}

// 删除特产
export const deleteSpecialty = (id) => {
  return request({
    url: `/admin/specialty/delete/${id}`,
    method: 'delete'
  })
}