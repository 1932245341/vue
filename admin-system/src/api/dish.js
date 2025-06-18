import request from './request'

// 获取菜品列表（分页）
export const getDishList = (params) => {
  return request({
    url: '/marketer/dish/page',
    method: 'get',
    params
  })
}

// 添加菜品
export const addDish = (data) => {
  return request({
    url: '/marketer/dish/add',
    method: 'post',
    data
  })
}

// 更新菜品
export const updateDish = (data) => {
  return request({
    url: '/marketer/dish',
    method: 'put',
    data
  })
}

// 删除菜品
export const deleteDish = (id) => {
  return request({
    url: '/marketer/dish',
    method: 'delete',
    params: { id }
  })
}

// 获取菜品详情
export const getDishDetail = (id) => {
  return request({
    url: `/marketer/dish/${id}`,
    method: 'get'
  })
}