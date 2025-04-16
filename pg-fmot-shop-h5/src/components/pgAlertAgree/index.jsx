import { useState, useEffect } from 'react'
import { Overlay, Image } from '@nutui/nutui-react'
import { View } from '@tarojs/components'
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

  const [isAlertShow, setIsAlertShow] = useState(false)

  const checkAgreementStatus = () => {
    const isAgreeShow = Taro.UTIL.checkAgreementStatusShow()
    if (isAgreeShow) {
      setIsAlertShow(true)
    } else {
      setIsAlertShow(false)
    }
  }

  // 确定
  const clickConfirm = () => {
    requestAgreeData()
  }

  async function requestAgreeData() {

    const res = await Taro.NETWORK.agreeAgreement({}) 

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
          <Image className='alert-img' fit='contain' src={imgStar}></Image>
          <View className='text-title'>请同意协议条款</View>
          <View className='text-scroll'>请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。请查看最新条款内容，以继续使用会员权益。</View>              
          <View className='confirm-btn' onClick={() => clickConfirm()}>同意</View>                              
        </View>              
      </View>            
    </Overlay>
  )
}
