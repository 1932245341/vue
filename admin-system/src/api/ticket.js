import request from './request'

// 获取门票列表（分页）
export const getTicketList = (params) => {
  return request({
    url: '/admin/ticket/page',
    method: 'get',
    params
  })
}

// 添加门票
export const addTicket = (data) => {
  return request({
    url: '/admin/ticket/add',
    method: 'post',
    data
  })
}

// 更新门票
export const updateTicket = (data) => {
  return request({
    url: '/admin/ticket',
    method: 'put',
    data
  })
}

// 删除门票
export const deleteTicket = (id) => {
  return request({
    url: '/admin/ticket',
    method: 'delete',
    params: { id }
  })
}

// 获取门票详情
export const getTicketDetail = (id) => {
  return request({
    url: `/admin/ticket/${id}`,
    method: 'get'
  })
}