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
    console.log('clickGoods', item);
    const activityId = item.id || '';
    const productId = item.product.id || '';
    Taro.ROUTER.navigateTo(`/pages/detail/index?activityId=${activityId}&id=${productId}`);
  }

 

  return (
    <View className='pg-goods-wrap' onClick={() => clickGoods()}>
      <Image className='goods-img' src={item.product.previewUrl} fit='cover'></Image>
      <Text className='goods-name'>{item.product.name}</Text>
      <View className='goods-price-wrap'>
        <View className='goods-price-new-wrap'>
          <View className='goods-price-new'>{item.discountPrice}</View>
          <View className='goods-price-new-unit'>积分</View>
        </View>       
        {
          item.product.price && (
            <View className='goods-price-old'>{item.product.price}积分</View>
          )
        }        
      </View>          
      <View className='goods-tag-wrap'>
        {
          Taro.UTIL.configLabelTagList(item.product.label).map((text, index) => {
            return (
              <Tag key={index} className='goods-tag' plain background='#B46820'>{text}</Tag>
            )
          })
        }      
      </View>
    </View>
  )
}
