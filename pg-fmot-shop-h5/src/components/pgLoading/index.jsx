import { useEffect } from 'react'
import { Loading } from "@nutui/nutui-react";
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index(props) {

  const { errMsg } = props

  useLoad(() => {
    console.log('loading loaded.')
  })

  useEffect(() => {
    console.log('loading effect.') 
  }, []);

  return (
    <View className='pg-load'>
      {
        errMsg ? (
          <View className='pg-load-err-msg'>{errMsg}</View>
        ) : (
          <Loading direction='vertical'>加载中</Loading>
        )
      }     
    </View>
  )
}
