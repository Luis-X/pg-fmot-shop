import { useState } from 'react'
import { Cell } from '@nutui/nutui-react'
import { View } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.scss'

import PGAlertPrivacy from '../../components/pgAlertPrivacy/index'
import PGLoading from "../../components/pgLoading/index";

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
              <Cell.Group divider className='service-wrap'>
                <Cell className='service-item' title='联系电话：' extra='400-020-9900' />
                <Cell className='service-item' title='联系地址：' extra='北京市海淀区西小口路66号东升科技园C4，100192' />
              </Cell.Group>            
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
