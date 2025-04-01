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

// 登录、登出
export const SsoLogin = (param) => {
  // return client.post(URL.ssoLogin, param);
  return {
    "data": {
      "code": 0,
      "message": "success",
      "data": { 
        token: '1234567890',
        userName: 'RichLuisX',
        roleName: 'developer',
        menu: [
          
        ]
      }
    }
  }
};
export const logout = (param) => {
  // return client.post(URL.logout, param);
  const res = {
    data: {
      code: 0,
      message:'success',
    }
  };
  return clientMockData(res, param);
};

// 通用
export const orgCodeList = (param) => {
  // return client.post(URL.orgCodeList, param);
  const res = {
    data: {
      code: 0,
      data: [
        {
          id: 1,
          name: '机构1',
        },
        {
          id: 2,
          name: '机构2',
        },
        {
          id: 3,
          name: '机构3',
        }
      ],
    },
  };
  return clientMockData(res, param);
};

// 内部账号
export const internalAccountList = (param) => {
  // return client.post(URL.internalAccountList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            id: '1',
            createTime: '2020-08-10 11:11:11',
            bindTime: '2020-08-10 11:11:11',
            email: 'test@163.com',
            openid: '1',
            points: '2000',
            status: '1',
            permission: '1',              
          }
        ],
        totalElements: 2,
        message: 'success',
      }
    }
  };
  return clientMockData(res, param);
};
export const internalAccountChangeStatus = (param) => {
  // return client.post(URL.internalAccountChangeStatus, param);
  const res = {
    data: {
      code: 0,
      message:'success',
    }
  };
  return clientMockData(res, param);
};
export const internalAccountImport = (param) => {
  return client.post(URL.internalAccountImport, param);
};
export const internalAccountImportTemplate = (param) => {
  return client.post(URL.internalAccountImportTemplate, param);
};
export const internalAccountImportPoints = (param) => {
  return client.post(URL.internalAccountImportPoints, param);
};
export const internalAccountImportTemplatePoints = (param) => {
  return client.post(URL.internalAccountImportTemplatePoints, param);
};

// 外部账号
export const externalAccountList = (param) => {
  // return client.post(URL.externalAccountList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            createTime: '2020-08-10 11:11:11',
            id: 1,
            activityName: '活动2',
            bindTime: '2020-08-10 11:11:11',
            account: 'test',
            openid: '2',
            points: '2000',
            status: '1',
            permission: '1',              
          }
        ],
        totalElements: 2,
        message: 'success',
      }
    }
  };
  return clientMockData(res, param);
};
export const externalAccountChangeStatus = (param) => {
  // return client.post(URL.externalAccountChangeStatus, param);
  const res = {
    data: {
      code: 0,
      message:'success',
    }
  };
  return clientMockData(res, param);
};
export const externalAccountImport = (param) => {
  return client.post(URL.externalAccountImport, param);
};
export const externalAccountImportTemplate = (param) => {
  return client.post(URL.externalAccountImportTemplate, param);
};
export const externalAccountImportPoints = (param) => {
  return client.post(URL.externalAccountImportPoints, param);
};
export const externalAccountImportTemplatePoints = (param) => {
  return client.post(URL.externalAccountImportTemplatePoints, param);
};

