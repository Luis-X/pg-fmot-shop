import { useState } from 'react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad, useUnload, useRouter, useDidShow } from '@tarojs/taro'
import './index.scss'

import PGLoading from "../../components/pgLoading/index";

import imgBG from '../../images/service-bg.png';
import imgIcon from '../../images/service-icon.png';
import imgPhone from '../../images/service-phone.png';
import imgAddress from '../../images/service-address.png';


export default function Index() {

  const router = useRouter()

  useLoad(() => {   
    Taro.WXSDK.hideOptionMenu()    
    setTimeout(() => {
      createdPage();
    }, 1000);
  })

  useUnload(() => {
    Taro.UTIL.clearPGStorage('service_info')
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

    const act = router.params.act || ''
    const acc = router.params.acc || ''
    setActId(act)
    setAccId(acc)

    configServiceInfo({
      activityId: act,
      pointAccountId: acc,
    })
  }

  const [isShowPage, setIsShowPage] = useState(false)
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [serviceInfo, setServiceInfo] = useState([])

  // request
  function configServiceInfo(query) {
   const serviceInfo = Taro.UTIL.getPGStorage('service_info')
   setServiceInfo(serviceInfo)
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
                    <View className='service-content-text'>{serviceInfo.contactCustomerServiceInfo}</View>
                  </View>
                  <View className='service-content-item'>
                    <Image className='service-content-icon' mode='aspectFit' src={imgAddress}></Image>
                    <View className='service-content-text'>{serviceInfo.contactCustomerServiceInfo}</View>
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
