import Taro from '@tarojs/taro';
import CONFIG from '../api/config';

export default {
  startTracker,
  configUserTracker,
  pageViewTracker,
  eventTracker,
};

function startTracker(openId) {  

}

function configUserTracker() {
  
}

function pageViewTracker(pageName) {
  console.log('pageViewTracker', pageName)
}

function eventTracker(action, query, label) {
  console.log('eventTracker', action, query, label)

  const params = {
    id: '',
    userActionType: action,
    finished: true,
    productId: '',
    orderId: ''
  }
  
  // const res = Taro.NETWORK.trackerSubmit(params) 

  // if (res.code === 0) {
  //   console.log('eventTracker success', res.data)
  // } else {
  //   console.log('eventTracker error', res.message)
  // }
}