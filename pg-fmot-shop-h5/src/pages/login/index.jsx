import { useState } from 'react'
import { Input, Button } from '@nutui/nutui-react'
import { View } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.scss'

import PGAlertPrivacy from "../../components/pgAlertPrivacy/index";
import PGLoading from "../../components/pgLoading/index";

export default function Index() {

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });
  
  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("登录");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const isWhiteUser = true; // 是否是白名单用户
  const isBindOpenId = true; // 是否绑定了openid

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("登录");
    setIsShowPage(true);
  };

  const [isShowPage, setIsShowPage] = useState(false);

  // 确认绑定
  const clickBindConfirm = () => {
    if (!inputValue) {
      Taro.HUD.showToastMessage('请输入您的账号')
      return
    }

    if (isWhiteUser) {
      if (isBindOpenId) {
        console.log("白名单用户，已绑定");
        Taro.UTIL.goToActivityHomeWithId()
      } else {
        console.log("白名单用户，未绑定");
        requestBindUserData()
      }
    } else {
      Taro.HUD.showToastMessage('账号不正确')
    }
  }

  // 绑定账号
  const requestBindUserData = () => {
    const isSuccess = inputValue === '123456';

    Taro.HUD.showLoading('绑定中...');
    setTimeout(() => {
      
      Taro.HUD.hideLoading();
      if (isSuccess) {
        Taro.HUD.showToastMessage('绑定成功')
        setTimeout(() => {
          Taro.UTIL.goToActivityHomeWithId()
        }, 2000);        
      } else {
        Taro.HUD.showToastMessage('绑定失败')
      }
      
    }, 1000);        
  }

  // 内部登录
  const clickInternalLogin = () => {
    console.log("内部-sso登录");
    Taro.HUD.showToastMessage("内部-sso登录");
  }

  // 账号输入
  const [inputValue, setInputValue] = useState('')
  const inputOnChange = (val) => {
    setInputValue(val)
  }

  return (
    <>
      {isShowPage ? (
        <View className='login-list'>
          <View className='login-wrap'>
            <Input className='login-input' placeholder='请输入您的账号登录' onChange={inputOnChange} />
            <View className='login-desc'>注意：同一活动只能绑定1个账号，绑定后无法解绑，请使用本人微信进行绑定。</View>
            <Button className='login-btn-bind' onClick={clickBindConfirm}>确认绑定并查看活动</Button>
            <View className='login-btn-login' onClick={clickInternalLogin}>内部用户登录</View>
          </View>     
          <PGAlertPrivacy></PGAlertPrivacy> 
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
