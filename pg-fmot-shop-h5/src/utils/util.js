import CryptoJS from 'crypto-js';
import Taro from '@tarojs/taro';
import DayJS from 'dayjs';
import CONFIG from '../api/config';
// import { Base64 } from 'js-base64';

export default {
  pgConfig,

  setPGStorage,
  getPGStorage,
  clearPGStorage,

  checkIsLogin,
  
  dateFormatter,

  encodeBaseStr,
  decodeBaseStr,
  
  goToACLAuthWithActId,
  goToSSOLoginWithActId,
  goToActivityHomeWithActId,

  configLabelTagList,
  showPreviewImg,
};

function pgConfig() {
  return CONFIG
}

function setPGStorage(key, data) {
  try {
    const obj = JSON.stringify(data)
    sessionStorage.setItem(key, obj)
  } catch (error) {
    
  }
}

function getPGStorage(key) {
  let result = {}
  try {
    const objJson = sessionStorage.getItem(key)
    const obj = JSON.parse(objJson)
    result = obj || {}
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

  const token = getPGStorage('token_info').token || ''
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
      // 无code，跳转acl
      isLogin = false
    }
  }

  return isLogin
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

// ACL授权，获取code
async function goToACLAuthWithActId(actId, pageName) { 
  if (!actId) {
    console.log('缺少 actId')
    return
  }

  clearPGStorage('token_info')
  clearPGStorage('login_info')  
  clearPGStorage('activity_info')
  clearPGStorage('service_info')
  clearPGStorage('order_confirm_info')
  
  let pageUrl = ''
  if (pageName) {
    // 指定页面
    pageUrl = `${CONFIG.aclPage}?id=${actId}&page=${pageName}`
  } else {
    // 默认页面
    pageUrl = `${CONFIG.aclPage}?id=${actId}`
  }
  const aclAuthUrl = `${CONFIG.aclAuthUrl}${encodeURIComponent(pageUrl)}`
  
  console.log(aclAuthUrl)
  window.location.replace(aclAuthUrl)
}

// SSO登录，获取code
function goToSSOLoginWithActId(actId) {
  if (!actId) {
    console.log('缺少 actId')
    return
  }

  clearPGStorage('token_info')
  clearPGStorage('login_info')  
  clearPGStorage('activity_info')
  clearPGStorage('service_info')
  clearPGStorage('order_confirm_info')

  const callbackUrl = `${CONFIG.ssoCallbackUrl}?act=${actId}`
  const ssoLoginUrl = `${CONFIG.ssoLoginUrl}&subscription-key=${decodeBaseStr(CONFIG.skId)}&redirect_uri=${encodeURIComponent(callbackUrl)}`
  
  console.log(ssoLoginUrl)
  window.location.replace(ssoLoginUrl)
}

// 检查用户状态，跳转活动首页
function goToActivityHomeWithActId(actId, accId) {   
  if (!actId) {
    console.log('缺少 actId')
    return
  }
  if (!accId) {
    console.log('缺少 accId')
    return
  } 
  
  console.log("进入首页");
  Taro.ROUTER.redirectTo(`/pages/home/index?act=${actId}&acc=${accId}`);
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