// 活动
export const eventList = (param) => {
  // return client.post(URL.eventList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            createTime: '2020-08-10 11:11:11',
            id: 1,
            startTime: '2020-08-10 11:11:11',
            endTime: '2021-08-10 11:11:11',
            name: '活动1',
            type: '1',
            status: '1',
            link: 'https://www.baidu.com',
            orgCode: '123456',              
          }
        ],
        totalElements: 2,
        message: 'success',
      }
    }
  };
  return clientMockData(res, param);
};
export const eventCopy = (param) => {
  // return client.post(URL.eventCopy, param);
  const res = {
    data: {
      code: 0,
    },
  };
  return clientMockData(res, param);
};
export const eventDetail = (param) => {
  // return client.post(URL.eventDetail, param);
  const res = {
    data: {
      code: 0,
      data: {
        activityType: '1',
        activityName: "活动名称",
        orgCode: "123456789",
        startTime: "2023-01-01",
        endTime: "2023-01-31",
        deliveryType: ['1', '2'],
        informNote: "活动通知",
        serviceNote: "活动服务",
        activityDesc: "活动描述",
        activityBanner: [{
          bannerImg: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          bannerLink: "https://www.baidu.com"
        }],
        goodsLimitCount: 10,
        goodsList: [
          {
            id: 100,
            goodsCode: 111,
            goodsName: '商品名称1',
            goodsPrice: '100',
            goodsActivityPrice: '100',
          },
          {
            id: 200,
            goodsCode: 222,
            goodsName: '商品名称2',
            goodsPrice: '200',
            goodsActivityPrice: '200',
          }
        ]
      }
    }
  }
  return clientMockData(res, param);
};
export const eventCreate = (param) => {
  // return client.post(URL.eventCreate, param);
  const res = {
    data: {
      code: 0,
    },
  };
  return clientMockData(res, param);
};
export const eventSave = (param) => {
  // return client.post(URL.eventSave, param);
  const res = {
    data: {
      code: 0,
    },
  };
  return clientMockData(res, param);
};
export const eventGoodsList = (param) => {
  // return client.post(URL.eventGoodsList, param);
  const res = {
    data: {
      code: 0,
      data: [
        {
          id: 100,
          goodsCode: 111,
          goodsName: '商品名称1',
          goodsPrice: '100',
          // goodsActivityPrice: '100',
        },
        {
          id: 200,
          goodsCode: 222,
          goodsName: '商品名称2',
          goodsPrice: '200',
          goodsActivityPrice: '200',
        },
        {
          id: 300,
          goodsCode: 333,
          goodsName: '商品名称3',
          goodsPrice: '300',
          goodsActivityPrice: '300',
        },
        {
          id: 400,
          goodsCode: 444,
          goodsName: '商品名称4',
          goodsPrice: '400',
          goodsActivityPrice: '400',
        }
      ],
    },
  };
  return clientMockData(res, param);
};

// 订单
export const orderList = (param) => {
  // return client.post(URL.orderList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            id: '1',
            createTime: '2022-01-01 12:00:00',
            orderNO: '123456',
            activityId: 1,
            activityName: '活动1',
            orgCode: '123456',
            accountId: '7890',
            deliveryType: '1',
            orderStatus: '1',
            goodsList: [
              {
                id: '1',
                goodsName: '商品1',
                goodsNum: 1,
              },
              {
                id: '2',
                goodsName: '商品2',
                goodsNum: 2,
              }
            ],
            goodsCount: 2,
            totalPoints: 1000,
          }
        ],
        totalElements: 2,
        message: 'success',
      }
    }
  }
  return clientMockData(res, param);
};

