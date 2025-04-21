import Taro from '@tarojs/taro';
import CONFIG from '../api/config';

export default {
  get,
  post,
  uploadFile
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

  // 所有接口带上token！！！
  // 所有接口带上activityId和pointAccountId，如果参数中包含则忽略，否则从本地缓存中获取！！！
  const loginInfo = Taro.UTIL.getPGStorage('login_info') || {}
  let token = loginInfo.token || ''

  // const activityInfo = Taro.UTIL.getPGStorage('activity_info') || {}
  // let activityId = activityInfo.activityId || ''
  // let pointAccountId = activityInfo.pointAccountId || ''

  let newData = {...data}
  // if (!newData.activityId) {
  //   newData.activityId = activityId
  // }
  // if (!newData.pointAccountId) {
  //   newData.pointAccountId = pointAccountId
  // }

  console.debug(`接口: ${url} 入参：`)
  console.debug(newData)

  return new Promise(function (resolve, reject) {

    Taro.request({
      url: realUrl,
      data: newData,
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

          // console.debug(`接口: ${url} 响应：`)
          // console.debug(respData)

          if (respData.code === -2) {
            loginWithSSOUrl('登录过期，重新登录')
            // resolve({})
          } else if (respData.code === -20005) {
            loginWithSSOUrl(respData.message || '')
            // resolve({})
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

// 不指定 content-type，否则会缺少 boundary
function uploadFile(formData) {
  return new Promise(function (resolve, reject) {
    Taro.request({
      url: `${CONFIG.fileUrl}/v2/files`,
      data: formData,
      method: 'POST',
      header: {
        'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'multipart/form-data',
        'X-Content-Type-Options': 'nosniff',
      },
      success: (res) => {        
        console.log(res)
        if (res.statusCode === 200) {
          const respData = res.data || {}

          // console.debug(`上传响应：`)
          // console.debug(respData)

          resolve(respData)
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
function loginWithSSOUrl(message) {
  Taro.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
  const timeout = setTimeout(() => {
    // locationReplace()
    Taro.UTIL.goToAclUrlPage()
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
