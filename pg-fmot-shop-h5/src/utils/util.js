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

  refreshRenderHeaderSvg,
  refreshRenderFooterSvg,

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

// 下拉刷新 (图文)
function refreshRenderHeaderSvg(status) {
  console.log(status)
  return (
    <>
      {(status === "pulling" || status === "complete") && (
        <svg width='36' height='26' viewBox='0 0 36 26' fill='none'>
          <path
            d='M34.7243 10.965C32.842 8.94809 32.4297 5.92727 31.2018 4.90525C29.9738 3.88324 28.1722 5.51123 27.5089 6.46993C23.8429 3.88324 17.9809 4.00082 17.9809 4.00082C17.9809 4.00082 12.1458 3.88324 8.47083 6.46993C7.80754 5.51123 6.01488 3.88324 4.78691 4.90525C3.55894 5.92727 3.15559 8.94809 1.2733 10.965C-0.133943 12.4844 -0.250465 12.9276 0.323186 14.1305C0.887874 15.3334 4.40149 16.3283 6.88432 13.9496C7.21596 15.1887 10.0125 21.9991 17.9899 21.9991C25.9672 21.9991 28.7817 15.1887 29.1043 13.9496C31.5872 16.3283 35.1098 15.3334 35.6834 14.1305C36.2481 12.9276 36.1316 12.4844 34.7243 10.965Z'
            fill='#818181'
          />
        </svg>
      )}
      {(status === "canRelease" || status === "refreshing") && (
        <svg width='36' height='26' viewBox='0 0 36 26' fill='none'>
          <circle cx='18' cy='13' r='3' fill='#818181' />
          <circle cx='33' cy='13' r='3' fill='#818181' />
          <circle cx='3' cy='13' r='3' fill='#818181' />
        </svg>
      )}
    </>
  );
}

// 上拉加载更多 (图文)
function refreshRenderFooterSvg(text) {
  return (
    <>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        className='nut-infinite-bottom-tips-icons'
      >
        <g clipPath='url(#clip0_878_2529)'>
          <path
            d='M23.1507 10.6435C21.8958 9.29889 21.6209 7.28491 20.8022 6.60353C19.9835 5.92216 18.7824 7.00753 18.3402 7.6467C15.896 5.92216 11.9879 6.00054 11.9879 6.00054C11.9879 6.00054 8.09759 5.92216 5.6475 7.6467C5.20528 7.00753 4.01012 5.92216 3.19143 6.60353C2.37274 7.28491 2.10383 9.29889 0.848906 10.6435C-0.0892994 11.6566 -0.166985 11.952 0.215468 12.754C0.591945 13.556 2.93447 14.2193 4.58977 12.6334C4.81088 13.4595 6.67534 18 11.9938 18C17.3123 18 19.1887 13.4595 19.4039 12.6334C21.0592 14.2193 23.4077 13.556 23.7901 12.754C24.1666 11.952 24.0889 11.6566 23.1507 10.6435Z'
            fill='#818181'
          />
        </g>
      </svg>
      {text}
    </>
  );
}


 // 检查用户状态，跳转活动首页
 function checkUserStatusGoHome() {    
  const userData = Taro.UTIL.getPGStorage('login_info')
  const isAvailableUser = userData.isAvailableUser;
  if (isAvailableUser) {
    console.log("用户正常");
    console.log("进入首页");
    Taro.ROUTER.navigateTo("/pages/home/index");
  } else {
    console.log("用户异常");
    console.log("暂不符合活动资格");
    Taro.ROUTER.navigateTo("/pages/disable/index?status=2");
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
  Taro.ROUTER.navigateTo("/pages/ssoCallBack/index?test=1");
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