// 封装各种业务接口 如 登录 搜索 添加商品
import request from './request'

// 封装登录接口
export function Loginapi(data) {
  return request({
    url: '/login',
    method: 'POST', //post方式用data接收，get方式用params接收
    data
  })
}
// 封装左侧导航接口
export function Menusapi() {
  return request({
    url: '/menus',
    method: 'GET'
  })
}
// 封装用户数据列表接口
export function Usersapi(params) {
  return request({
    url: '/users',
    method: 'GET',
    params
  })
}
// 封装添加用户接口
export function AddUsersapi(data) {
  return request({
    url: '/users',
    method: 'POST',
    data
  })
}
// 封装编辑用户提交接口
export function UsersDeitapi() {
  return request({
    url: '/users/:id',
    method: 'PUT'
  })
}
// 封装删除单个用户接口
export function UsersDelapi() {
  return request({
    url: '/users/:id',
    method: 'DELETE'
  })
}
