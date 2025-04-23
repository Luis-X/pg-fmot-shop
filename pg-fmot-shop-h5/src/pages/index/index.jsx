import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";

export default function Index() {
  const router = useRouter();

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    setTimeout(() => {
      createdPage();
    }, 1000);
  });

  useDidShow(() => {
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {

    const act = router.params.id || ''
    setActId(act)

    requestData({
      activityId: act
    })
  };

  const [isShowAlert, setIsShowAlert] = useState(false);
  const [actId, setActId] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      userDataHandler()
    }
  }, [userData]);

  async function requestData(query) {
    const params = {
      activityId: query.activityId || '',
      pointAccountId: "test9",
      code: "789",
      timestamp: "string",
      signature: "string",
      openid: "string",
      unionid: "string",
      access_token: "string"  
    }

    const res = await Taro.NETWORK.login(params) 

    if (res.code === 0) {
      const resData = res.data || {}
      setUserData(resData)
      
      // 登录信息      
      const token = resData.token || ''
      const tokenInfo = {
        token: token
      }
      Taro.UTIL.setPGStorage('token_info', tokenInfo)	
      
      // 用户信息
      const loginInfo = resData
      Taro.UTIL.setPGStorage('login_info', loginInfo)	
      
      // 活动信息
      const activityInfo = {
        act: params.activityId,
        acc: params.pointAccountId,
      }
      Taro.UTIL.setPGStorage('activity_info', activityInfo)	
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }


  async function requestBindOpenIdData() {
    const params = {
      email: "test@163.com",
      openId: "1234567890",
    }

    Taro.HUD.showLoading('绑定中...')
    const res = await Taro.NETWORK.bindOpenId(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      Taro.HUD.showToastMessage('绑定成功')
      setTimeout(() => {
        checkUserStatus();
      }, 1500);      
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 活动处理
  const userDataHandler = () => {
    const isActivityTime = userData.isActivityTime;
    const activityType = userData.activityType;

    if (isActivityTime) {
      console.log("活动时间内")
      if (activityType === 1) {
        console.log("内部活动")
        internalHandler()
      } else if (activityType === 2) {
        console.log("外部活动")
        externalHandler()
      } else {
        console.log("未知活动")
        Taro.HUD.showToastMessage('未知活动')
      }
    } else {
      console.log("不在活动时间内");
      Taro.ROUTER.redirectTo("/pages/disable/index?status=1");
    }
  }

  // 内部活动
  const internalHandler = () => {
    const isBindOpenId = userData.isBindOpenId;

    if (isBindOpenId) {
      console.log("内部-openId已绑定");
      checkUserStatus();
    } else {
      console.log("内部-openId未绑定");
      console.log("内部-sso登录");
      Taro.UTIL.ssoLogin()           
    }
  };

  // 外部活动
  const externalHandler = () => {
    const isInternalUser = userData.isInternalUser;
    const isExternalUser = userData.isExternalUser;

    if (isInternalUser) {
      console.log("绑定过，内部用户");
      checkUserStatus();
      return;
    }

    if (isExternalUser) {
      console.log("绑定过，外部用户");
      checkUserStatus();
      return
    }

    console.log("未绑定过，内部用户");
    console.log("未绑定过，外部用户");
    console.log("进入登录页");
    Taro.ROUTER.redirectTo("/pages/login/index");
  };

  // 检查用户状态
  const checkUserStatus = () => {    
    Taro.UTIL.goToActivityHomeWithActId()
  }

  return (
    <PGLoading></PGLoading>   
  );
}
