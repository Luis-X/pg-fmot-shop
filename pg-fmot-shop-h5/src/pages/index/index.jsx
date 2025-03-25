import { useState } from "react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertPrivacy from "../../components/pgAlertPrivacy/index";
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

  const [isShowPage, setIsShowPage] = useState(false);

  const activityType = router.params.type; // 1内部活动，2外部活动
  const isBlockUser = false; // 是否被锁定
  const isAvailable = true; // 是否在活动时间内
  const isBindOpenId = false; // 是否绑定了openid
  const isInternalUser = false; // 是否绑定了内部用户
  const isExternalUser = false; // 是否绑定了外部用户

  const createdPage = async () => {
    setIsShowPage(true);
    if (activityType === "1") {
      console.log("内部活动");
      if (checkActivityStatus()) {
        internalHandler();
      }
    } else {
      console.log("外部活动");
      if (checkActivityStatus()) {
        externalHandler();
      }
    }
  };

  // 检查活动状态
  const checkActivityStatus = () => {
    if (isAvailable) {
      console.log("活动时间内");
      return true;
    } else {
      console.log("不在活动时间内");
      Taro.ROUTER.navigateTo("/pages/disable/index?status=1");
      return false;
    }
  };

  // 内部活动
  const internalHandler = () => {
    if (isBindOpenId) {
      Taro.UTIL.goToActivityHomeWithId()
    } else {
      console.log("内部-sso登录");
      Taro.HUD.showToastMessage("内部-sso登录");
    }
  };

  // 外部活动
  const externalHandler = () => {
    if (isInternalUser) {
      console.log("内部用户");
      Taro.UTIL.goToActivityHomeWithId()
    } else if (isExternalUser) {
      console.log("外部用户");
      Taro.UTIL.goToActivityHomeWithId()
    } else {
      console.log("外部-登录页");
      Taro.ROUTER.navigateTo("/pages/login/index");
    }
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PGAlertPrivacy></PGAlertPrivacy>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
