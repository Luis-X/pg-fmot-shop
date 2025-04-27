import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";

export default function Index() {
  const router = useRouter();

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    Taro.WXSDK.hideOptionMenu();
  });

  // FIXME: 服务端提供接口，重定向acl，回调携带id、page、code参数到此页面
  const createdPage = async () => {

    Taro.TRACKER.pageViewTracker("授权页");    

    const act = router.params.id || ''
    const page = router.params.page || ''
    setIsNoActId(act ? false : true)

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

    // 入口信息
    if (page) {
      const pageInfo = {
        actPage: page
      }
      Taro.UTIL.setPGStorage('enter_page', pageInfo)
    }

    // 活动、code
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
        }, page)
      } else {
        Taro.UTIL.goToACLAuthPage({
          actId: act
        })
      }    
    } else {
      // 跳转指定页面
      console.log('未获取到活动ID')
      setIsShowPage(true);     
    }
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [isNoActId, setIsNoActId] = useState(false);

  async function requestLoginData(query, page) {
    
    const params = {
      ...query 
    }

    const res = await Taro.NETWORK.login(params)
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      userDataHandler(params, resData, page)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 活动处理
  const userDataHandler = (params, resData, page) => {

    const activityId = params.activityId || ''
    const pointAccountId = resData.pointAccountId || ''
    console.log('活动时间内，账号正常')

    const activityData = resData.activity || {}

    // 登录信息      
    const token = resData.token || ''
    const tokenInfo = {
      token: token
    }
    Taro.UTIL.setPGStorage('token_info', tokenInfo)    
      
    // 用户信息
    const agreeInfo = {
      agreement: resData.agreement,
      informedConsentForm: activityData.informedConsentForm,
    }
    Taro.UTIL.setPGStorage('agree_info', agreeInfo)
      
    // 活动信息
    const activityInfo = {
      act: activityId,
      acc: pointAccountId,
    }
    Taro.UTIL.setPGStorage('activity_info', activityInfo)

    // 活动类型、绑定状态    
    const activityType = activityData.activityType || '';
    const isBind = pointAccountId ? true : false;

    // 内部活动
    if (activityType === 'EMPLOYEE') {
      console.log("内部活动")
      if (isBind) {
        console.log("内部-已绑定");
        Taro.UTIL.goToActivityPage({
          actId: activityId,
          accId: pointAccountId,
          actPage: page
        })
      } else {
        console.log("内部-未绑定");
        console.log("内部-sso登录");
        // 防止sso回跳绑定，session storage token丢失
        Taro.UTIL.setPGLocalStorage('token_sso', tokenInfo)
        Taro.UTIL.goToSSOLoginPage({
          actId: activityId,
          actPage: page
        })           
      }
      return
    }      
    // 外部活动
    if (activityType === 'CUSTOMER') {
      console.log("外部活动")
      if (isBind) {
        console.log("外部-已绑定");
        Taro.UTIL.goToActivityPage({
          actId: activityId,
          accId: pointAccountId,
          actPage: page
        })
      } else {
        console.log("外部-未绑定");
        console.log("进入登录页");
        Taro.ROUTER.redirectTo(`/pages/login/index?id=${activityId}&page=${page}`);
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
