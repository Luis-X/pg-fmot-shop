import Taro from '@tarojs/taro';
import CONFIG from '../api/config';

export default {
  get,
  post
};

// GET
function get(url, data) {	
  return baseRequest(url, data, 'GET')
}

// POST
function post(url, data) {
  return baseRequest(url, data, 'POST')
}

function baseRequest(url, data, method) {
  
  const realUrl = checkHostUrl(url);

  // 所有接口带上token ！！！
  // 所有接口带上activityId和pointAccountId !!!
  const tokenInfo = Taro.UTIL.getPGStorage('token_info') || {}
  let token = tokenInfo.token || ''
  
  if (!token) {
    // sso绑定所需的token
    const tokenSSO = Taro.UTIL.getPGLocalStorage('token_sso') || {}
    token = tokenSSO.token || ''
  }

  const actId = data.activityId || ''
  const accId = data.pointAccountId || ''

  console.debug(`actId: ${actId}`)
  console.debug(`accId: ${accId}`)
  console.debug(`接口: ${url} 入参：`)
  console.debug(data)


  return new Promise(function (resolve, reject) {
    
    Taro.request({
      url: realUrl,
      data: data,
      method: method,
      header: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Pragma': 'no-cache',
        'timestamp': new Date().getTime(),
        'authorization': token
      },
      success: (res) => {        
        if (res.statusCode === 200) {
          const respData = res.data || {}

          console.debug(`接口: ${url} 响应：`)
          console.debug(respData)

          if (respData.code === -2) {
            needLoginWithActId(actId)
            // resolve({})
          } else if (respData.code === -20004)  {
            // SSO账号不存在
            // Taro.HUD.showToastMessage(respData.message)
            resolve(respData)
          } else if (respData.code === -20005)  {
            // 该积分账号已绑定
            // Taro.HUD.showToastMessage(respData.message)
            resolve(respData)
          } else if (respData.code === -20006)  {
            // 用户账号状态异常
            console.log("用户账号状态异常");
            Taro.ROUTER.redirectTo(`/pages/disable/index?act=${actId}&status=2`);
          } else if (respData.code === -20007)  {
            // 当前不在活动时间
            console.log("当前不在活动时间");
            Taro.ROUTER.redirectTo(`/pages/disable/index?act=${actId}&status=1`);
          } else {
            resolve(respData)
          }
        } else {
          const respData = res.data || {}
          resolve(respData)
        }
      },
      fail: (err) => {
        resolve({})
        reject(err)
        console.error('request', `异常：${JSON.stringify(err)}`)
      }
    })
  })
}

// 登录失效、过期
function needLoginWithActId(act) {
  Taro.showToast({
    title: '登录过期，重新登录',
    icon: 'none',
    duration: 2000
  })
  const timeout = setTimeout(() => {
    Taro.UTIL.goToACLAuthPage({
      actId: act
    })
    clearTimeout(timeout)
  }, 2000)
}

// 校验路径
function checkHostUrl(url) {
  if (url.startsWith('http')) {
    return url
  }
  return `${CONFIG.host}${url}`
}
