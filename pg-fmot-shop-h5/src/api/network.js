import wx from 'weixin-js-sdk';

import Taro from '@tarojs/taro';
import REQUEST from '../utils/request';
import CONFIG from '../api/config';


export default {
  aclUrl,
  login,

  accountsConflictAvoidance,
  modifyAccountsTerms,
  sendSmsCaptcha,
  getGraphCaptcha,

  registerByMobile,
  registerUserInfo,
  updateUserInfo,
  userInfo,
  userInfoDetail,
  getUserEmail,

  getJobCategoryConfig,

  articleList,
  articleDetail,
  articleListOfMyFavorite,
  articleAddFavorite,
  articleDelFavorite,
  articleDownloadByEmail,

  activityList,
  activityDetail,
  activityListOfMyBook,
  activityAddBook,
  activityDelBook,
  
  myReportList,
  myReportDetail,
  myReportSubmit,

  myDemandSubmit,

  uploadFileSign,
  uploadFileSignPublic,
  uploadFileGetFileUrl,
  uploadFile,

  wxSignShare,
  wxConfigShareData,
};

// acl 授权 [ok]
function aclUrl (params) {
  return REQUEST.post('/aclUrl', params)
}

// code 登录 [ok]
function login (params) {
  return REQUEST.post('/codeToToken', params)
}

// AM 解决冲突 [ok]
function accountsConflictAvoidance (params) {
  return REQUEST.get('/api/user/accountsConflictAvoidance', params)
}
// AM 更新隐私条款 [ok]
function modifyAccountsTerms (params) {
  return REQUEST.get('/api/user/modifyAccountsTerms', params)
}
// AM 获取验证码 [ok]
function sendSmsCaptcha (params) {
  return REQUEST.post('/api/user/sendSmsCaptcha', params)
}
// AM 获取图形验证码 [ok]
function getGraphCaptcha (params) {
  return REQUEST.post('/api/user/getGraphCaptcha', params)
}


// 用户 手机号注册 [ok]
function registerByMobile (params) {
  return REQUEST.post('/api/user/registerByMobile', params)
}
// 用户 注册信息 [ok]
function registerUserInfo (params) {
  return REQUEST.post('/api/user/registerUserInfo', params)
}
// 用户 信息更新 [ok]
function updateUserInfo (params) {
  return REQUEST.post('/api/user/updateUserInfo', params)
}
// 用户 信息 [ok]
function userInfo () {
  return REQUEST.get('/api/user/userInfo', {})
}
// 用户 信息详细 [ok]
function userInfoDetail () {
  return REQUEST.get('/api/user/userInfoDetail', {})
}
// 用户 邮箱 [ok]
function getUserEmail () {
  return REQUEST.get('/api/user/getUserEmail', {})
}


// 职业类型 [ok]
function getJobCategoryConfig () {
  return REQUEST.get('/api/systemConfig/getJobCategoryConfig', {})
}


// 文章 列表 [ok]
function articleList (params) {
  return REQUEST.post('/api/article/listForH5', params)
}
// 文章 详情 [ok]
function articleDetail (params) {
  return REQUEST.post('/api/article/detailForH5', params)
}
// 文章 我的收藏 [ok]
function articleListOfMyFavorite (params) {
  return REQUEST.post('/api/article/listMyForH5', params)
}
// 文章 添加收藏 [ok]
function articleAddFavorite (params) {
  return REQUEST.post('/api/article/addFavoriteArticleForH5', params)
}
// 文章 取消收藏 [ok]
function articleDelFavorite (params) {
  return REQUEST.post('/api/article/cancelFavoriteArticleForH5', params)
}
// 文章 附件下载 [ok]
function articleDownloadByEmail (params) {
  return REQUEST.post('/api/article/sendDownloadLinkEmailForH5', params)
}


// 活动 列表 [ok]
function activityList (params) {
  return REQUEST.post('/api/activity/listForH5', params)
}
// 活动 详情 [ok]
function activityDetail (params) {
  return REQUEST.post('/api/activity/detailForH5', params)
}
// 活动 我的预约 [ok]
function activityListOfMyBook (params) {
  return REQUEST.post('/api/activity/listMyForH5', params)
}
// 活动 添加预约 [ok]
function activityAddBook (params) {
  return REQUEST.post('/api/activity/reservationForH5', params)
}
// 活动 取消预约 [ok]
function activityDelBook (params) {
  return REQUEST.post('/api/activity/cancelReservationForH5', params)
}


