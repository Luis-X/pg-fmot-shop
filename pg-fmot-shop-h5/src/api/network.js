import wx from 'weixin-js-sdk';

import Taro from '@tarojs/taro';
import REQUEST from '../utils/request';
import CONFIG from '../api/config';


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

  wxSignShare,
  wxConfigShareData,
};

// code 登录 [ok]
function login (params) {
  return REQUEST.post('/user/login', params)
}

// 账号绑定 [ok]
function bindActivityId (params) {
  return REQUEST.post('/api/user/bindPointAccount', params)
  // const res = {
  //   "code": 0,
  //   "message": "成功",
  //   "data": {
  //       "pointAccountId": "cb1ed71576134705b21033ee2bddd4ab",
  //       "agreement": false,
  //       "informedConsentForm": "1"
  //   }
  // }
  // return clientMockData(res, params);
}
// 同意协议 [ok]
function agreeAgreement (params) {
  return REQUEST.post('/api/user/userAgreement', params)
  // const res = {
  //   "code":0,
  //   "message":"成功",
  //   "data":null
  // }
  // return clientMockData(res, params);
}
// 活动列表 [ok]
function activityList (params) {
  return REQUEST.post('/api/activity/detailForH5', params)
  // const res = {
  //   "code": 0,
  //   "message": "成功",
  //   "data": {
  //       "id": "a725a5da3bf74e669918107fd711a8af",
  //       "activityCarouselImages": [
  //           {
  //               "imageUrl": "https://storage-qa.pg.com.cn/v2/files/f8da6472bc734ff4a7995dac5839b8f0",
  //               "url": "https://www.google.com"
  //           }
  //       ],
  //       "maxQuantity": 1,
  //       "activityProducts": [
  //           {
  //               "id": "67f31e3b29ec4921bccbc577bdb840e1",
  //               "product": {
  //                   "id": "ba62ef8fa6614d1686d1daac85d96331",
  //                   "previewUrl": "https://storage-qa.pg.com.cn/v2/files/02d54b1e72244210a59c5c26b29f6bb8",
  //                   "name": "潘婷深水泡弹洗发水洗发露玫瑰香氛强韧防断型530g男女通用第三代",
  //                   "price": 79.80,
  //                   "label": "自营,京东超市,官方正品"
  //               },
  //               "discountPrice": null
  //           }
  //       ]
  //   }
  // }
  // return clientMockData(res, params);
}
// 搜索列表 (活动的下挂商品不会很多,前端筛选后端不提供商品查询接口) [ok]
function searchList (params) {
  return REQUEST.post('/api/activity/detailForH5', params)
}
// 商品详情 [ok]
function goodsDetail (params) {
  return REQUEST.post('/api/activity/activityProductForH5', params)
  // const res = {
  //   "code": 0,
  //   "message": "成功",
  //   "data": {
  //       "id": "de123cb0106343cf9dbdb6a3540817c4",
  //       "product": {
  //           "productCarouselImages": [
  //               {
  //                   "videoUrl": "https://storage-qa.pg.com.cn/v2/files/79cabeed99224a2cb961c84e08162890",
  //                   "videoImgUrl": "https://storage-qa.pg.com.cn/v2/files/17fe0218cf864f799ece0fa958b0681a",
  //                   "imgUrl": null
  //               },
  //               {
  //                   "videoUrl": null,
  //                   "videoImgUrl": null,
  //                   "imgUrl": "https://storage-qa.pg.com.cn/v2/files/d794218a09e9427c993acbb9e35526c1"
  //               },
  //               {
  //                   "videoUrl": null,
  //                   "videoImgUrl": null,
  //                   "imgUrl": "https://storage-qa.pg.com.cn/v2/files/c54b52f095a3418297d9f18d37b490cf"
  //               },
  //               {
  //                   "videoUrl": null,
  //                   "videoImgUrl": null,
  //                   "imgUrl": "https://storage-qa.pg.com.cn/v2/files/0a1a620595744a78af9354eef8d8f99a"
  //               },
  //               {
  //                   "videoUrl": null,
  //                   "videoImgUrl": null,
  //                   "imgUrl": "https://storage-qa.pg.com.cn/v2/files/70bf0d0bf3e94f30a5b18199de807a96"
  //               },
  //               {
  //                   "videoUrl": null,
  //                   "videoImgUrl": null,
  //                   "imgUrl": "https://storage-qa.pg.com.cn/v2/files/4e6884fa592c4f5bbbb00c05c169dad3"
  //               }
  //           ],
  //           "price": 79.80,
  //           "name": "潘婷深水泡弹洗发水洗发露玫瑰香氛强韧防断型530g男女通用第三代",
  //           "label": "自营,京东超市,官方正品",
  //           "productVideo": "https://storage-qa.pg.com.cn/v2/files/b8e548bc74d0467ea08681e5900516ea",
  //           "longImageUrl": "https://storage-qa.pg.com.cn/v2/files/3b7ddc5bf6294ecfa882f263c3a413c7",
  //           "productType": "VIRTUAL_OBJECT"
  //       },
  //       "discountPrice": 1.80,
  //       "activity": {
  //           "contactCustomerServiceInfo": "联系电话：13188998899\n联系地址：辽宁省大连市高新园区万达广场一单元1901"
  //       },
  //       "shopCartProductCount": 0
  //   }
  // }
  // return clientMockData(res, params);
}
// 订单活动信息 [ok]
function orderActivityInfo (params) {
  return REQUEST.post('/api/activity/activityForOrderForH5', params) 
//   const res = {
//     "code": 0,
//     "message": "成功",
//     "data": {
//         "deliveryType": "BOTH",
//         "collectionInstructions": "3",
//         "maxQuantity": 1
//     }
// }
//   return clientMockData(res, params);
}
// 订单确认 [ok]
function orderConfirm (params) {
  return REQUEST.post('/api/shopCart/createOrder', params)
  // const res = {
  //   code: 0,
  //   data: {},
  //   message: '兑换失败，不能超过活动商品最大订购量'
  // }
  // return clientMockData(res, params);
}
// 订单详情 [ok]
function orderDetailInfo (params) {
  return REQUEST.post('/api/shopCart/getOrderDetail', params)
  // const res = {
  //   "code": 0,
  //   "message": "成功",
  //   "data": {
  //       "activity": {
  //           "collectionInstructions": "3"
  //       },
  //       "order": {
  //           "orderCode": "202504220001",
  //           "createDate": "2025-04-22T14:55:03.486+08:00",
  //           "serverDate": "2025-04-22T14:56:03.486+08:00",
  //           "orderStatus": "COMPLETED",
  //           "totalCount": 1,
  //           "totalAmount": 1.80,
  //           "orderItems": [
  //               {
  //                   "previewUrl": "https://storage-qa.pg.com.cn/v2/files/02d54b1e72244210a59c5c26b29f6bb8",
  //                   "name": "潘婷深水泡弹洗发水洗发露玫瑰香氛强韧防断型530g男女通用第三代",
  //                   "price": 2.80,
  //                   "discountPrice": "1.80",
  //                   "quantity": 1
  //               }
  //           ]
  //       }
  //   }
  // }
  // return clientMockData(res, params);
}
// 取消订单 [ok]
function orderCancel (params) {
  return REQUEST.post('/api/shopCart/cancelOrder', params)
  // const res = {
  //   code: 0,
  //   data: {},
  //   message: '取消订单失败'
  // }
  // return clientMockData(res, params);
}
// 我的订单 [ok]
function mineOrderList (params) {
  return REQUEST.post('/api/shopCart/getMyInfo', params)
  // const res = {
  //   "code": 0,
  //   "message": "成功",
  //   "data": {
  //       "availablePoint": 998.20,
  //       "orders": [
  //           {
  //               "id": "b27f7b8f428b4435a61dee8f54090dcf",
  //               "orderCode": "202504220001",
  //               "createDate": "2025-04-22T14:55:03.486+08:00",
  //               "orderStatus": "COMPLETED",
  //               "totalCount": 1,
  //               "totalAmount": 1.80,
  //               "orderItems": [
  //                   {
  //                       "previewUrl": "https://storage-qa.pg.com.cn/v2/files/02d54b1e72244210a59c5c26b29f6bb8",
  //                       "name": "潘婷深水泡弹洗发水洗发露玫瑰香氛强韧防断型530g男女通用第三代",
  //                       "price": 2.80,
  //                       "discountPrice": "1.80",
  //                       "quantity": 1
  //                   }
  //               ]
  //           }
  //       ]
  //   }
  // }
  // return clientMockData(res, params);
}
// 我的兑换 [ok]
function mineExchangeList (params) {
  return REQUEST.get('/api/activity/getMyForH5', params)
  // const res = {
  //   "code": 0,
  //   "message": "成功",
  //   "data": [
  //       {
  //           "name": "4月活动",
  //           "beginDate": "2025-04-01T00:00:00.537+08:00",
  //           "endDate": "2025-04-30T23:59:59.929+08:00",
  //           "activityId": "a725a5da3bf74e669918107fd711a8af",
  //           "pointAccountId": "cb1ed71576134705b21033ee2bddd4ab"
  //       }
  //   ]
  // }
  // return clientMockData(res, params);
}
// 购物车 [ok]
function cartList (params) {
  return REQUEST.post('/api/shopCart/getMy', params)
  // const res = {
  //   "code": 0,
  //   "message": "成功",
  //   "data": [
  //       {
  //           "activityProductId": "13d075765297498fb5fe5fbfea3cd0c3",
  //           "previewUrl": "https://storage-qa.pg.com.cn/v2/files/02d54b1e72244210a59c5c26b29f6bb8",
  //           "name": "潘婷深水泡弹洗发水洗发露玫瑰香氛强韧防断型530g男女通用第三代",
  //           "price": 79.80,
  //           "discountPrice": 1.80,
  //           "quantity": 2,
  //           "productType": "VIRTUAL_OBJECT"
  //       },
  //       {
  //         "activityProductId": "13d075765297498fb5fe5fbfea3cd0c3",
  //         "previewUrl": "https://storage-qa.pg.com.cn/v2/files/02d54b1e72244210a59c5c26b29f6bb8",
  //         "name": "潘婷深水泡弹洗发水洗发露玫瑰香氛强韧防断型530g男女通用第三代",
  //         "price": 79.80,
  //         "discountPrice": 1.80,
  //         "quantity": 2,
  //         "productType": "PHYSICAL_OBJECT"
  //     }
  //   ]
  // }
  // return clientMockData(res, params);
}
// 加入、删除、修改购物车 [ok]
function cartChange (params) {
  return REQUEST.post('/api/shopCart/changeShopCartProduct', params)
  // const res = {
  //   code: 0,
  //   data: {},
  //   message: '加入购物车失败'
  // }
  // return clientMockData(res, params);
}

// 埋点上报
function trackerSubmit (params) {
  // return REQUEST.post('/api/userActionLog/addUserActionLog', params)
  const res = {
    code: 0,
    data: {},
    message: '埋点上报失败'
  }
  return clientMockData(res, params);
}


// 微信签名
function wxSignShare (params) {
  return REQUEST.post('/api/wxJsSdk/getSharingSign', params)
}
// 微信js-sdk
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


// 模拟请求
const clientMockData = (res, param) => new Promise((resolve, reject) => {
  console.log('param', param);
  setTimeout(() => {
    resolve(res);
  }, 500);
})