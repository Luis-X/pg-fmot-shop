// 'use strict'

import { combineReducers } from 'redux';
import UserInfo from './UserInfo';

const ReducerRoot = combineReducers({
  user: UserInfo,
});

export default ReducerRoot;
