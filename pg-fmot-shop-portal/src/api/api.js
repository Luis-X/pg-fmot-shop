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
            openid: '290834734975',
            points: '2000',
            bindStatus: '1',
            loginStatus: '1',              
          },
          {
            id: '2',
            createTime: '2020-08-10 11:11:11',
            bindTime: '2020-08-10 11:11:11',
            email: 'test@163.com',
            openid: '73495784957',
            points: '2000',
            bindStatus: '2',
            loginStatus: '2',              
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
export const internalAccountImportPoints = (param) => {
  return client.post(URL.internalAccountImportPoints, param);
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
            activityId: '123456',
            activityName: '活动123',
            bindTime: '2020-08-10 11:11:11',
            accountId: 'testlousoiu',
            openid: '34857834095',
            points: '2000',
            bindStatus: '1',
            loginStatus: '1',              
          },
          {
            createTime: '2020-08-10 11:11:11',
            id: 2,
            activityId: '123457',
            activityName: '活动124',
            bindTime: '2020-08-10 11:11:11',
            accountId: 'testou9u08',
            openid: '3458309548',
            points: '2000',
            bindStatus: '2',
            loginStatus: '2',              
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
export const externalAccountImportPoints = (param) => {
  return client.post(URL.externalAccountImportPoints, param);
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
            id: 1,
            createTime: '2020-08-10 11:11:11',            
            startTime: '2020-08-10 11:11:11',
            endTime: '2021-08-10 11:11:11',
            activityId: '123456',
            activityName: '活动1',
            activityType: '1',
            activityStatus: '1',
            link: 'https://www.baidu.com',
            orgCode: '888',              
          },
          {
            id: 2,
            createTime: '2020-08-10 11:11:11',            
            startTime: '2020-08-10 11:11:11',
            endTime: '2021-08-10 11:11:11',
            activityId: '123456',
            activityName: '活动1',
            activityType: '1',
            activityStatus: '2',
            link: 'https://www.baidu.com',
            orgCode: '888',              
          },
          {
            id: 3,
            createTime: '2020-08-10 11:11:11',            
            startTime: '2020-08-10 11:11:11',
            endTime: '2021-08-10 11:11:11',
            activityId: '123456',
            activityName: '活动1',
            activityType: '1',
            activityStatus: '3',
            link: 'https://www.baidu.com',
            orgCode: '888',              
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
            orderNO: '345694569-04596-0',
            activityId: '123456',
            activityName: '活动1',
            orgCode: '888',
            accountId: 'test@234214.com',
            deliveryType: '1',
            orderStatus: '1',
            goodsList: [
              {
                id: '1',
                goodsId: '12342134321',
                goodsName: '商品1',
                goodsNum: 1,
                goodsPrice: 100,
              },
              {
                id: '2',
                goodsId: '12342134321',
                goodsName: '商品2',
                goodsNum: 1,
                goodsPrice: 100,
              }
            ],
            goodsCount: 2,
            totalPoints: 1000,
          },
          {
            id: '2',
            createTime: '2022-01-01 12:00:00',
            orderNO: '345694569-04596-0',
            activityId: '123456',
            activityName: '活动1',
            orgCode: '888',
            accountId: 'test@234214.com',
            deliveryType: '2',
            orderStatus: '2',
            goodsList: [
              {
                id: '1',
                goodsId: '12342134321',
                goodsName: '商品商品1',
                goodsNum: 1,
                goodsPrice: 100,
              },
              {
                id: '2',
                goodsId: '12342134321',
                goodsName: '商品商品2',
                goodsNum: 1,
                goodsPrice: 100,
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
export const goodsSearchList = (param) => {
  // return client.post(URL.goodsSearchList, param);
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
          },
          {
            id: '999999',
            name: '商品2',
            price: '2000',
            category: '2',
            type: '2',              
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
          name: '洗发护理',
        },
        {
          id: 2,
          name: '女性护理',
        },
        {
          id: 3,
          name: '口腔护理',
        },
        {
          id: 4,
          name: '护肤',
        },
        {
          id: 5,
          name: '新品测试',
        },
        {
          id: 6,
          name: '个人护理',
        },
        {
          id: 7,
          name: '织物及家居护理',
        },
        {
          id: 8,
          name: '婴儿护理',
        },
        {
          id: 9,
          name: 'Grooming',
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
          { id: 1, type: '轮播图视频观看人数', duration: 3, people: 90 },
          { id: 2, type: '轮播图视频观看人数', duration: 6, people: 90 },
          { id: 3, type: '轮播图视频观看人数', duration: 9, people: 90 },
          { id: 4, type: '轮播图视频观看人数', duration: 12, people: 85 },
          { id: 5, type: '轮播图视频观看人数', duration: 15, people: 80 },
          { id: 6, type: '轮播图视频观看人数', duration: 18, people: 80 },
          { id: 7, type: '轮播图视频观看人数', duration: 21, people: 70 },
          { id: 8, type: '轮播图视频观看人数', duration: 24, people: 70 },
          { id: 9, type: '轮播图视频观看人数', duration: 27, people: 70 },
          { id: 10, type: '轮播图视频观看人数', duration: 30, people: 60 },
          { id: 11, type: '轮播图视频观看人数', duration: 33, people: 60 },
          { id: 12, type: '轮播图视频观看人数', duration: 36, people: 60 },
          { id: 13, type: '轮播图视频观看人数', duration: 39, people: 50 },
          { id: 14, type: '轮播图视频观看人数', duration: 42, people: 50 },
          { id: 15, type: '轮播图视频观看人数', duration: 45, people: 50 },
          { id: 16, type: '轮播图视频观看人数', duration: 48, people: 40 },
          { id: 17, type: '轮播图视频观看人数', duration: 51, people: 40 },
          { id: 18, type: '轮播图视频观看人数', duration: 54, people: 40 },
          { id: 19, type: '轮播图视频观看人数', duration: 57, people: 30 },
          { id: 20, type: '轮播图视频观看人数', duration: 60, people: 30 },
          // { id: 7, type: '商品详情视频观看人数', duration: 0, people: 0 },
          // { id: 8, type: '商品详情视频观看人数', duration: 3, people: 10 },
          // { id: 9, type: '商品详情视频观看人数', duration: 6, people: 15 },
          // { id: 10, type: '商品详情视频观看人数', duration: 9, people: 20 },
          // { id: 11, type: '商品详情视频观看人数', duration: 12, people: 25 },
          // { id: 12, type: '商品详情视频观看人数', duration: 15, people: 30 },
          // { id: 13, type: '商品详情视频观看人数', duration: 18, people: 35 },
          // { id: 14, type: '商品详情视频观看人数', duration: 21, people: 40 },
          // { id: 15, type: '商品详情视频观看人数', duration: 24, people: 10 },
          // { id: 16, type: '商品详情视频观看人数', duration: 27, people: 5 },
          // { id: 17, type: '商品详情视频观看人数', duration: 30, people: 50 },
          // { id: 18, type: '商品详情视频观看人数', duration: 33, people: 100 },
          // { id: 19, type: '商品详情视频观看人数', duration: 36, people: 0 },
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