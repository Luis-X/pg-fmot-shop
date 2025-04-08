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
    console.log('privacy alert loaded.')
  })

  useEffect(() => {
    console.log('privacy alert effect.') 
  }, []);

  
  const [isShow, setIsShow] = useState(true)

  function showPrivacyAlert(isNeedShow) {    
    setIsShow(isNeedShow)
  }

  // 确定
  const clickConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm()
    } 

    showPrivacyAlert(false)
  }

  async function requestPostTermsData() {
    const timestamp = Date.parse(new Date())
    const params = {
      creatime: timestamp,
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.modifyAccountsTerms(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) { 
      Taro.UTIL.setPGStorage('ok_newTerm', '1')
      showPrivacyAlert(false)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }  
  }

  return (
    <Overlay visible={isShow}>
      <View className='pg-privacy-alert-wrap'>
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
