import { useState } from 'react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.scss'

import PGLoading from "../../components/pgLoading/index";

import imgBG from '../../images/service-bg.png';
import imgIcon from '../../images/service-icon.png';
import imgPhone from '../../images/service-phone.png';
import imgAddress from '../../images/service-address.png';


export default function Index() {

  useLoad(() => {   
    Taro.WXSDK.hideOptionMenu()    
    setTimeout(() => {
      createdPage();
    }, 1000);
  })

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker('客服')
    }
    Taro.WXSDK.hideOptionMenu()
  })

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker('客服')
    setIsShowPage(true)

    requestData()
  }

  const [isShowPage, setIsShowPage] = useState(false)
  const [serviceInfo, setServiceInfo] = useState([])

  // request
  async function requestData(id) {
    const params = {
      id: id
    }

    const res = await Taro.NETWORK.serviceInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setServiceInfo(resData)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  return (
    <>
      {
        isShowPage ? (
          <View className='pg-index'>       
            <View className='service-list'>  
              <Image className='service-bg-img' mode='aspectFill' src={imgBG}></Image> 
              <View className='service-wrap'>                
                <View className='service-content'>
                  <View className='service-content-item'>
                    <Image className='service-content-icon' mode='aspectFit' src={imgPhone}></Image>
                    <View className='service-content-text'>{serviceInfo.phone}</View>
                  </View>
                  <View className='service-content-item'>
                    <Image className='service-content-icon' mode='aspectFit' src={imgAddress}></Image>
                    <View className='service-content-text'>{serviceInfo.address}</View>
                  </View>
                </View>
                <Image className='service-img' mode='aspectFit' src={imgIcon}></Image> 
              </View>
            </View>
          </View>
        ) : (
          <PGLoading></PGLoading>
        )
      }     
    </> 
  )
}
