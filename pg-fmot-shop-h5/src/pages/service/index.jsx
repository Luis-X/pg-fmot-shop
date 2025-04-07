import { useState } from 'react'
import { Image } from "@nutui/nutui-react";
import { View } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.scss'

import PGAlertPrivacy from '../../components/pgAlertPrivacy/index'
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
  }

  const [isShowPage, setIsShowPage] = useState(false)

  return (
    <>
      {
        isShowPage ? (
          <View className='pg-index'>       
            <View className='service-list'>  
              <Image className='service-bg-img' fit='fill' src={imgBG}></Image> 
              <View className='service-wrap'>                
                <View className='service-content'>
                  <View className='service-content-item'>
                    <Image className='service-content-icon' fit='contain' src={imgPhone}></Image>
                    <View className='service-content-text'>联系电话：13188998899</View>
                  </View>
                  <View className='service-content-item'>
                    <Image className='service-content-icon' fit='contain' src={imgAddress}></Image>
                    <View className='service-content-text'>联系地址：辽宁省大连市高新园区万达广场一单元1901</View>
                  </View>
                </View>
                <Image className='service-img' fit='contain' src={imgIcon}></Image> 
              </View>
            </View>
            <PGAlertPrivacy></PGAlertPrivacy>
          </View>
        ) : (
          <PGLoading></PGLoading>
        )
      }     
    </> 
  )
}
