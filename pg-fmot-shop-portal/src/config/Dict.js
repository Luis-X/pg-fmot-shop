/* eslint-disable import/no-anonymous-default-export */
let dict = {
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
    2: '虚拟商品',
  },

  // 订单
  orderStatus: {
    1: '交易成功',
    2: '已取消',
  },
  deliveryType: {
    1: '自提',
    2: '邮寄',
  },

  // 埋点
  trackPeopleType: {
    1: '浏览人数',
    2: '页面平均停留时长',
    3: '轮播图视频平均播放时长',
    4: '轮播图视频播放人数',
    5: '轮播图视频完播人数',
    6: '商品详情视频平均播放时长',
    7: '商品详情视频播放人数',
    8: '商品详情视频完播人数',
    9: '购买人数',
    10: '添加购物车人数',   
    11: '点击“确认兑换”人数',
    12: '兑换成功人数',
    13: '兑换失败人数',
    14: '取消人数',
  },
  trackTimesType: {
    1: '浏览次数',
    2: '页面平均停留时长',
    3: '轮播图视频平均播放时长',
    4: '轮播图视频播放次数',
    5: '轮播图视频完播次数',
    6: '商品详情视频平均播放时长',
    7: '商品详情视频播放次数',
    8: '商品详情视频完播次数',
    9: '购买次数',
    10: '添加购物车次数',    
    11: '点击“确认兑换”次数',
    12: '兑换成功次数',
    13: '兑换失败次数',
    14: '取消次数',
  },
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

  getOptionsList: (key) => {
    if (key == null ||!dict.hasOwnProperty(key)) {
      return [];
    }
    let obj = dict[key];
    let options = [];
    for (let k in obj) {
      options.push({
        value: k,
        label: obj[k]       
      });
    }
    return options;
  }
  
};

export { dict };
