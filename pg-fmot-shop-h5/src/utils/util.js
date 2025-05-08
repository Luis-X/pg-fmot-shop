import CryptoJS from 'crypto-js';
import Taro from '@tarojs/taro';
import DayJS from 'dayjs';
import CONFIG from '../api/config';
// import { Base64 } from 'js-base64';

export default {
  pgConfig,

  setPGStorage,
  getPGStorage,
  setPGLocalStorage,
  getPGLocalStorage,
  clearPGStorage,
  clearAllPGStorage,

  checkIsLogin,
  
  dateFormatter,

  encodeBaseStr,
  decodeBaseStr,
  
  ssoLoginRedirectUri,
  
  goToACLAuthPage,  
  goToSSOLoginPage,
  goToActivityPage,

  configLabelTagList,
  showPreviewImg,
  getVideoBase64WithUrl,
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

function setPGLocalStorage(key, data) {
  try {
    const obj = JSON.stringify(data)
    localStorage.setItem(key, obj)
  } catch (error) {
    
  }
}

function getPGLocalStorage(key) {
  let result = {}
  try {
    const objJson = localStorage.getItem(key)
    const obj = JSON.parse(objJson)
    result = obj || {}
  } catch (error) {
    
  }
  return result
}

function clearPGStorage(key) {
  try {
    sessionStorage.removeItem(key)
    localStorage.removeItem(key)
  } catch (error) {
    
  }  
}

function clearAllPGStorage() {
  clearPGStorage('enter_page')
  clearPGStorage('token_info')
  clearPGStorage('agree_info')  
  clearPGStorage('service_info')
  clearPGStorage('order_confirm_info')
  clearPGStorage('order_cancel_info')
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
async function checkIsLogin() {
  let isLogin = false
  const tokenInfo = getPGStorage('token_info') || {}
  const token = tokenInfo.token || ''
  if (token) {
    // 已登录
    isLogin = true
  } else {
    // 无code，需跳转acl
    isLogin = false
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
async function goToACLAuthPage(data) {
  const { actId, actPage } = data || {}

  if (!actId) {
    console.log('缺少 actId')
  }

  /*
  // 前端拼接acl
  let pageUrl = ''
  if (actPage) {
    // 指定页面
    console.log('acl 指定页面', actPage)
    pageUrl = `${CONFIG.aclPage}?id=${actId}&page=${actPage}`
  } else {
    // 默认页面
    pageUrl = `${CONFIG.aclPage}?id=${actId}`
  }
  const aclAuthUrl = `${CONFIG.aclAuthUrl}${encodeURIComponent(pageUrl)}`
  console.log(aclAuthUrl)
  window.location.replace(aclAuthUrl)
  */

  const aclAuthUrl = `${CONFIG.aclRedirectUrl}?id=${actId}&page=${actPage}`  
  console.log(aclAuthUrl)
  clearAllPGStorage()
  clearPGStorage('token_sso')
  window.location.replace(aclAuthUrl)
}

// SSO登录，获取code
function ssoLoginRedirectUri(actId, actPage) {
  let url = ''
  if (actPage) {
    // 指定页面
    console.log('sso 指定页面', actPage)
    url = `${CONFIG.ssoCallbackUrl}?id=${actId}&page=${actPage}`
  } else {
    // 默认页面
    url = `${CONFIG.ssoCallbackUrl}?id=${actId}`
  }
  return url
}

function goToSSOLoginPage(data) {
  const { actId, actPage } = data || {}

  if (!actId) {
    console.log('缺少 actId')
  }

  const pageUrl = ssoLoginRedirectUri(actId, actPage)
  const ssoLoginUrl = `${CONFIG.ssoLoginUrl}&subscription-key=${decodeBaseStr(CONFIG.skId)}&redirect_uri=${encodeURIComponent(pageUrl)}`
  
  console.log(ssoLoginUrl)
  clearAllPGStorage()
  window.location.replace(ssoLoginUrl)
}

// 检查用户状态，跳转活动首页
function goToActivityPage(data) {   
  const { actId, accId, actPage, fromPage } = data || {}

  if (!actId) {
    console.log('缺少 actId')
  }
  if (!accId) {
    console.log('缺少 accId')
  } 

  let url = ''
  if (actPage) {
    // 指定页面
    console.log('进入指定页面');
    url = `/pages/${actPage}/index?act=${actId}&acc=${accId}`
  } else {
    // 默认页面
    console.log('进入默认首页');
    url = `/pages/home/index?act=${actId}&acc=${accId}`
  }  

  if (fromPage === 'exchange') {
    Taro.ROUTER.navigateTo(url);
  } else {
    Taro.ROUTER.reLaunchTo(url);
  }
}

// 配置标签列表
function configLabelTagList(label) {
  let tagList = []
  const labelValue = label || ''
  labelValue.split('、').forEach((text) => {
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

// 获取视频指定时间点的封面图的 Base64 编码
function getVideoBase64WithUrl(url) {
  return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.setAttribute('crossorigin', 'anonymous'); // 处理跨域
      video.setAttribute('src', url);
      video.setAttribute('width', 375);
      video.setAttribute('height', 375);
      video.setAttribute('controls', 'controls');
      video.currentTime = 1; // 设置视频播放到 1 秒的位置

      const handleLoadedData = () => {
          const canvas = document.createElement("canvas");
          const width = video.videoWidth; // 使用视频实际宽度
          const height = video.videoHeight; // 使用视频实际高度
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
              ctx.drawImage(video, 0, 0, width, height); // 绘制 canvas
              const dataURL = canvas.toDataURL('image/jpeg', 0.3); // 转换为 base64
              const img = document.createElement("img");
              img.src = dataURL;
              video.setAttribute('poster', dataURL);
              resolve(dataURL);
          } else {
              reject(new Error('无法获取 canvas 上下文'));
          }
          // 移除事件监听器
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('error', handleError);
      };

      const handleError = () => {
          reject(new Error('视频加载失败'));
          // 移除事件监听器
          video.removeEventListener('loadeddata', handleLoadedData);
          video.removeEventListener('error', handleError);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
  });
}
