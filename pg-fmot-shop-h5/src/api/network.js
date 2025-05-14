
import REQUEST from '../utils/request';


export default {
  login, 

  bindActivityId,

  agreeAgreement,

  activityList,
  searchList,

  goodsDetail,

  orderActivityInfo,
  orderConfirm,

  orderDetailInfo,
  orderCancel,

  mineOrderList,
  mineExchangeList,

  cartList,
  cartChange,

  trackerSubmit,
};

// code 登录 [ok]
function login (params) {
  return REQUEST.post('/user/login', params)
}

// 账号绑定 [ok]
function bindActivityId (params) {
  return REQUEST.post('/api/user/bindPointAccount', params)
}
// 同意协议 [ok]
function agreeAgreement (params) {
  return REQUEST.post('/api/user/userAgreement', params)
}
// 活动列表 [ok]
function activityList (params) {
  return REQUEST.post('/api/activity/detailForH5', params)
}
// 搜索列表 (活动的下挂商品不会很多,前端筛选后端不提供商品查询接口) [ok]
function searchList (params) {
  return REQUEST.post('/api/activity/detailForH5', params)
}
// 商品详情 [ok]
function goodsDetail (params) {
  return REQUEST.post('/api/activity/activityProductForH5', params)
}
// 订单活动信息 [ok]
function orderActivityInfo (params) {
  return REQUEST.post('/api/activity/activityForOrderForH5', params) 
}
// 订单确认 [ok]
function orderConfirm (params) {
  return REQUEST.post('/api/shopCart/createOrder', params)
}
// 订单详情 [ok]
function orderDetailInfo (params) {
  return REQUEST.post('/api/shopCart/getOrderDetail', params)
}
// 取消订单 [ok]
function orderCancel (params) {
  return REQUEST.post('/api/shopCart/cancelOrder', params)
}
// 我的订单 [ok]
function mineOrderList (params) {
  return REQUEST.post('/api/shopCart/getMyInfo', params)
}
// 我的兑换 [ok]
function mineExchangeList () {
  return REQUEST.get('/api/activity/getMyForH5', {})
}
// 购物车 [ok]
function cartList (params) {
  return REQUEST.post('/api/shopCart/getMy', params)
}
// 加入、删除、修改购物车 [ok]
function cartChange (params) {
  return REQUEST.post('/api/shopCart/changeShopCartProduct', params)
}
// 埋点上报 [ok]
function trackerSubmit (params) {
  return REQUEST.post('/api/userActionLog/addUserActionLog', params)
}