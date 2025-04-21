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

  // 是否显示弹框
  const [isAlertShow, setIsAlertShow] = useState(false)
  const checkAgreementStatus = () => {
    const isAgreeShow = Taro.UTIL.checkAgreementStatusShow()
    if (isAgreeShow) {      
      requestData()
    } else {
      setIsAlertShow(false)
    }
  }

  // 弹框内容
  const [contentText, setContentText] = useState('')
  async function requestData(activityId) {
    const params = {
      activityId: activityId
    }

    const res = await Taro.NETWORK.activityAlert(params) 

    if (res.code === 0) {
      const resData = res.data || {}
      setContentText(resData.activity.alertText)
      setIsAlertShow(true)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 确定
  const clickConfirm = () => {
    requestAgreeData()
  }

  async function requestAgreeData() {

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.agreeAgreement({}) 
    Taro.HUD.hideLoading()

    if (res.code === 0) { 
      setIsAlertShow(false)

      let userData = Taro.UTIL.getPGStorage('login_info') || {}
      userData.agreement = true
      Taro.UTIL.setPGStorage('login_info', userData)	

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
