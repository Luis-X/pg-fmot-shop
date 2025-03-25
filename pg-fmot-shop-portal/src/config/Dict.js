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
  eventMgmtType: {
    PUBLISHED: '内部活动',
    INIT: '外部活动',
  },
  eventMgmtStatus: {
    PUBLISHED: '未开始',
    INIT: '进行中',
    FINISHED: '已结束',
  },
  internalAccountStatus: {
    NORMAL: '已绑定',
    DISABLE: '未绑定',
  },
  goodsMgmtCategory: {
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
  goodsMgmtType: {
    PUBLISHED: '实物',
    INIT: '虚拟',
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
};

export { dict };
