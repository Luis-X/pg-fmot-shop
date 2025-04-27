import { useState } from "react";
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

  const createdPage = async () => {
    const act = router.params.id || ''
    const page = router.params.page || ''

    const code = router.params.code || ''    

    console.log('sso act:', act)
    console.log('sso page:', page)
    console.log('sso code:', code)

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
        const pageUrl = Taro.UTIL.ssoLoginRedirectUri(act, page)
        requestBindActivityIdData({
          activityId: act,
          code: code,
          redirectUri: pageUrl
        }, page)
      } else {
        Taro.HUD.showToastMessage('code为空')
      }    
    } else {
      Taro.HUD.showToastMessage('活动ID为空')
    }
  };

  // 绑定账号
  async function requestBindActivityIdData(query, page) {

    const params = {
      ...query,
    }

    Taro.HUD.showLoading('绑定中...')
    const res = await Taro.NETWORK.bindActivityId(params) 
    Taro.HUD.hideLoading()

    // 清除token sso，保存token info
    const tokenSSO = Taro.UTIL.getPGLocalStorage('token_sso') || {}
    const token = tokenSSO.token || ''
    const tokenInfo = {
      token: token
    }
    Taro.UTIL.setPGStorage('token_info', tokenInfo)
    Taro.UTIL.clearPGStorage('token_sso')

    if (res.code === 0) {
      const resData = res.data || {}
      userDataHandler(params, resData, page)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 活动处理
  const userDataHandler = (params, resData, page) => {
    Taro.HUD.showToastMessage('绑定成功')
      
    const activityId = params.activityId || ''
    const pointAccountId = resData.pointAccountId || ''

    // 用户信息
    const agreeInfo = {
      agreement: resData.agreement,
      informedConsentForm: resData.informedConsentForm,
    }
    Taro.UTIL.setPGStorage('agree_info', agreeInfo)

    // 活动信息
    const activityInfo = {
      act: activityId,
      acc: pointAccountId,
    }
    Taro.UTIL.setPGStorage('activity_info', activityInfo)

    // 检查用户状态，跳转首页
    setTimeout(() => {
      Taro.UTIL.goToActivityPage({
        actId: activityId,
        accId: pointAccountId,
        actPage: page
      })
    }, 1500);
  }

  return (
    <PGLoading></PGLoading>    
  );
}
