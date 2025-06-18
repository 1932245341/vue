import request from './request'

// 获取酒店列表（分页）
export const getHotelList = (params) => {
  return request({
    url: '/marketer/hotel/page',
    method: 'get',
    params
  })
}

// 添加酒店
export const addHotel = (data) => {
  return request({
    url: '/marketer/hotel/add',
    method: 'post',
    data
  })
}

// 更新酒店
export const updateHotel = (data) => {
  return request({
    url: '/marketer/hotel',
    method: 'put',
    data
  })
}

// 删除酒店
export const deleteHotel = (id) => {
  return request({
    url: '/marketer/hotel',
    method: 'delete',
    params: { id }
  })
}

// 获取酒店详情
export const getHotelDetail = (id) => {
  return request({
    url: `/marketer/hotel/${id}`,
    method: 'get'
  })
}