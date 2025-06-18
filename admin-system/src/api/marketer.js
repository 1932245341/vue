import request from './request'

// 获取营销人员列表（分页）
export const getMarketerList = (params) => {
  return request({
    url: '/marketer/page',
    method: 'get',
    params
  })
}

// 添加营销人员
export const addMarketer = (data) => {
  return request({
    url: '/marketer/add',
    method: 'post',
    data
  })
}

// 更新营销人员
export const updateMarketer = (data) => {
  return request({
    url: '/marketer/update',
    method: 'put',
    data
  })
}

// 删除营销人员
export const deleteMarketer = (id) => {
  return request({
    url: '/marketer',
    method: 'delete',
    params: { id }
  })
}

// 营销人员登录
export const marketerLogin = (data) => {
  return request({
    url: '/marketer/login',
    method: 'post',
    data
  })
}