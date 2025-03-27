/* eslint-disable import/no-anonymous-default-export */
let dict = {
  qrCodeDetailType: {
    DOING: 'Generating',
    DONE: 'Ready',
    DOWNLOAD: 'Downloaded',
    FAIL: 'Failed',
  },
  userLock: {
    NORMAL: 'Normal',
    LOCK: 'Suspend',
  },
  storeLock: {
    NORMAL: 'Normal',
    DISABLE: 'Suspend',
  },
  eventStatus: {
    PUBLISHED: 'Created',
    INIT: 'To Be Created',
  },

  // 活动
  activityType: {
    1: '内部活动',
    2: '外部活动',
  },
  activityStatus: {
    1: '未开始',
    2: '进行中',
    3: '已结束',
  },

  // 账号
  accountBindStatus: {
    1: '已绑定',
    2: '未绑定',
  },
  accountLoginStatus: {
    1: '正常',
    2: '锁定',
  },

  // 商品
  goodsCategory: {
    1: '洗发护理',
    2: '女性护理',
    3: '口腔护理',
    4: '护肤',
    5: '新品测试',
    6: '个人护理',
    7: '织物及家居护理',
    8: '婴儿护理',
    9: 'Grooming',
  },
  goodsType: {
    1: '实物',
    2: '虚拟',
  },

  // 订单
  orderStatus: {
    1: '待支付',
    2: '待发货',
    3: '待收货',
    4: '已完成',
    5: '已取消',
  },
  deliveryType: {
    1: '自取',
    2: '邮寄',
  }
};

export default {
  getValue: (key, value, def) => {
    let dictValue = dict[key];
    if (key == null || !dict.hasOwnProperty(key)) {
      return null;
    }
    if (dictValue.hasOwnProperty(value)) {
      return dictValue[value];
    } else {
      return def;
    }
  },
};

export { dict };
