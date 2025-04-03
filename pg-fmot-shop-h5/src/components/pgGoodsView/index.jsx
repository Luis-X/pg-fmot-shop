import { useEffect } from 'react'
import { Tag, Image } from "@nutui/nutui-react";
import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index(props) {

  const { item } = props

  useLoad(() => {
    console.log('goods view loaded.')
  })

  useEffect(() => {
    console.log('goods view effect.') 
  }, []);

   // 商品详情
   const clickGoods = () => {
    Taro.ROUTER.navigateTo('/pages/detail/index');
  }

  return (
    <View className='pg-goods-wrap' onClick={clickGoods}>
      <Image className='goods-img' src={item.src} fit='cover'></Image>
      <Text className='goods-name'>{item.title}</Text>
      <View className='goods-price-wrap'>
        <View className='goods-price-new-wrap'>
          <View className='goods-price-new'>{item.vipPrice}</View>
          <View className='goods-price-new-unit'>积分</View>
        </View>       
        {
          item.price && (
            <View className='goods-price-old'>{item.price}积分</View>
          )
        }        
      </View>          
      <View className='goods-tag-wrap'>
        <Tag className='goods-tag' plain background='#B46820'>{item.shopDescription}</Tag>
        <Tag className='goods-tag' plain background='#B46820'>{item.delivery}</Tag>        
      </View>
    </View>
  )
}
