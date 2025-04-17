import CryptoJS from 'crypto-js';
import Taro from '@tarojs/taro';
import DayJS from 'dayjs';
import CONFIG from '../api/config';
// import { Base64 } from 'js-base64';

export default {
  pgConfig,

  isH5,

  setPGStorage,
  getPGStorage,
  clearPGStorage,

  goToSSOUrlPage,
  checkIsLogin,

  checkUserStatus,
  
  dateFormatter,

  encodeBaseStr,
  decodeBaseStr,

  checkUserStatusGoHome,
  checkAgreementStatusShow,
  ssoLogin,

  configLabelTagList,
  showPreviewImg,
};

function pgConfig() {
  return CONFIG
}

function isH5() {
  return process.env.TARO_ENV === 'h5';
}

function setPGStorage(key, data) {
  try {
    const loginInfo = JSON.stringify(data)
    sessionStorage.setItem(key, loginInfo)
  } catch (error) {
    
  }
}

function getPGStorage(key) {
  let result = {}
  try {
    const loginInfoJson = sessionStorage.getItem(key)
    const loginInfo = JSON.parse(loginInfoJson)
    result = loginInfo || {}
  } catch (error) {
    
  }
  return result
}

function clearPGStorage(key) {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    
  }  
}

// 去授权，获取code
async function goToSSOUrlPage() { 
  // FIXME: test or debug should hide code

  clearPGStorage('login_info')
  clearPGStorage('user_info')
  
  // 后端拼接 acl
  /*
  const currentUrl = window.location.href
  const res = await Taro.NETWORK.aclUrl({
    url: currentUrl
  })
  if (res.code === 0) { 
    const result = res.data || ''
    window.location.replace(result)
  }
  */
  
  // 前端拼接 acl
  const currentUrl = window.location.href 
  const aclCallBackUrl = `${CONFIG.aclCallBack}${encodeURIComponent(currentUrl)}`
  const result = `${ CONFIG.aclUrl}${encodeURIComponent(aclCallBackUrl)}`
  window.location.replace(result)
}

function getUrlParamByName(name) {
  const url = window.location.href;
  const hashIndex = url.indexOf('#');
  let queryStringBeforeHash, queryStringAfterHash;

  if (hashIndex !== -1) {
      queryStringBeforeHash = url.substring(0, hashIndex).split('?')[1];
      queryStringAfterHash = url.substring(hashIndex + 1).split('?')[1];
  } else {
      queryStringBeforeHash = url.split('?')[1];
  }

  const queryStrings = [queryStringBeforeHash, queryStringAfterHash];
  let result;

  queryStrings.forEach(queryString => {
      if (queryString) {
          queryString.split('&').forEach(param => {
              const [key, value] = param.split('=');
              if (key === name) {
                  result = decodeURIComponent(value);
              }
          });
      }
  });

  return result;
}

// 检查登录状态
// 已登录：使用缓存 token
// 未登录：code 换取 token
async function checkIsLogin() {
  
  let isLogin = false

  const token = getPGStorage('login_info').token || ''
  const code = Taro.getCurrentInstance().router.params.code || ''
  
  if (token) {
    // 已登录
    isLogin = true
  } else {

    let wxCode = code

    // 防止 code 多个
    try {
      if (Array.isArray(wxCode)) {
        wxCode = getUrlParamByName('code')
      }
    } catch (error) {
      
    }
    
    // 防止 code 在#前面
    try {
      if (!wxCode) {
        wxCode = getUrlParamByName('code')
      }
    } catch (error) {
      
    }

    // 未登录
    if (wxCode) {
      // 有code
      const res = await Taro.NETWORK.login({
        code: wxCode
      })

      if (res.code === 0) {
        const resData = res.data || {}
        setPGStorage('login_info', resData)		
        if (resData.memberId) {
          await cacheUserDetail()	
        }        
        Taro.TRACKER.configUserTracker()
      } else {
        Taro.HUD.showToastMessage(res.message)
      }  

      isLogin = true
    } else {
      // 无code
      goToSSOUrlPage()
      isLogin = false
    }
  }

  return isLogin
}

