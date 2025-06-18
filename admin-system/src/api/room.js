import request from './request'

// 获取房间列表（分页）
export const getRoomList = (params) => {
  return request({
    url: '/marketer/room/page',
    method: 'get',
    params
  })
}

// 添加房间
export const addRoom = (data) => {
  return request({
    url: '/marketer/room/add',
    method: 'post',
    data
  })
}

// 更新房间
export const updateRoom = (data) => {
  return request({
    url: '/marketer/room',
    method: 'put',
    data
  })
}

// 删除房间
export const deleteRoom = (id) => {
  return request({
    url: '/marketer/room',
    method: 'delete',
    params: { id }
  })
}

// 获取房间详情
export const getRoomDetail = (id) => {
  return request({
    url: `/marketer/room/${id}`,
    method: 'get'
  })
}