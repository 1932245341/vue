import request from './request'

// 获取餐厅列表（分页）
export const getRestaurantList = (params) => {
  return request({
    url: '/marketer/restaurant/page',
    method: 'get',
    params
  })
}

// 添加餐厅
export const addRestaurant = (data) => {
  return request({
    url: '/marketer/restaurant/add',
    method: 'post',
    data
  })
}

// 更新餐厅
export const updateRestaurant = (data) => {
  return request({
    url: '/marketer/restaurant',
    method: 'put',
    data
  })
}

// 删除餐厅
export const deleteRestaurant = (id) => {
  return request({
    url: '/marketer/restaurant',
    method: 'delete',
    params: { id }
  })
}