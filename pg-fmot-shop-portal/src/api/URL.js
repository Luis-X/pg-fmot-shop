// 上传文件
export const uploadFile = window.location.origin === 'https://ministore.shenghuojia.com' ? 'https://storage.pg.com.cn/v2/files' : 'https://storage-qa.pg.com.cn/v2/files';
export const uploadFileGetUrl = '/api/uploadFile/signature/getFileUrl'                    // 根据fileId获取url ok
export const uploadFileSign = '/api/uploadFile/signature'                                 // 私有文件上传签名 ok
export const uploadFileSignPublic = '/api/uploadFile/signaturePublic'                     // 公共文件上传签名 ok
  export const uploadFileSignChunk = '/api/uploadFile/signatureUploadChunkFile'             // 分片上传签名
  export const uploadFileChunkCheck = '/api/uploadFile/signatureCheckChunk'                 // 检查分片签名
  export const uploadFileChunkMerge = '/api/uploadFile/signatureMergeChunkFile'             // 合并分片签名

      
// 登录、登出
export const ssoLogin = '/admin/ssoLogin'                                                                                 // SSO登陆
  export const logout = ''                                                                                                // 退出系统


// 通用
export const orgCodeList = '/api/admin/activity/getAllInstitution'                                                        //机构代码


// 异步任务
export const asyncTaskDetail = '/api/admin/asyncTask/detail'                                                              // 异步任务详情


// 内部账户
export const internalAccountList = '/api/admin/pointAccount/selectForAdmin'                                               // 内部账号列表
export const internalAccountChangeStatus = '/api/admin/pointAccount/changeStatus'                                         // 内部账号状态变更
export const internalAccountImport = '/api/admin/pointAccount/pointAccountImport'                                         // 内部账号导入
export const internalAccountImportTemplate = '/api/admin/downloadTemplate?templateName=employee_template'                 // 内部账号导入模版
export const internalAccountImportPoints = '/api/admin/pointAccount/pointAccountImport'                                   // 内部账号积分导入
export const internalAccountImportTemplatePoints = '/api/admin/downloadTemplate?templateName=employee_point_template'     // 内部账号积分导入模版


// 外部账号
export const externalAccountList = '/api/admin/pointAccount/selectForAdmin'                                                // 外部账号列表
export const externalAccountChangeStatus = '/api/admin/pointAccount/changeStatus'                                          // 外部账号状态变更
export const externalAccountImport = '/api/admin/pointAccount/pointAccountImport'                                          // 外部账号导入
export const externalAccountImportTemplate = '/api/admin/downloadTemplate?templateName=customer_template'                  // 外部账号导入模版
export const externalAccountImportPoints = '/api/admin/pointAccount/pointAccountImport'                                    // 外部账号积分导入
export const externalAccountImportTemplatePoints = '/api/admin/downloadTemplate?templateName=customer_point_template'      // 外部账号积分导入模版


// 活动
export const eventList = '/api/admin/activity/selectForAdmin'                                                      // 活动列表
export const eventCopy = '/api/admin/activity/addActivityForAdmin'                                                 // 活动复制
export const eventDetail = '/api/admin/activity/detailForAdmin'                                                    // 活动详情
export const eventCreate = '/api/admin/activity/addActivityForAdmin'                                               // 活动创建
export const eventSave = '/api/admin/activity/editForAdmin'                                                        // 活动保存
// export const eventGoodsEdit = '/api/admin/activity/addOrUpdateActivityProduct'                                     // 活动商品新增、更新
// export const eventGoodsDelete = '/api/admin/activity/deleteActivityProduct'                                        // 活动商品删除


// 订单
  export const orderList = '/api/admin/order/selectForAdmin'                                                         // 订单列表
  export const orderListExport = '/api/admin/order/exportForAdmin'                                                   // 订单列表导出


// 商品
export const goodsSearchList = '/api/admin/product/selectForAdmin'                                                 // 商品搜索
export const goodsList = '/api/admin/product/selectForAdmin'                                                       // 商品列表
export const goodsCategoryList = '/api/admin/product/getAllProductCategory'                                        // 商品类别  
export const goodsDetail = '/api/admin/product/detailForAdmin'                                                     // 商品详情
export const goodsCreate = '/api/admin/product/addProductForAdmin'                                                 // 商品创建
export const goodsSave = '/api/admin/product/editForAdmin'                                                         // 商品保存


// 数据统计
  export const trackList = '/api/admin/userActionLog/activitySelect'                                                 // 数据统计
  export const trackExport = '/api/admin/userActionLog/exportForAdmin'                                               // 导出数据
  export const trackPeopleList = '/api/admin/userActionLog/productSelect'                                            // 人数
  export const trackTimesList = '/api/admin/userActionLog/productSelect'                                             // 次数
  export const trackChart = '/api/admin/userActionLog/productVideoViewSelect'                                        // 图表