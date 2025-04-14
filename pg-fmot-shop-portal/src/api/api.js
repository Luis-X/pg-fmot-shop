import axios from 'axios';
import CONFIG from '../config/const';
import * as URL from './URL';
import RoutePath from '../config/RoutePath';
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
    Authorization: localStorage.getItem('token') || '',
  },
});

client.interceptors.response.use((response) => {
  //响应拦截
  const status = response.status;
  const code = response.data.code;
  if (status === 200) {
    if (code === -2) {
      if (localStorage.getItem('token')) {
        //未登录/登录超时
        apiWarning('登录超时');
      } else {
        console.log('token不存在')
        // window.location.href = '/portal/result/2'
        // this.props.history.push(RoutePath.ResultWarning)
      }
    } else if (code === -3) {
      //没有权限访问
      window.location.href = '/portal/result/3';
      // apiWarning(`You don't have access`);//没有权限访问
    } else {
      return Promise.resolve(response);
    }
  } else {
    //catch的拦截 如500等
    return Promise.reject(response);
  }
}, (error) => {
  // alert(JSON.stringify(error.response))
  // alert(error.response.status)
  window.location.href = `/portal/resultCode/${error.response.status}`;
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
    setTimeout(() => (window.location.href = '/portal' + RoutePath.Index), 1000);
    // window.location.href = '/portal/#'+RoutePath.Index
  }, secondsToGo * 1000);
};

export const setToken = () => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
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
export const uploadFileSignChunk = (param) => {
  return client.post(URL.uploadFileSignChunk, param);
};
// 检查分片签名
export const uploadFileChunkCheck = (param) => {
  return client.post(URL.uploadFileChunkCheck, param);
};
// 合并分片签名
export const uploadFileChunkMerge = (param) => {
  return client.post(URL.uploadFileChunkMerge, param);
};


// 登录、登出
export const ssoLogin = (param) => {
  return client.post(URL.ssoLogin, param);
  // return {
  //   "data": {
  //     "code": 0,
  //     "message": "success",
  //     "data": { 
  //       token: '1234567890',
  //       userName: 'RichLuisX',
  //       roleName: 'developer',
  //     }
  //   }
  // }
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
//   const res = {
//     data: {
//       code: 0,
//       data: {
//         content: [
//           { id: 1, type: '轮播图视频观看人数', duration: 3, people: 90 },
//           { id: 2, type: '轮播图视频观看人数', duration: 6, people: 90 },
//           { id: 3, type: '轮播图视频观看人数', duration: 9, people: 90 },
//           { id: 4, type: '轮播图视频观看人数', duration: 12, people: 85 },
//           { id: 5, type: '轮播图视频观看人数', duration: 15, people: 80 },
//           { id: 6, type: '轮播图视频观看人数', duration: 18, people: 80 },
//           { id: 7, type: '轮播图视频观看人数', duration: 21, people: 70 },
//           { id: 8, type: '轮播图视频观看人数', duration: 24, people: 70 },
//           { id: 9, type: '轮播图视频观看人数', duration: 27, people: 70 },
//           { id: 10, type: '轮播图视频观看人数', duration: 30, people: 60 },
//           { id: 11, type: '轮播图视频观看人数', duration: 33, people: 60 },
//           { id: 12, type: '轮播图视频观看人数', duration: 36, people: 60 },
//           { id: 13, type: '轮播图视频观看人数', duration: 39, people: 50 },
//           { id: 14, type: '轮播图视频观看人数', duration: 42, people: 50 },
//           { id: 15, type: '轮播图视频观看人数', duration: 45, people: 50 },
//           { id: 16, type: '轮播图视频观看人数', duration: 48, people: 40 },
//           { id: 17, type: '轮播图视频观看人数', duration: 51, people: 40 },
//           { id: 18, type: '轮播图视频观看人数', duration: 54, people: 40 },
//           { id: 19, type: '轮播图视频观看人数', duration: 57, people: 30 },
//           { id: 20, type: '轮播图视频观看人数', duration: 60, people: 30 },
//           // { id: 7, type: '商品详情视频观看人数', duration: 0, people: 0 },
//           // { id: 8, type: '商品详情视频观看人数', duration: 3, people: 10 },
//           // { id: 9, type: '商品详情视频观看人数', duration: 6, people: 15 },
//           // { id: 10, type: '商品详情视频观看人数', duration: 9, people: 20 },
//           // { id: 11, type: '商品详情视频观看人数', duration: 12, people: 25 },
//           // { id: 12, type: '商品详情视频观看人数', duration: 15, people: 30 },
//           // { id: 13, type: '商品详情视频观看人数', duration: 18, people: 35 },
//           // { id: 14, type: '商品详情视频观看人数', duration: 21, people: 40 },
//           // { id: 15, type: '商品详情视频观看人数', duration: 24, people: 10 },
//           // { id: 16, type: '商品详情视频观看人数', duration: 27, people: 5 },
//           // { id: 17, type: '商品详情视频观看人数', duration: 30, people: 50 },
//           // { id: 18, type: '商品详情视频观看人数', duration: 33, people: 100 },
//           // { id: 19, type: '商品详情视频观看人数', duration: 36, people: 0 },
//         ]
//       },
//     },
//   }
//   return clientMockData(res, param);
};


// 模拟请求
const clientMockData = (res, param) => new Promise((resolve, reject) => {
  console.log('param', param);
  setTimeout(() => {
    resolve(res);
  }, 1000);
})