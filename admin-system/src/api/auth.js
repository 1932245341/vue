import request from './request'

// 管理员登录
export const login = (data) => {
  return request({
    url: '/admin/admin/login',
    method: 'post',
    data
  })
}

// 获取管理员信息
export const getAdminInfo = () => {
  return request({
    url: '/admin/admin/info',
    method: 'get'
  })
}