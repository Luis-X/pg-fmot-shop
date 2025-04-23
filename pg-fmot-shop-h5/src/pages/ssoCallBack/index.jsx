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
    const code = router.params.code || ''
    const act = router.params.act || ''
    console.log("sso callback code", code);
    console.log("sso callback act", act);

    // allHandler()
  };

  // sso回调，处理
  const allHandler = () => {
    const isAvailableEmail = true;
    if (isAvailableEmail) {
      console.log("内部-邮箱可用");
      requestBindOpenIdData();
    } else {
      console.log("内部-邮箱不可用");
      console.log("暂不符合活动资格");
      Taro.ROUTER.navigateTo("/pages/disable/index?status=2");
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
        Taro.UTIL.checkUserStatusGoHome()
      }, 1500);      
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  return (
    <PGLoading></PGLoading>    
  );
}
