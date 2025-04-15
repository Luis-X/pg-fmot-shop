import Taro from '@tarojs/taro';
import CONFIG from '../api/config';

export default {
  pageViewTracker,
  eventTracker,
};

function pageViewTracker(pageName) {
  console.log('pageViewTracker', pageName)
}

function eventTracker(action, label, category, query) {
  console.log('eventTracker', action, label, category, query)
}