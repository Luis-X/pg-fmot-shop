export const userLogin = '/admin/login'; // 登录
export const userList = '/api/admin/portalAdminUser/selectAdminUser' // 用户列表查询
export const userSave = '/api/admin/portalAdminUser/addAdminUser' // 添加用户
export const changeStatus = '/api/admin/portalAdminUser/changeStatus' // 账户登录控制
export const storeList = '/api/admin/shop/selectPortalShop' // 商户列表查询接口
export const marketData = '/api/admin/baseData/shopMarketData' // 商户market查询
export const storeChangeStatus = '/api/admin/shop/changeStatus' // 商户禁用启用
export const storeSave = '/api/admin/shop/addShop' // 添加商户
export const ownerList = '/api/admin/shop/detail/employee' // 商户人员列表
export const employeeChangeStatus = '/api/admin/employee/onOff' // 人员列表禁用启用
export const employeeSetLeader = '/api/admin/employee/setLeader' // 人员列表设置店长
export const addBlack = '/api/admin/employee/add/blacklist' // 人员列表加入黑名单
export const blackList = '/api/admin/employee/blacklist' // 黑名单列表
export const removeBlack = '/api/admin/employee/remove/blacklist' // 移除黑名单
export const changePassword = '/api/admin/applicationConfiguration/changePassword' // 修改商户绑定密码
export const ssoLogin = '/admin/ssoLogin' // 管理员SSO登陆接口
export const eventList = '/api/admin/event/select/list' // 折扣活动列表
export const eventDetail = '/api/admin/event/select/detail' // 折扣活动详情
export const saveEvent = '/api/admin/event/save/event' // 保存折扣活动
export const publishEvent = '/api/admin/event/publish/event' // 发布折扣活动
export const lineupList = '/api/admin/lineup/select/list' // lineup列表
// export const lineupChangeStatus = '/api/admin/lineup/expireOrActivityLineup' // lineup启用禁用
export const lineupSave = '/api/admin/lineup/save/lineup' // 新增lineup
export const GenerateQRCode = '/api/admin/lineup/generateLineupQrCode' // 生成二维码
export const QRCodeHistory = '/api/admin/lineup/selectLineupQrCode' // 二维码历史记录
export const regenerate = '/api/admin/lineup/regenerateLineupQrCode' // 重新生成二维码
export const reportList = '/api/admin/couponWriteLog/select/list' // report列表
export const logList = '/api/admin/portalSystemLog/select' // log列表
// export const pointImportTemplateUrl = '/get/pointImportTemplateUrl' // 获取批量商户导入模版
export const importForAdmin = '/api/admin/shop/importForAdmin' // 批量导入
export const couponImportForAdmin = '/api/admin/couponWriteLog/importForAdmin' // 批量导入优惠券结算
export const exportByEventId = '/api/admin/couponWriteLog/exportByEventId' // 按EventId导出核销记录
export const downloadSuccess = '/api/admin/lineup/downloadSuccess' // 下载二维码回调
export const logout = '/api/admin/logout' // 退出系统
export const changePasswordNew = '/api/admin/applicationConfiguration/changePassword' // 修改商户绑定密码

export const uploadFile = window.location.origin === 'https://ehome.cn-x-cloud-pg.com.cn' ?
    'https://storage.pg.com.cn/v1/files' : 'https://storage-qa.pg.com.cn/v1/files';
