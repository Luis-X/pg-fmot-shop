import Taro from '@tarojs/taro';

export default {
  eventTracker,
};

async function eventTracker(userActionType, query, callback) {
  
  const activityId = query.activityId || ''
  const pointAccountId = query.pointAccountId || ''

  if (!activityId) {
    console.log('缺少 activityId')
    return
  }

  if (!pointAccountId) {
    console.log('缺少 pointAccountId')
    return
  }

  let params = {
    userActionType,
    ...query,
  }

  // console.log(`eventTracker ${userActionType}`, params)

  // 埋点上报，增加重试机制，防止上报失败
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const res = await Taro.NETWORK.trackerSubmit(params);
      if (res.code === 0) {
        // 成功退出循环，返回eventId
        const resData = res.data || {};
        const eventId = resData.id || '';
        // console.log(`eventTracker ${userActionType} success`);
        if (callback) {
          callback(eventId);
        }
        break;
      } else {
        console.error(`eventTracker ${userActionType} error ${retries + 1}:`, res.message);
      }
    } catch (error) {
      console.error(`eventTracker ${userActionType} network error ${retries + 1}:`, error);
    }

    retries++;
    if (retries < MAX_RETRIES) {
      // 等待1秒后重试
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    }
  }

  if (retries >= MAX_RETRIES && callback) {
    // 达到最大重试次数，调用回调函数并传递空字符串作为eventId
    callback(''); 
  }
}