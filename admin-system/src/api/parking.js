import request from './request'

// 获取停车场列表（分页）
export const getParkingList = (params) => {
  return request({
    url: '/admin/parking/page',
    method: 'get',
    params
  })
}

// 获取所有停车场列表
export const getAllParkingList = () => {
  return request({
    url: '/admin/parking/list',
    method: 'get'
  })
}

// 添加停车场
export const addParking = (data) => {
  return request({
    url: '/admin/parking/add',
    method: 'post',
    data
  })
}

// 更新停车场
export const updateParking = (data) => {
  return request({
    url: '/admin/parking/update',
    method: 'put',
    data
  })
}