// 报道 我的报道 [ok]
function myReportList () {
  return REQUEST.get('/api/userReport/listMyForH5', {})
}
// 报道 详情 [ok]
function myReportDetail (params) {
  return REQUEST.post('/api/userReport/detailForH5', params)
}
// 报道 提交报道 [ok]
function myReportSubmit (params) {
  return REQUEST.post('/api/userReport/create', params)
}


// 需求 提交需求 [ok]
function myDemandSubmit (params) {
  return REQUEST.post('/api/userRequirement/create', params)
}

// 文件上传 签名私有 [ok]
function uploadFileSign () {
  return REQUEST.get('/api/uploadFile/signature', {})
}
// 文件上传 签名公有 [ok]
function uploadFileSignPublic () {
  return REQUEST.get('/api/uploadFile/signaturePublic', {})
}
// 文件上传 私有转url [ok]
function uploadFileGetFileUrl (params) {
  return REQUEST.post('/api/uploadFile/signature/getFileUrl', params)
}
// 文件上传 [ok] 
function uploadFile (tempFiles, signData) {
  // console.log('tempFiles', tempFiles)
  const type = tempFiles.name.split('.').pop()
  const fileName = tempFiles.name || `newsFile.${type}`
  const formData = new FormData()
  // formData.append('file', tempFiles, 'newsFile.' + type)  
  formData.append('file', tempFiles, fileName)  
  formData.append('subscriptionKey', signData.subscriptionKey)
  formData.append('public', signData.public)
  formData.append('signature', signData.signature)
  formData.append('timestamp', signData.timestamp)
  formData.append('userId', signData.userId)
  return REQUEST.uploadFile(formData)
}


// 微信签名 [ok]
function wxSignShare (params) {
  return REQUEST.post('/api/wxJsSdk/getSharingSign', params)
}
// 微信js-sdk [ok]
async function wxConfigShareData (shareData, senceType) {
  console.log(`wx-share-----${JSON.stringify(shareData)}`)

  const params = {
    url: window.location.href.split('#')[0]
  }
  const res = await Taro.NETWORK.wxSignShare(params) 

  if (res.code === 0) {
    const data = res.data || {}
    const appId = data.appid
    const timestamp = data.timestamp
    const nonceStr = data.nonceStr
    const signature = data.signature
    const jsApiList = [
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'hideMenuItems',
      'hideOptionMenu',
      'showOptionMenu',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
    ]

    // FIXME: wx share debug
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名
      jsApiList: jsApiList // 必填，需要使用的JS接口列表
    })

    wx.ready(function () {
      // wx.updateAppMessageShareData({
      //   title: shareData.title || '',
      //   desc: shareData.desc || '',
      //   link: shareData.link,
      //   imgUrl: shareData.imgUrl || '',
      //   success: function () {
      //     // 设置成功
      //     console.log('share - 好友')
      //   }
      // })
      //
      // wx.updateTimelineShareData({
      //   title: shareData.title || '',
      //   desc: shareData.desc || '',
      //   link: shareData.link,
      //   imgUrl: shareData.imgUrl || '',
      //   success: function () {
      //     // 设置成功
      //     console.log('share - 朋友圈')
      //   }
      // })

      wx.onMenuShareAppMessage({
        title: shareData.title || '',
        desc: shareData.desc || '',
        link: shareData.link,
        imgUrl: shareData.imgUrl || '',
        success: function () {
          // 用户点击了分享后执行的回调函数 (即将废弃)
          console.log('share - - 好友')   
          shareTracker(shareData, senceType, 'message')      
        }
      })

      wx.onMenuShareTimeline({
        title: shareData.title || '',
        desc: shareData.desc || '',
        link: shareData.link,
        imgUrl: shareData.imgUrl || '',
        success: function () {
          // 用户点击了分享后执行的回调函数 (即将废弃)
          console.log('share - - 朋友圈')
          shareTracker(shareData, senceType, 'timeline')
        }
      })
      
      wx.hideMenuItems({
        menuList: [
          'menuItem:copyUrl',
          'menuItem:originPage',
          'menuItem:share:email'
        ]
      })
      /*
      wx.showMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
      })
      */
    })
  } else {
    console.log('wxconfig data error')
  }
}

function shareTracker(shareData, senceType) {
  if (senceType === 'detail') {
    // 文章详情
    Taro.TRACKER.eventTracker('Page_Forward', '转发页面', 'PageForward', {
      report_name: shareData.title || '',
      work_type: Taro.TRACKER.userWorkType()
    })
  } else {
    // 页面分享
    // Taro.TRACKER.eventTracker('MP_Share', '小程序分享', 'MP_Share', {})
  }
}