// 商品
export const goodsList = (param) => {
  // return client.post(URL.goodsList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            id: '8888888',
            name: '商品1',
            price: '2000',
            category: '1',
            type: '1',              
          }
        ],
        totalElements: 2,
        message: 'success',
      }
    }
  };
  return clientMockData(res, param);
};
export const goodsCategoryList = (param) => {
  // return client.post(URL.goodsCategoryList, param);
  const res = {
    data: {
      code: 0,
      data: [
        {
          id: 1,
          name: '类别1',
        },
        {
          id: 2,
          name: '类别2',
        },
      ],
    },
  };
  return clientMockData(res, param);
};
export const goodsDetail = (param) => {
  // return client.post(URL.goodsDetail, param);
  const res = {
    data: {
      code: 0,
      data: {
        goodsType: '2',
        goodsCategory: 1,
        goodsCode: '3',
        goodsName: '4',
        goodsPrice: '5.5',
        goodsTag: '6',
        goodsImg: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        goodsVideo: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        goodsIntroImg: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        bannerImgs: [
          'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        ],
        bannerPoster: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        bannerVideo: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    },
  };
  return clientMockData(res, param);
};
export const goodsCreate = (param) => {
  // return client.post(URL.goodsCreate, param);
  const res = {
    data: {
      code: 0,
    },
  };
  return clientMockData(res, param);
};
export const goodsSave = (param) => {
  // return client.post(URL.goodsSave, param);
  const res = {
    data: {
      code: 0,
    },
  };
  return clientMockData(res, param);
};

// 数据统计
export const trackList = (param) => {
  // return client.post(URL.trackList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            id: 1,
            activityId: 1,
            activityName: '活动1',
            createTime: '2022-01-01 12:00:00',
            startTime: '2020-08-10 11:11:11',
            endTime: '2021-08-10 11:11:11',
            orgCode: '123456',                      
            activityType: 1,
            count: 100,  
            times: 200,
          },
          {
            id: 2,
            activityId: 1,
            activityName: '活动1',
            createTime: '2022-01-01 12:00:00',
            startTime: '2020-08-10 11:11:11',
            endTime: '2021-08-10 11:11:11',
            orgCode: '123456',                      
            activityType: 1,
            count: 100,  
            times: 200,
          }
        ],
        totalElements: 2,
        message: 'success',
      }
    }
  };
  return clientMockData(res, param);
};
export const trackPeopleList = (param) => {
  // return client.post(URL.trackPeopleList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
          {
            id: 4,
          },
          {
            id: 5,
          },
          {
            id: 6,
          },
          {
            id: 7,
          },
          {
            id: 8,
          },
          {
            id: 9,
          },
          {
            id: 10,
          }
        ],
        totalElements: 12
      },
    },
  };
  return clientMockData(res, param);
};
export const trackTimesList = (param) => {
  // return client.post(URL.trackTimesList, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          {
            id: 10,
          },
          {
            id: 11,
          },
          {
            id: 12,
          },
          {
            id: 13,
          },
          {
            id: 14,
          },
          {
            id: 15,
          },
          {
            id: 16,
          },
          {
            id: 17,
          },
          {
            id: 18,
          },
          {
            id: 19,
          },
          {
            id: 20,
          },
          {
            id: 21,
          },
        ],
        totalElements: 12
      },
    },
  };
  return clientMockData(res, param);
};
export const trackChart = (param) => {
  // return client.post(URL.trackChart, param);
  const res = {
    data: {
      code: 0,
      data: {
        content: [
          { type: '轮播图视频观看人数', duration: '0', people: 0 },
          { type: '轮播图视频观看人数', duration: '0', people: 5 },
          { type: '轮播图视频观看人数', duration: '5', people: 15 },
          { type: '轮播图视频观看人数', duration: '10', people: 10 },
          { type: '轮播图视频观看人数', duration: '15', people: 25 },
          { type: '轮播图视频观看人数', duration: '20', people: 0 },
          { type: '商品详情视频观看人数', duration: '0', people: 0 },
          { type: '商品详情视频观看人数', duration: '5', people: 10 },
          { type: '商品详情视频观看人数', duration: '10', people: 15 },
          { type: '商品详情视频观看人数', duration: '15', people: 20 },
          { type: '商品详情视频观看人数', duration: '20', people: 25 },
          { type: '商品详情视频观看人数', duration: '25', people: 30 },
          { type: '商品详情视频观看人数', duration: '30', people: 35 },
          { type: '商品详情视频观看人数', duration: '35', people: 40 },
          { type: '商品详情视频观看人数', duration: '40', people: 10 },
          { type: '商品详情视频观看人数', duration: '45', people: 5 },
          { type: '商品详情视频观看人数', duration: '50', people: 50 },
          { type: '商品详情视频观看人数', duration: '55', people: 100 },
          { type: '商品详情视频观看人数', duration: '60', people: 0 },
        ]
      },
    },
  }
  return clientMockData(res, param);
};


// 模拟请求
const clientMockData = (res, param) => new Promise((resolve, reject) => {
  console.log('param', param);
  setTimeout(() => {
    resolve(res);
  }, 1000);
})