// 用户是否注册、绑定AM
async function checkUserStatus(callback) {

  let memberId = ''
  let auditStatus = ''

  // 查询登录
  memberId = Taro.UTIL.getPGStorage('login_info').memberId || ''
  auditStatus = Taro.UTIL.getPGStorage('login_info').auditStatus || ''
  // if (memberId && (auditStatus === 'INIT' || auditStatus === 'AUDIT_PASS')) {
  if (memberId) {
    if (callback) {
      callback(true)
    }
    return
  }
  
  // 查询用户
  memberId = getPGStorage('user_info').memberId || ''
  auditStatus = getPGStorage('user_info').auditStatus || ''
  // if (memberId && (auditStatus === 'INIT' || auditStatus === 'AUDIT_PASS')) {
  if (memberId) {
    if (callback) {
      callback(true)
    }
    return
  }
  
  // 接口用户
  const res = await Taro.NETWORK.userInfo()
  if (res.code === 0) {
    const resData = res.data || {}
    setPGStorage('user_info', resData)	
    memberId = resData.memberId || ''
    auditStatus = resData.auditStatus || ''
  }
  // if (memberId && (auditStatus === 'INIT' || auditStatus === 'AUDIT_PASS')) {
  if (memberId) {
    if (callback) {
      callback(true)
    }
    return
  }
  
  // 默认
  if (callback) {
    callback(false)
  }
}

function dateFormatter(dateValue, formatValue) {
  if (!dateValue) {
    return ''
  }
  return DayJS(dateValue).format(formatValue || 'YYYY-MM-DD')
}

function encodeBaseStr(str) {
  let result = ''
  try {
    // js-base64 (废弃)
    // result = Base64.encode(str)
    
    const utf8Bytes = CryptoJS.enc.Utf8.parse(str);
    result = CryptoJS.enc.Base64.stringify(utf8Bytes);

  } catch (error) {
    console.log(error)
  } 
  console.log(result) 
  return result
}

function decodeBaseStr(str) {
  let result = ''
  try {
    // js-base64 (废弃)
    // result = Base64.decode(str)

    const words = CryptoJS.enc.Base64.parse(str);
    result = CryptoJS.enc.Utf8.stringify(words);

  } catch (error) {
    console.log(error)
  } 
  return result
}

 // 检查用户状态，跳转活动首页
 function checkUserStatusGoHome() {    
  const userData = Taro.UTIL.getPGStorage('login_info')
  const isAvailableUser = userData.isAvailableUser;
  if (isAvailableUser) {
    console.log("用户正常");
    console.log("进入首页");
    Taro.ROUTER.redirectTo("/pages/home/index");
  } else {
    console.log("用户异常");
    console.log("暂不符合活动资格");
    Taro.ROUTER.redirectTo("/pages/disable/index?status=2");
  }
}

 // 检查协议状态
 function checkAgreementStatusShow() {    
  const userData = Taro.UTIL.getPGStorage('login_info')
  const isAgreeAgreement = userData.agreement;
  if (isAgreeAgreement) {
    console.log("已同意协议");
    return false
  } else {
    console.log("未同意协议");
    return true
  }
}

// SSO登录
function ssoLogin() {
  Taro.HUD.showToastMessage("内部-sso登录");
  Taro.ROUTER.redirectTo("/pages/ssoCallBack/index?test=1");
}

// 配置标签列表
function configLabelTagList(label) {
  const tagList = []
  const labelValue = label || ''
  labelValue.split(',').forEach((text) => {
    if (text) {
      tagList.push(text)
    }      
  })
  return tagList
}

// 图片预览
function showPreviewImg(imgUrl) {
  const currentUrl = imgUrl;
  const urlList = [imgUrl];
  Taro.previewImage({
    current: currentUrl,
    urls: urlList
  })
}