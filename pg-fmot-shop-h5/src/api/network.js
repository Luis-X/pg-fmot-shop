import wx from 'weixin-js-sdk';

import Taro from '@tarojs/taro';
import REQUEST from '../utils/request';
import CONFIG from '../api/config';


export default {
  aclUrl,

  login,
  agreeAgreement,

  bindOpenId,
  bindActivityId,

  activityList,
  searchList,

  goodsDetail,
  goodsAddCart,

  orderActivityInfo,
  orderConfirmInfo,
  orderConfirm,

  orderDetailInfo,
  orderCancel,

  mineOrderList,
  mineExchangeList,

  cartList,
  cartChange,

  serviceInfo,

  trackerSubmit,

  wxSignShare,
  wxConfigShareData,
};

// acl 授权 [ok]
function aclUrl (params) {
  return REQUEST.post('/aclUrl', params)
}

// code 登录
function login (params) {
  // return REQUEST.post('/user/login', params)
  const res = {
    code: 0,
    data: {
      // token
      token: '1234567890',
      // 是否在活动时间内
      isActivityTime: true,
      // 活动类型 1: 内部活动 2: 外部活动
      activityType: 2,
      // 是否绑定OpenId
      isBindOpenId: false,
      // 账号是否正常
      isAvailableUser: true,
      // 是否同意协议
      agreement: false,
      // 邮箱是否白名单且未绑定过 (内部)
      isAvailableEmail: true,
      // 是否绑定openId为内部用户
      isInternalUser: false,
      // 是否绑定活动为外部用户
      isExternalUser: false,
    },
    // data: {
    //   "token": "string",
    //   "pointAccountId": "string",
    //   "agreement": true,
    //   "informedConsentForm": "string"
    // },
    message: '登录失败'
  }
  return clientMockData(res, params);
}

// 同意协议 [ok]
function agreeAgreement (params) {
  // return REQUEST.post('/api/user/userAgreement', params)
  const res = {
    code: 0,
    data: {},
    message: '同意失败'
  }
  return clientMockData(res, params);
}

// 邮箱绑定OpenId
function bindOpenId (params) {
  const res = {
    code: 0,
    data: {},
    message: '绑定失败'
  }
  return clientMockData(res, params);
}

// 账号绑定
function bindActivityId (params) {
  // return REQUEST.post('/api/user/bindPointAccount', params)
  const res = {
    code: 0,
    data: {},
    message: '账号不正确'
  }
  return clientMockData(res, params);
}

// 活动列表 [ok]
function activityList (params) {
  // return REQUEST.get('/api/activity/detailForH5', params)
  const res = {
    "code": 0,
    "message": "string",
    "data": {
      "id": "string",
      "activityCarouselImages": [
        {
          "imageUrl": "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
          "url": "https://www.baidu.com"
        },
      ],
      "maxQuantity": 0,
      "activityProducts": [
        {
          "id": "1",
          "product": {
            "id": "2",
            "previewUrl": "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
            "name": "洋甘菊无硅油天然洋甘菊无硅油天然",
            "price": 388.0,
            "label": "自营,厂商配送"
          },
          "discountPrice": 368
        },
        {
          "id": "1",
          "product": {
            "id": "2",
            "previewUrl": "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
            "name": "洋甘菊无硅油天然洋甘菊无硅油天然",
            "price": 388.0,
            "label": "自营,厂商配送"
          },
          "discountPrice": 368
        }
      ]
    }
  }
  return clientMockData(res, params);
}

// 搜索列表
function searchList (params) {
  const res = {
    code: 0,
    data: {
      list: [
        {
          src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          title:
            "洋甘菊无硅油天然洋甘菊无硅油天然",
          price: "388.0",
          vipPrice: "378",
          shopDescription: "自营",
          delivery: "厂商配送",
        },
        {
          src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          title:
            "洋甘菊无硅油天然洋甘菊无硅油天然",
          price: "388.0",
          vipPrice: "378",
          shopDescription: "自营",
          delivery: "厂商配送",
        },
        {
          src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          title:
            "洋甘菊无硅油天然洋甘菊无硅油天然",
          price: "388.0",
          vipPrice: "378",
          shopDescription: "自营",
          delivery: "厂商配送",
        },
        {
          src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          title:
            "洋甘菊无硅油天然洋甘菊无硅油天然",
          price: "388.0",
          vipPrice: "378",
          shopDescription: "自营",
          delivery: "厂商配送",
        },
        {
          src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          title:
            "洋甘菊无硅油天然洋甘菊无硅油天然",
          price: "388.0",
          vipPrice: "378",
          shopDescription: "自营",
          delivery: "厂商配送",
        },
        {
          src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          title:
            "洋甘菊无硅油天然洋甘菊无硅油天然",
          price: "388.0",
          vipPrice: "378",
          shopDescription: "自营",
          delivery: "厂商配送",
        }
      ],
      totalPages: 2,
    }
  }
  return clientMockData(res, params);
}

