import { useState } from "react";
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
    const act = router.params.act || ''
    const code = router.params.code || ''    

    console.log('sso act:', act)
    console.log('sso code:', code)

    if (!act) {
      Taro.HUD.showToastMessage('活动ID为空')
      return
    }
    if (!code) {
      Taro.HUD.showToastMessage('code为空')
      return
    }
    
    requestBindActivityIdData(act, code)
  };

  // 绑定账号
  async function requestBindActivityIdData(actId, code) {
    const ssoCallbackUrl = Taro.UTIL.pgConfig().ssoCallbackUrl || ''
    const callbackUrl = `${ssoCallbackUrl}?act=${actId}`
    const url = Taro.UTIL.encodeBaseStr(callbackUrl)
    const params = {
      activityId: actId,
      code: code,
      redirectUri: url
    }

    Taro.HUD.showLoading('绑定中...')
    const res = await Taro.NETWORK.bindActivityId(params) 
    Taro.HUD.hideLoading()

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
      Taro.ROUTER.redirectTo(`/pages/disable/index?act=${actId}&status=2`);
    } else if (res.code === -20007)  {
      // 当前不在活动时间
      console.log("当前不在活动时间");
      Taro.ROUTER.redirectTo(`/pages/disable/index?act=${actId}&status=1`);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 活动处理
  const userDataHandler = (params, resData) => {
    Taro.HUD.showToastMessage('绑定成功')
      
    const activityId = params.activityId || ''
    const pointAccountId = resData.pointAccountId || ''

    // 用户信息
    const loginInfo = resData
    Taro.UTIL.setPGStorage('login_info', loginInfo)	

    // 活动信息
    const activityInfo = {
      act: activityId,
      acc: pointAccountId,
    }
    Taro.UTIL.setPGStorage('activity_info', activityInfo)	

    // 检查用户状态，跳转首页
    setTimeout(() => {
      Taro.UTIL.goToActivityHomeWithActId(activityId, pointAccountId)
    }, 1500);
  }

  return (
    <PGLoading></PGLoading>    
  );
}
