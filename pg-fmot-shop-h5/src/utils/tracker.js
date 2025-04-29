import Taro from '@tarojs/taro';

export default {
  eventTracker,
};

async function eventTracker(userActionType, query, callback) {
  
  const activityId = query.activityId || ''
  const pointAccountId = query.pointAccountId || ''
  const finished = query.finished || false          // 开始不传，结束传 true
  const id = query.id || ''                         // 埋点id  
  const productId = query.productId || ''           // 商品id
  const orderId = query.orderId || ''               // 订单id

  if (!activityId) {
    console.log('缺少 activityId')
    return
  }

  if (!pointAccountId) {
    console.log('缺少 pointAccountId')
    return
  }

  let params = {
    activityId: activityId,
    pointAccountId: pointAccountId,    
    userActionType: userActionType,                                                            
  }

  if (finished) {
    params.finished = finished    
  }

  if (id) {
    params.id = id
  }

  if (productId) {  
    params.productId = productId
  }

  if (orderId) {
    params.orderId = orderId
  } 

  console.log(`eventTracker ${userActionType}`, params)

  const res = await Taro.NETWORK.trackerSubmit(params)
  if (res.code === 0) {
    const resData = res.data || {} 
    const eventId = resData.id || ''
    // console.log(`eventTracker ${userActionType} success`)
    if (callback) {
      callback(eventId)
    }
  } else {
    // console.log(`eventTracker ${userActionType} error`, res.message)
    if (callback) {
      callback('')
    }
  }
}