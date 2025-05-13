import $ from 'jquery';
import * as api from '../api/api';
import moment from 'moment';
import Tools from '../utils/tools';
import RoutePath from '../config/RoutePath';

const utils = {
  // 页面跳转 path
  navigationToPath: (path, query) => {    
    let url = ''
    if (path) {
      url += `/portal/#${path}`;
    }
    if (query) {
      url += `/${query}`;
    }
    // console.log('navigationToPath', url);
    window.location.href = url;
  },
  // 页面跳转 url
  navigationToUrl: (url) => {    
    // console.log('navigationToUrl', url);
    window.location.href = url;
  },
  // 页面跳转 sso 登录
  navigationToSSOLogin: () => {    
    const url = `${RoutePath.SSOLoginUrl}&subscription-key=${Tools.decodeBaseStr(RoutePath.skId)}&redirect_uri=${encodeURIComponent(RoutePath.SSOCallbackUrl)}`;
    // console.log('navigationToSSOLogin', url);
    window.location.href = url;
  },
  // 页面跳转 sso 退出
  navigationToSSOLogout: () => {    
    const url = `${RoutePath.SSOLogoutUrl}&subscription-key=${Tools.decodeBaseStr(RoutePath.skId)}`;
    // console.log('navigationToSSOLogout', url);
    window.location.href = url;
  },

  // 根据类型下载模板文件
  downloadTemplateFile: (type) => {
    // console.log(type);
    let url;
    let fileName = 'template.xlsx';
    let time = moment().format('YYYYMMDDHHmmss');
    if (type === 101) {
      // 内部，账户导入模板
      url = api.internalAccountImportTemplate();
      fileName = `内部账号_导入账号模版${time}.xlsx`;
    } else if (type === 102) {
      // 内部，积分导入模板
      url = api.internalAccountImportTemplatePoints();
      fileName = `内部账号_积分充值模版${time}.xlsx`;
    } else if (type === 201) {
      // 外部，账户导入模板
      url = api.externalAccountImportTemplate();
      fileName = `外部账号_导入账号模版${time}.xlsx`;
    } else if (type === 202) {
      // 外部，积分导入模板
      url = api.externalAccountImportTemplatePoints();
      fileName = `外部账号_积分充值模版${time}.xlsx`;
    } else {
      console.error('未识别的模板类型');      
      return;
    }
    // console.log(url);

    const token = Tools.getToken();
    var xhh = new XMLHttpRequest();
    xhh.open('get', url, true);
    xhh.setRequestHeader('Authorization', token);
    xhh.setRequestHeader('Content-Type', 'application/json');
    xhh.responseType = 'blob';

    xhh.onload = function () {
      if (this.status === 200) {
        var blob = this.response;
        var reader = new FileReader();
        reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
        reader.onload = function (e) {
          // 转换完成，创建a标签用于下载
          var a = document.createElement('a');        
          a.download = fileName;
          a.href = e.target.result;
          $('body').append(a);
          a.click();
          $(a).remove();
        };
      }
    };
    xhh.send();
  },

  // urls转files
  imgUrlsToFiles: (imgUrls, isVideo) => {
    // console.log('imgUrlsToFiles', imgUrls);
    let list = [];
    imgUrls.forEach((item) => {
      const url = item || '';
      if (url) {
        const file = {
          url: url,
        }
        if (isVideo) {
          file.type = 'video/mp4';
          file.name = '查看视频';
        }
        list.push(file);
      }
    });
    return list;
  },

  // files转urls
  filesToImgUrls: (files) => {
    // console.log('filesToImgUrls', files);
    let list = [];
    files.forEach((item) => {
      const url = item.url || '';
      if (url) {
        list.push(url);
      }
    });
    return list;
  },

  // 时间处理
  dateFormatter: (dateValue) => {    
    // console.log('dateFormatter', dateValue)
    // const formatValue = 'YYYY-MM-DD HH:mm:ss';
    // const result = moment(new Date(dateValue)).format(formatValue);
    const result = moment(new Date(dateValue)).toISOString();
    // console.log(result);
    return result
  },

  // josn 转数组
  safeParseJsonArray: (jsonString) => {
    try {
      return JSON.parse(jsonString) || [];
    } catch (error) {
      console.error('JSON 解析失败:', error);
      return [];
    }
  },

  // 复制文本
  copyText: (text) => {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(() => resolve())
          .catch((err) => reject(err));
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            resolve();
          } else {
            reject(new Error('复制失败'));
          }
        } catch (err) {
          reject(err);
        }
        document.body.removeChild(textArea);
      }
    });
  }
};



export default utils;