// 上传文件
export const uploadFile = window.location.origin === 'https://ministore.shenghuojia.com' ? 'https://storage.pg.com.cn/v1/files' : 'https://storage-qa.pg.com.cn/v1/files';
export const uploadFileSign = ''   // 获取上传文件签名
    
// 登录、登出
export const ssoLogin = '/admin/ssoLogin' // 管理员SSO登陆接口
export const logout = '/api/admin/logout' // 退出系统

// 通用
export const orgCodeList = ''   //机构代码

// 内部账户
export const internalAccountList = ''   // 内部账号列表
export const internalAccountChangeStatus = '' // 内部账号状态变更
export const internalAccountImport = '' // 内部账号导入
export const internalAccountImportTemplate = '/api/get/pointImportTemplateUrl' // 内部账号导入模版
export const internalAccountImportPoints = '' // 内部账号积分导入
export const internalAccountImportTemplatePoints = '' // 内部账号积分导入模版

// 外部账号
export const externalAccountList = ''   // 外部账号列表
export const externalAccountChangeStatus = '' // 外部账号状态变更
export const externalAccountImport = '' // 外部账号导入
export const externalAccountImportTemplate = '' // 外部账号导入模版
export const externalAccountImportPoints = '' // 外部账号积分导入
export const externalAccountImportTemplatePoints = '' // 外部账号积分导入模版

// 活动
export const eventList = ''   // 活动列表
export const eventCopy = ''   // 活动复制
export const eventDetail = ''   // 活动详情
export const eventCreate = ''   // 活动创建
export const eventSave = ''   // 活动保存

// 订单
export const orderList = ''   // 订单列表
export const orderListExport = ''   // 订单列表导出

// 商品
export const goodsSearchList = ''   // 商品搜索
export const goodsList = ''   // 商品列表
export const goodsCategoryList = ''   // 商品类别
export const goodsDetail = ''   // 活动详情
export const goodsCreate = ''   // 商品创建
export const goodsSave = ''   // 商品保存

// 数据统计
export const trackList = ''   // 数据统计
export const trackPeopleList = ''   // 人数
export const trackTimesList = ''   // 次数
export const trackChart = ''   // 图标