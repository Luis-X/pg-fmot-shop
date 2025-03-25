import Taro from '@tarojs/taro';

export default {
  navigateBack,
  navigateTo,
  redirectTo,
  reLaunchTo,
  navigateToWeb
}

// back
function navigateBack(url, isMustBack) {

  try {
    const pages = Taro.getCurrentPages();
    var delta = 1;
    var index = -1;
    pages.forEach((item, i) => {
      const route = item.route || ''
      const myRoute = url || ''
      const isContain = myRoute.indexOf(route) === -1 ? false : true
      if (isContain) {
        index = i;
        delta = (pages.length - 1) - i;
      }
    });
  } catch (error) {
    
  }

  // 已匹配（返回匹配页）
  if (index >= 0) {
    console.log('navigateBack page 匹配返回', `${delta}`);
    Taro.navigateBack({
      delta: delta,
    });
    return;
  }

  if (isMustBack) {
    console.log('navigateBack page 未匹配跳转', `${url}`);
    reLaunchTo(url)
    return
  }

  console.log('navigateBack page 未匹配返回', '上一页');
  // 未匹配（返回上一页）
  Taro.navigateBack();
}

// navigate
function navigateTo(url, callback) {
  if (!url) {
    return;
  }

  console.info('router', `navigateTo: ${url}`);

  Taro.navigateTo({
    url: url,
    success() {			
      if (callback) {
        callback(true);
      }
    },
    fail() {
      if (callback) {				
        callback(false);
      }
    }
  });
}

// redirect
function redirectTo(url, callback) {
  if (!url) {
    return;
  }

  console.info('router', `redirectTo: ${url}`);

  Taro.redirectTo({
    url: url,
    success() {			
      if (callback) {
        callback(true);
      }
    },
    fail() {
			if (callback) {				
        callback(false);
      }
    }
  });
}

// reLaunch
function reLaunchTo(url, callback) {
  if (!url) {
    return;
  }

  console.info('router', `reLaunch: ${url}`);

  Taro.reLaunch({
    url: url,
    success() {			
      if (callback) {
        callback(true);
      }
    },
    fail() {
			if (callback) {				
        callback(false);
      }
    }
  });
}

// web
function navigateToWeb(url) {
  if (!url) {
    return
  }
  window.location.href = url
}

// home
// function alertBackToHome() {
// 	Taro.showModal({
// 		title: '',
// 		content: '跳转失败',    
// 		confirmText: '确定',
//     showCancel: false,
// 		complete: (res) => {
      
// 		}
// 	})
// }