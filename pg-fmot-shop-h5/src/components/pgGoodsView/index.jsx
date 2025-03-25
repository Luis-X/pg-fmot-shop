import { useEffect } from 'react'
import { Tag, Image, Price } from "@nutui/nutui-react";
import { View } from '@tarojs/components'
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
      <View className='goods-name'>{item.title}</View>
      <View className='goods-price-wrap'>
        <Price className='goods-price-new' price={item.vipPrice} size='normal' symbol='积分' digits={0} position='after'></Price>
        {
          item.price && (
            <Price className='goods-price-old' price={item.price} line size='small' symbol='积分' digits={0} position='after'></Price>
          )
        }        
      </View>          
      <View className='goods-tag-wrap'>
        <Tag className='goods-tag' type='primary'>{item.shopDescription}</Tag>
        <Tag className='goods-tag' type='primary'>{item.delivery}</Tag>        
      </View>
    </View>
  )
}
