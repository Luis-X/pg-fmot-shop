// 上传文件
export const uploadFile = window.location.origin === 'https://ministore.shenghuojia.com' ? 'https://storage.pg.com.cn/v1/files' : 'https://storage-qa.pg.com.cn/v1/files';
export const uploadFileSign = ''   // 获取上传文件签名
    
// 登录、登出
export const ssoLogin = '/admin/ssoLogin'                                                                          // SSO登陆 [ok]
export const logout = '/api/admin/logout'                                                                          // 退出系统

// 通用
export const orgCodeList = '/api/admin/activity/getAllInstitution'                                                 //机构代码

// 内部账户
export const internalAccountList = '/api/admin/pointAccount/selectForAdmin'                                        // 内部账号列表 [ok]
export const internalAccountChangeStatus = '/api/admin/pointAccount/changeStatus'                                  // 内部账号状态变更 [ok]
export const internalAccountImport = '/api/admin/pointAccount/pointAccountImport'                                  // 内部账号导入
export const internalAccountImportTemplate = '/api/admin/downloadTemplate?templateName=内部账号导入模版'              // 内部账号导入模版
export const internalAccountImportPoints = '/api/admin/pointAccount/pointAccountImport'                            // 内部账号积分导入
export const internalAccountImportTemplatePoints = '/api/admin/downloadTemplate?templateName=内部账号积分充值模版'    // 内部账号积分导入模版

// 外部账号
export const externalAccountList = '/api/admin/pointAccount/selectForAdmin'                                        // 外部账号列表 [ok]
export const externalAccountChangeStatus = '/api/admin/pointAccount/changeStatus'                                  // 外部账号状态变更 [ok]
export const externalAccountImport = '/api/admin/pointAccount/pointAccountImport'                                  // 外部账号导入
export const externalAccountImportTemplate = '/api/admin/downloadTemplate?templateName=外部账号导入模版'              // 外部账号导入模版
export const externalAccountImportPoints = '/api/admin/pointAccount/pointAccountImport'                            // 外部账号积分导入
export const externalAccountImportTemplatePoints = '/api/admin/downloadTemplate?templateName=外部账号积分充值模版'    // 外部账号积分导入模版

// 活动
export const eventList = '/api/admin/activity/selectForAdmin'                                                      // 活动列表
export const eventCopy = ''                                                                                        // 活动复制
export const eventDetail = ''                                                                                      // 活动详情
export const eventCreate = ''                                                                                      // 活动创建
export const eventSave = ''                                                                                        // 活动保存

// 订单
export const orderList = ''                                                                                        // 订单列表
export const orderListExport = ''                                                                                  // 订单列表导出

// 商品
export const goodsSearchList = ''                                                                                  // 商品搜索
export const goodsList = ''                                                                                        // 商品列表
export const goodsCategoryList = ''                                                                                // 商品类别
export const goodsDetail = ''                                                                                      // 活动详情
export const goodsCreate = ''                                                                                      // 商品创建
export const goodsSave = ''                                                                                        // 商品保存

// 数据统计
export const trackList = ''                                                                                        // 数据统计
export const trackPeopleList = ''                                                                                  // 人数
export const trackTimesList = ''                                                                                   // 次数
export const trackChart = ''                                                                                       // 图标