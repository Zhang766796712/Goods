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
    url: `/users/${data.id}`,
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
export function AssignRolesapi(params) {
  return request({
    url: '/roles',
    method: 'GET',
    params
  })
}
//  分配用户角色
export function SetRolesapi(id, rid) {
  return request({
    url: `/users/${id}/role`,
    method: 'PUT',
    data: { rid }
  })
}

// =======角色列表=======

// 获取角色列表
export function GetRoles(params) {
  return request({
    url: '/roles',
    method: 'GET',
    params
  })
}
// 添加角色列表
export function Addrole(data) {
  return request({
    url: '/roles',
    method: 'POST',
    data
  })
}
//编辑角色
export function Edirrole(data) {
  return request({
    url: `/roles/${data.id}`,
    method: 'PUT',
    data
  })
}
// 删除角色id
export function RemoveRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'DELETE'
  })
}
// 删除角色指定权限
export function RemoveRights({ id, tid }) {
  return request({
    url: `/roles/${id}/rights/${tid}`,
    method: 'DELETE'
  })
}
// 获取权限列表数据
export function getRightsapi() {
  return request({
    url: 'rights/list',
    method: 'GET'
  })
}
// 根据id查询角色接口
export function getRights() {
  return request({
    url: 'rights/tree',
    method: 'GET'
  })
}
// 角色更新授权接口  没有完成
export function changeRoles(data,Id) {
  return request({
    url: `roles/${Id}/rights`,
    method: 'POST',
    data
  })
}

// ==========商品列表==========

// 商品列表数据
export function getGoods(params) {
  return request({
    url: 'goods',
    method: 'GET',
    params
  })
}
// 删除商品数据
export function GoodsDelapi(id) {
  return request({
    url: `/goods/${id}`,
    method: 'DELETE'
  })
}
// 编辑商品数据 接口有问题 没有完成
export function GoodsEditapi(data) {
  return request({
    url: `/goods/${data.goods_id}`,
    method: 'PUT',
    data
  })
}
// 根据 ID 查询商品 
export function getGoodsParamsListApi(params) {
  return request({
    url: `goods/${id}`,
    method: 'GET',
    params
  })
}
// 图片上传
export function addGoodsImg(data) {
  return request({
    url: 'upload',
    method: 'POST',
    data
  })
}
// 封装商品分类接口
export function getGoodsCateList(params) {
  return request({
    url: '/categories',
    method: 'GET',
    params
  })
}
// 获取商品参数接口
export function getGoodsParams(cateId, sel = 'many') {
  return request({
    url: `categories/${cateId}/attributes`,
    method: 'GET',
    params: { sel }
  })
}
// 添加商品接口
export function addGoods(data) {
  return request({
    url: '/goods',
    method: 'POST',
    data
  })
}
// 删除分类数据
export function CategoriesDelApi(id) {
  return request({
    url: `/categories/${id}`,
    method: 'DELETE'
  })
}
//编辑提交分类
export function EditClassification(data,id) {
  return request({
    url: `/categories/${id}`,
    method: 'PUT',
    data
  })
}
// 添加商品分类
export function addGoodsApi(data) {
  return request({
    url: '/categories',
    method: 'POST',
    data
  })
}
// 编辑提交参数
export function editParams(catId,attrId,data) {
  return request({
    url: `/categories/${catId}/attributes/${attrId}`,
    method: 'PUT',
    data
  })
}
// 订单数据列表
export function OrdersListApi(params) {
  return request({
    url: '/orders',
    method: 'GET',
    params
  })
}

// 数据统计接口
export function getDataReportsApi() {
  return request({
    url: 'reports/type/1',
    method: 'GET',
  })
}