import { act, useState } from 'react'
import { Input } from '@nutui/nutui-react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad, useRouter, useDidShow } from '@tarojs/taro'
import './index.scss'

import ASSET_IMG from '../../utils/assetImg.js'

import PGLoading from "../../components/pgLoading/index";

// const imgBG = ASSET_IMG.assetImgWithName('login-bg.png')
import imgBG from '../../images/login-bg.png';
import imgTitle from '../../images/login-title.png';
import imgBtnBind from '../../images/login-btn-bind.png';
import imgBtnLogin from '../../images/login-btn-login.png';

export default function Index() {

  const router = useRouter()

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

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("登录");
    setIsShowPage(true);

    const act = router.params.id || ''
    setActId(act)
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');

  // 确认绑定
  const clickBindConfirm = () => {
    if (!actId) {
      Taro.HUD.showToastMessage('活动ID为空')
      return
    }
    if (!inputValue) {
      Taro.HUD.showToastMessage('请输入您的账号')
      return
    }
    requestBindActivityIdData()
  }

  // 绑定账号
   async function requestBindActivityIdData() {
    const params = {
      activityId: actId,
      activityAccount: inputValue,
    }

    Taro.HUD.showLoading('绑定中...')
    const res = await Taro.NETWORK.bindActivityId(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      Taro.HUD.showToastMessage('绑定成功')
      const resData = res.data || {}
      const accId = resData.pointAccountId || ''

      // 用户信息
      const loginInfo = resData
      Taro.UTIL.setPGStorage('login_info', loginInfo)	

      // 活动信息
      const activityInfo = {
        act: actId,
        acc: accId,
      }
      Taro.UTIL.setPGStorage('activity_info', activityInfo)	

      // 检查用户状态，跳转首页
      setTimeout(() => {
        Taro.UTIL.goToActivityHomeWithActId(actId, accId)
      }, 1500);      
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 内部登录
  const clickInternalLogin = () => {
    if (!actId) {
      Taro.HUD.showToastMessage('活动ID为空')
      return
    }
    Taro.UTIL.goToSSOLoginWithActId(actId)
  }

  // 账号输入
  const [inputValue, setInputValue] = useState('')
  const inputOnChange = (val) => {
    console.log(val)
    setInputValue(val)
  }

  return (
    <>
      {isShowPage ? (
        <View className='login-list'>
          <Image className='login-bg-img' mode='aspectFill' src={imgBG}></Image>
          <View className='login-wrap'>
            <Image className='login-title-img' mode='aspectFit' src={imgTitle}></Image>
            <Input 
              className='login-input' 
              placeholder='请输入您的账号登录' 
              clearable 
              onChange={inputOnChange} 
            />
            <View className='login-desc'>（注意：同一活动内只能绑定1个账号，绑定后无法解绑，请使用本人微信进行绑定。）</View>
            <View className='login-btn-bind-wrap' onClick={clickBindConfirm}>
              <Image className='login-btn-bind-img' mode='aspectFit' src={imgBtnBind}></Image>
              <View className='login-btn-bind-text-wrap'>
                <View className='login-btn-bind-text'>确认绑定并查看活动</View>
              </View>              
            </View>                                 
          </View>     
          <Image className='login-btn-login' mode='aspectFill' src={imgBtnLogin} onClick={clickInternalLogin}></Image>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