// 商品详情 [ok]
function goodsDetail (params) {
  // return REQUEST.post('/api/activity/activityProductForH5', params)
  const res = {
    "code": 0,
    "message": "string",
    "data": {
      "id": "1",
      "product": {
        "productCarouselImages": [
          {
            "videoUrl": "https://storage.360buyimg.com/nutui/video/video_NutUI.mp4",
            "videoImgUrl": "",
          },
          {
            "imgUrl": "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
          },
          {
            "imgUrl": "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
          }
        ],
        "price": 388,
        "name": "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
        "label": "自营,厂商配送,阳澄湖大闸蟹自营店",
        "productVideo": "https://storage.360buyimg.com/nutui/video/video_NutUI.mp4",
        "longImageUrl": "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg"
      },
      "discountPrice": 368,
      "activity": {
        "contactCustomerServiceInfo": "string"
      },
      "shopCartProductCount": 1
    }
  }
  return clientMockData(res, params);
}
// 加入购物车 [ok]
function goodsAddCart (params) {
  // return REQUEST.post('/api/shopCart/changeShopCartProduct', params)
  const res = {
    code: 0,
    data: {},
    message: '加入购物车失败'
  }
  return clientMockData(res, params);
}

// 订单活动信息 [ok]
function orderActivityInfo (params) {
  // return REQUEST.post('/api/activity/activityForOrderForH5', params) 
  const res = {
    "code": 0,
    "message": "string",
    "data": {
      "deliveryType": "SELF_PICKUP",
      "collectionInstructions": "文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本"
    }
  }
  return clientMockData(res, params);
}
// 订单确认信息
// FIXME: 前一页面携带参数过来，这里需要做处理
function orderConfirmInfo (params) {
  const res = {
    code: 0,
    data: {
      goodsList: [
        {
          "activityProductId": "2",
          "previewUrl": "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          "name": "活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
          "price": 388,
          "discountPrice": 368,
          "quantity": 1,
          "maxQuantity": 10
        }
      ],
    },
    message: '订单确认失败'
  }
  return clientMockData(res, params);
}
// 订单确认 [ok]
function orderConfirm (params) {
  // return REQUEST.post('/api/shopCart/createOrder', params)
  const res = {
    code: 0,
    data: {},
    message: '兑换失败，不能超过活动商品最大订购量'
  }
  return clientMockData(res, params);
}

// 订单详情 [ok]
function orderDetailInfo (params) {
  // return REQUEST.post('/api/shopCart/getOrderDetail', params)
  const res = {
    "code": 0,
    "message": "string",
    "data": {
      "activity": {
        "collectionInstructions": "文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本"
      },
      "order": {
        "orderCode": "20220101xxxxx",
        "createDate": "2025-04-15T06:03:25.283Z",
        "orderStatus": "COMPLETED",
        "totalCount": 1,
        "totalAmount": 388,
        "orderItems": [
          {
            "previewUrl": "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
            "name": "活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
            "price": 388,
            "quantity": 1
          }
        ]
      }
    }
  }
  return clientMockData(res, params);
}
// 取消订单 [ok]
function orderCancel (params) {
  // return REQUEST.post('/api/shopCart/cancelOrder', params)
  const res = {
    code: 1,
    data: {},
    message: '取消订单失败'
  }
  return clientMockData(res, params);
}

// 我的订单 [ok]
function mineOrderList (params) {
  // return REQUEST.post('/api/shopCart/getMyInfo', params)
  const res = {
    code: 0,
    data: {
      "availablePoint": 0,
      "orders": [
        {
          "id": "20220101",
          "orderCode": "20220101xxxxx",
          "createDate": "2025-04-15T05:46:25.513Z",
          "orderStatus": "COMPLETED",
          "totalCount": 1,
          "totalAmount": 388,
          "orderItems": [
            {
              "previewUrl": "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
              "name": "活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
              "price": 388,
              "quantity": 1
            }
          ]
        }
      ]
    }
  }
  return clientMockData(res, params);
}
// 我的兑换 [ok]
function mineExchangeList (params) {
  // return REQUEST.get('/api/activity/getMyForH5', params)
  const res = {
    "code": 0,
    "message": "string",
    "data": [
      {
        "name": "测试活动1",
        "beginDate": "2025-04-15T06:24:50.387Z",
        "endDate": "2025-04-15T06:24:50.387Z",
        "activityId": "string",
        "pointAccountId": "string"
      }
    ]
  }
  return clientMockData(res, params);
}

// 购物车 [ok]
function cartList (params) {
  // return REQUEST.post('/api/shopCart/getMy', params)
  const res = {
    code: 0,
    data: {
      list: [
        {
          "activityProductId": "2",
          "previewUrl": "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
          "name": "活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
          "price": 388,
          "discountPrice": 368,
          "quantity": 1
        }
      ]
    }
  }
  return clientMockData(res, params);
}
// 加入、删除、修改购物车 [ok]
function cartChange (params) {
  // return REQUEST.post('/api/shopCart/changeShopCartProduct', params)
  const res = {
    code: 0,
    data: {},
    message: '加入购物车失败'
  }
  return clientMockData(res, params);
}

// 联系客服
function serviceInfo (params) {
  const res = {
    code: 0,
    data: {
      phone: '联系电话：13188998899',
      address: '联系地址：辽宁省大连市高新园区万达广场一单元1901',
    },
    message: '联系客服失败'
  }
  return clientMockData(res, params);
}

// 埋点上报 [ok]
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
  }, 1000);
})