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
export function UsersDeitapi(data) {
  return request({
    url:`/users/${data.id}`,
    method: 'PUT',
    data
  })
}

// 封装删除单个用户接口
export function UsersDelapi(id) {
  return request({
    url: `/users/${id}`,
    method: 'DELETE'
  })
}

// 封装修改用户状态接口
export function UsersState(data) {
  return request({
    url: `/users/${data.id}/state/${data.mg_state}`,
    method: 'PUT',
    data
  })
}
// 获取用户角色
export function AssignRolesapi(params){
  return request({
      url:'/roles',
      method:'GET',
      params
  })
}
//  分配用户角色
export function SetRolesapi(id,rid){
  return request({
      url:`/users/${id}/role`,
      method:'PUT',
      data:{rid}
  })
}

// =======角色列表=======

// 获取角色列表
export function GetRoles(params){
  return request({
      url:'/roles',
      method:'GET',
      params
  })
}
// 添加角色列表
export function Addrole(data){
  return request({
      url:'/roles',
      method:'POST',
      data
  })
}
//编辑角色
export function Edirrole(data){
  return request({
      url:`/roles/${data.id}`,
      method:'PUT',
      data
  })
}
// 删除角色
export function RemoveRole(id){
  return request({
   url:`/roles/${id}`,
   method:'DELETE'
  })
}