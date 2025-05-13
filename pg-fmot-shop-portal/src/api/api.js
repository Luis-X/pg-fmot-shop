import axios from 'axios';
import CONFIG from '../config/const';
import * as URL from './URL';
import RoutePath from '../config/RoutePath';
import Util from '../utils/util';
import Tools from '../utils/tools';
import { Modal } from 'antd';


export const client = axios.create({
  baseURL: CONFIG.SERVER_HOST,
  // baseURL: '/',
  timeout: 180000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    Pragma: 'no-cache',
    Authorization: Tools.getToken(),
  },
});

client.interceptors.response.use((response) => {
  //响应拦截
  const status = response.status;
  const code = response.data.code;
  const token = Tools.getToken();
  if (status === 200) {
    if (code === -2) {
      if (token) {
        //未登录/登录超时
        apiWarning('登录超时');
      } else {
        // token不存在
        console.log('token不存在')
        Util.navigationToPath(RoutePath.ResultWarn, 2);
      }
    } else if (code === -3) {
      //没有权限访问
      Util.navigationToPath(RoutePath.ResultWarn, 3);
    } else {
      return Promise.resolve(response);
    }
  } else {
    //catch的拦截 如500等
    return Promise.reject(response);
  }
}, (error) => {
  Util.navigationToPath(RoutePath.ResultCode, error.response.status);
});

export const apiWarning = (title) => {
  let secondsToGo = 3;
  const modal = Modal.warning({
    title: title,
    className: 'apiModal',
    content: secondsToGo === 0 ? '页面跳转中...' : `将在 ${secondsToGo} 秒后重新授权登录!`,
  });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      title: title,
      className: 'apiModal',
      content: secondsToGo === 0 ? '页面跳转中...' : `将在 ${secondsToGo} 秒后重新授权登录!`,
    });
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
    setTimeout(() => (
      Util.navigationToPath(RoutePath.Index)
    ), 1000);
  }, secondsToGo * 1000);
};

export const setToken = () => {
  client.interceptors.request.use((config) => {
    const token = Tools.getToken();
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers['Authorization'] = token;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
};


// 上传文件
export const uploadFile = (param) => {
  return URL.uploadFile;
};
// 上传文件 post
export const uploadFilePost = (param) => {
  return client.post(URL.uploadFile, param);
};
// 根据fileId获取url
export const uploadFileGetUrl = (param) => {
  return client.post(URL.uploadFileGetUrl, param);
};
// 私有文件上传签名
export const uploadFileSign = (param) => {
  return client.get(URL.uploadFileSign, param);
};
// 公共文件上传签名
export const uploadFileSignPublic = (param) => {
  return client.get(URL.uploadFileSignPublic, param);
};
// 分片上传签名
// export const uploadFileSignChunk = (param) => {
//   return client.post(URL.uploadFileSignChunk, param);
// };
// 检查分片签名
// export const uploadFileChunkCheck = (param) => {
//   return client.post(URL.uploadFileChunkCheck, param);
// };
// 合并分片签名
// export const uploadFileChunkMerge = (param) => {
//   return client.post(URL.uploadFileChunkMerge, param);
// };


// 登录、登出
export const ssoLogin = (param) => {
  return client.post(URL.ssoLogin, param);
};
// export const logout = (param) => {
//   return client.post(URL.logout, param);
// };


// 通用
export const orgCodeList = (param) => {
  return client.get(URL.orgCodeList, param);
};


// 异步任务
export const asyncTaskDetail = (param) => {
  return client.get(`${URL.asyncTaskDetail}/${param.id}`, {});
};


// 内部账号
export const internalAccountList = (param) => {
  return client.post(URL.internalAccountList, param);
};
export const internalAccountChangeStatus = (param) => {
  return client.post(URL.internalAccountChangeStatus, param);
};
export const internalAccountImport = (param) => {
  return client.post(URL.internalAccountImport, param);
};
export const internalAccountImportTemplate = (param) => {
  return URL.internalAccountImportTemplate;
}
export const internalAccountImportPoints = (param) => {
  return client.post(URL.internalAccountImportPoints, param);
};
export const internalAccountImportTemplatePoints = (param) => {
  return URL.internalAccountImportTemplatePoints;
}

// 外部账号
export const externalAccountList = (param) => {
  return client.post(URL.externalAccountList, param);
};
export const externalAccountChangeStatus = (param) => {
  return client.post(URL.externalAccountChangeStatus, param);
};
export const externalAccountImport = (param) => {
  return client.post(URL.externalAccountImport, param);
};
export const externalAccountImportTemplate = (param) => {
  return URL.externalAccountImportTemplate;
}
export const externalAccountImportPoints = (param) => {
  return client.post(URL.externalAccountImportPoints, param);
};
export const externalAccountImportTemplatePoints = (param) => {
  return URL.externalAccountImportTemplatePoints;
}

// 活动
export const eventList = (param) => {
  return client.post(URL.eventList, param);
};
export const eventCopy = (param) => {
  return client.post(URL.eventCopy, param);
};
export const eventDetail = (param) => {
  return client.post(URL.eventDetail, param);
};
export const eventCreate = (param) => {
  return client.post(URL.eventCreate, param);
};
export const eventSave = (param) => {
  return client.post(URL.eventSave, param);
};
// export const eventGoodsEdit = (param) => {
//   return client.post(URL.eventGoodsEdit, param);
// }
// export const eventGoodsDelete = (param) => {
//   return client.post(URL.eventGoodsDelete, param);
// }

// 订单
export const orderList = (param) => {
  return client.post(URL.orderList, param);
};
export const orderListExport = (param) => {
  return client.post(URL.orderListExport, param);
}

// 商品
export const goodsSearchList = (param) => {
  return client.post(URL.goodsSearchList, param);
};
export const goodsList = (param) => {
  return client.post(URL.goodsList, param);
};
export const goodsCategoryList = (param) => {
  return client.get(URL.goodsCategoryList, param);
};
export const goodsDetail = (param) => {
  return client.post(URL.goodsDetail, param);
};
export const goodsCreate = (param) => {
  return client.post(URL.goodsCreate, param);
};
export const goodsSave = (param) => {
  return client.post(URL.goodsSave, param);
};

// 数据统计
export const trackList = (param) => {
  return client.post(URL.trackList, param);
};
export const trackExport = (param) => {
  return client.post(URL.trackExport, param);
}
export const trackPeopleList = (param) => {
  return client.post(URL.trackPeopleList, param);
};
export const trackTimesList = (param) => {
  return client.post(URL.trackTimesList, param);
};
export const trackChart = (param) => {
  return client.post(URL.trackChart, param);
};