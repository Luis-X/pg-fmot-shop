import createReducer from './create-reducer';
import Action from '../actions/UserInfo';
import { store } from '../index';

//User Info
//var userInfo = api.cache.userInfo.getSession();

const initialState = {
  userInfo: null,
  isLoading: false,
};

function getMyUserInfo() {
  const userInfo = {
    name: 'xxx',
    phone: 'xxxxxxxxxxx',
  };
  store.dispatch({
    type: Action.SAVE_USER_INFO,
    data: userInfo,
  });
}

const actionHandler = {
  [Action.SAVE_USER_INFO]: (state, action) => {
    let userInfo = action.data;
    //console.log("userInfo+++"+userInfo);
    return { userInfo };
  },

  [Action.RESET_USER_INFO]: (state, action) => {
    return { userInfo: null };
  },

  [Action.SET_LOADING_STATE]: (state, action) => {
    return { isLoading: action.data };
  },
  [Action.GET_USER_INFO]: (state, action) => {
    getMyUserInfo();
    return {};
  },
};

export default createReducer(initialState, actionHandler);
