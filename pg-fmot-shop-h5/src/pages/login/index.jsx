import { act, useState } from 'react'
import { Input } from '@nutui/nutui-react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad, useRouter, useDidShow } from '@tarojs/taro'
import './index.scss'

import PGLoading from "../../components/pgLoading/index";

import ASSET_IMG from '../../utils/assetImg.js'

const imgBG = ASSET_IMG.assetImgWithName('login-bg.png')
const imgTitle = ASSET_IMG.assetImgWithName('login-title.png')
const imgBtnBind = ASSET_IMG.assetImgWithName('login-btn-bind.png')
const imgBtnLogin = ASSET_IMG.assetImgWithName('login-btn-login.png')

export default function Index() {

  const router = useRouter()

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });
  
  useDidShow(() => {
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    setIsShowPage(true);

    const act = router.params.id || ''
    const actPage = router.params.page || ''  

    console.log('login act:', act)
    console.log('login page:', actPage)

    setActId(act)
    setActPageId(actPage)
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [actPageId, setActPageId] = useState('');

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
      const resData = res.data || {}
      userDataHandler(resData)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 活动处理
  const userDataHandler = (resData) => {
    Taro.HUD.showToastMessage('绑定成功')
      
    const activityId = actId || ''
    const pointAccountId = resData.pointAccountId || ''

    // 用户信息
    const agreeInfo = {
      act: activityId,
      acc: pointAccountId,
      agreement: resData.agreement,
      informedConsentForm: resData.informedConsentForm,
    }
    Taro.UTIL.setPGStorage('agree_info', agreeInfo)

    // 检查用户状态，跳转首页
    setTimeout(() => {
      Taro.UTIL.goToActivityPage({
        actId: activityId,
        accId: pointAccountId,
        actPage: actPageId
      })
    }, 1500);
  }

  // 内部登录
  const clickInternalLogin = () => {
    if (!actId) {
      Taro.HUD.showToastMessage('活动ID为空')
      return
    }
    Taro.UTIL.goToSSOLoginPage({
      actId: actId,
      actPage: actPageId
    })
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
