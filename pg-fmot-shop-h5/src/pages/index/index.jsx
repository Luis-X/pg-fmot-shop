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

  // FIXME: 服务端提供接口，重定向acl，回调携带act、page、code参数到此页面
  const createdPage = async () => {

    Taro.TRACKER.pageViewTracker("授权页");    

    const act = router.params.id || ''
    const page = router.params.page || ''
    setIsNoActId(act ? false : true)
    setActPage(page)

    const code = router.params.code || ''
    const openid = router.params.openid || ''
    const unionid = router.params.unionid || ''
    const timestamp = router.params.timestamp || ''
    const signature = router.params.signature || ''
    const access_token = router.params.access_token || ''
    const nick_name = router.params.nick_name || ''

    console.log('acl act:', act)
    console.log('acl page:', page)
    console.log('acl code:', code)

    if (act) {            
      if (code) {
        requestLoginData({
          activityId: act,
          code: code,
          timestamp: timestamp,
          signature: signature,
          openid: openid,
          unionid: unionid,
          access_token: access_token,
        })
      } else {
        Taro.UTIL.goToACLAuthWithActId(act)
      }    
    } else {
      console.log('未获取到活动ID')
      setIsShowPage(true);
    }
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [isNoActId, setIsNoActId] = useState(false);
  const [actPage, setActPage] = useState('');

  async function requestLoginData(query) {
    
    const params = {
      ...query 
    }

    const res = await Taro.NETWORK.login(params) 

    const activityId = params.activityId || ''

    if (res.code === 0) {
      const resData = res.data || {}
      userDataHandler(params, resData)
    } else if (res.code === -20004)  {
      // SSO账号不存在
      Taro.HUD.showToastMessage(res.message)
    } else if (res.code === -20005)  {
      // 该积分账号已绑定
      Taro.HUD.showToastMessage(res.message)
    } else if (res.code === -20006)  {
      // 用户账号状态异常
      console.log("用户账号状态异常");
      Taro.ROUTER.redirectTo(`/pages/disable/index?act=${activityId}&status=2`);
    } else if (res.code === -20007)  {
      // 当前不在活动时间
      console.log("当前不在活动时间");
      Taro.ROUTER.redirectTo(`/pages/disable/index?act=${activityId}&status=1`);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 活动处理
  const userDataHandler = (params, resData) => {
    const activityId = params.activityId || ''
    const pointAccountId = resData.pointAccountId || ''
    console.log('活动时间内，账号正常')

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
      act: activityId,
      acc: pointAccountId,
    }
    Taro.UTIL.setPGStorage('activity_info', activityInfo)

    // 活动类型、绑定状态
    const activityData = resData.activity || {}
    const activityType = activityData.activityType || '';
    const isBind = pointAccountId ? true : false;

    // 内部活动
    if (activityType === 'EMPLOYEE') {
      console.log("内部活动")
      if (isBind) {
        console.log("内部-已绑定");
        Taro.UTIL.goToActivityHomeWithActId(activityId, pointAccountId)
      } else {
        console.log("内部-未绑定");
        console.log("内部-sso登录");
        Taro.UTIL.goToSSOLoginWithActId(activityId)           
      }
      return
    }      
    // 外部活动
    if (activityType === 'CUSTOMER') {
      console.log("外部活动")
      if (isBind) {
        console.log("外部-已绑定");
        Taro.UTIL.goToActivityHomeWithActId(activityId, pointAccountId)
      } else {
        console.log("外部-未绑定");
        console.log("进入登录页");
        Taro.ROUTER.redirectTo(`/pages/login/index?act=${activityId}`);
      }
      return
    }
    // 未知活动
    console.log("未知活动")
    Taro.HUD.showToastMessage('未知活动')
  }

  return (
      <>
        {isShowPage ? (
          <View className='index-list'>
            {
              isNoActId ? (
                <View className='index-text'>缺少活动ID</View> 
              ) : null
            }                       
          </View>
        ) : (
          <PGLoading></PGLoading>
        )}
      </>
    );
}
