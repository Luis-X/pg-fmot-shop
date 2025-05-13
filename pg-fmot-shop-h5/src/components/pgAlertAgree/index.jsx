import { useState, useEffect } from 'react'
import { Overlay } from '@nutui/nutui-react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

import ASSET_IMG from '../../utils/assetImg.js'

const imgStar = ASSET_IMG.assetImgWithName('alert-star.png')

export default function Index(props) {
  useLoad(() => {
    // console.log('agree alert loaded.')
  })

  useEffect(() => {
    // console.log('agree alert effect.') 
    checkAgreementStatus()    
  }, []);

  // 弹框
  const [isAlertShow, setIsAlertShow] = useState(false)
  const [contentText, setContentText] = useState('')

  const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
  };

  const checkAgreementStatus = () => {
    const agreeInfo = Taro.UTIL.getPGStorage('agree_info')
    if (isEmpty(agreeInfo)) {
      console.log("无协议信息");
      return;
    }
    const isAgree = agreeInfo.agreement;
    const contentText = agreeInfo.informedConsentForm || '';
    if (isAgree) {
      console.log("已同意协议");
      setIsAlertShow(false)
    } else {
      console.log("未同意协议");
      setContentText(contentText)
      setTimeout(() => {
        setIsAlertShow(true)
      }, 800);      
    }
  }

  // 确定
  const clickConfirm = () => {
    requestAgreeData()
  }

  async function requestAgreeData() {
    const agreeInfo = Taro.UTIL.getPGStorage('agree_info')
    const act = agreeInfo.act || ''
    const acc = agreeInfo.acc || ''

    const params = {
      activityId: act,
      pointAccountId: acc,
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.agreeAgreement(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) { 
      setIsAlertShow(false)
      
      Taro.UTIL.clearPGStorage('agree_info')	

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
          <View className='confirm-btn' onClick={() => clickConfirm()}>
            <View className='confirm-btn-text'>同意</View>
          </View>                              
        </View>              
      </View>            
    </Overlay>
  )
}
