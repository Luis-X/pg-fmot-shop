import { useState, useEffect } from 'react'
import { Overlay } from '@nutui/nutui-react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

import ASSET_IMG from '../../utils/assetImg.js'

const imgBG = ASSET_IMG.assetImgWithName('alert-bg.png')
import imgStar from "../../images/alert-star.png";

export default function Index(props) {
  useLoad(() => {
    console.log('agree alert loaded.')
  })

  useEffect(() => {
    console.log('agree alert effect.') 
    checkAgreementStatus()    
  }, []);

  // 弹框
  const [isAlertShow, setIsAlertShow] = useState(false)
  const [contentText, setContentText] = useState('')

  const checkAgreementStatus = () => {
    const loginInfo = Taro.UTIL.getPGStorage('login_info')
    const isAgree = loginInfo.agreement;
    const contentText = loginInfo.informedConsentForm || '';
    if (isAgree) {
      console.log("已同意协议");
      setIsAlertShow(false)
    } else {
      console.log("未同意协议");
      setContentText(contentText)
      setIsAlertShow(true)
    }
  }

  // 确定
  const clickConfirm = () => {
    requestAgreeData()
  }

  async function requestAgreeData() {
    const activityInfo = Taro.UTIL.getPGStorage('activity_info')
    const act = activityInfo.act || ''
    const acc = activityInfo.acc || ''

    const params = {
      activityId: act,
      pointAccountId: acc,
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.agreeAgreement(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) { 
      setIsAlertShow(false)

      let loginInfo = Taro.UTIL.getPGStorage('login_info') || {}
      loginInfo.agreement = true
      Taro.UTIL.setPGStorage('login_info', loginInfo)	

      if (props.onConfirm) {
        props.onConfirm()
      } 
    } else {
      Taro.HUD.showToastMessage(res.message)
    }  
  }

  return (
    <Overlay visible={isAlertShow}>
      <View className='pg-agree-alert-wrap'>
        <View className='alert-content'>
          <Image className='alert-img' mode='aspectFit' src={imgStar}></Image>
          <View className='text-title'>请同意协议条款</View>
          <View className='text-scroll'>{contentText}</View>              
          <View className='confirm-btn' onClick={() => clickConfirm()}>同意</View>                              
        </View>              
      </View>            
    </Overlay>
  )
}
