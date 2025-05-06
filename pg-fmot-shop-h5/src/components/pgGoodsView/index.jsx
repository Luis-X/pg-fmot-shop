import { useEffect } from 'react'
import { Image as ImageNut } from "@nutui/nutui-react";
import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index(props) {

  const { item, act, acc } = props

  useLoad(() => {
    console.log('goods view loaded.')
  })

  useEffect(() => {
    console.log('goods view effect.') 
  }, []);

   // 商品详情
   const clickGoods = () => {   
    const productId = item.id || '';
    const actId = act || ''
    const accId = acc || ''

    Taro.ROUTER.navigateTo(`/pages/detail/index?act=${actId}&acc=${accId}&id=${productId}`);
  }

  // 积分展示
  const priceView = () => {
    const isDiscount = item.discountPrice ? true : false;
    const discountPrice = item.discountPrice 
    const productData = item.product || {}
    const price = productData.price
    let result = null;
    if (isDiscount) {
      result = (
        <>
          <View className='goods-price-new-wrap'>
            <View className='goods-price-new'>{discountPrice}</View>
            <View className='goods-price-new-unit'>积分</View>
          </View>              
          <View className='goods-price-old'>{price}积分</View>
        </>       
      )
    } else {
      result = (
        <View className='goods-price-new-wrap'>
          <View className='goods-price-new'>{price}</View>
          <View className='goods-price-new-unit'>积分</View>
        </View>
      )
    }
    return result
  }

  const goodsView = () => {
    const productData = item.product || {}
    return (
      <View className='pg-goods-wrap' onClick={() => clickGoods()}>
        <ImageNut className='goods-img' src={productData.previewUrl} fit='cover' lazy={false} loading={false}/>
        <Text className='goods-name'>{productData.name}</Text>
        <View className='goods-price-wrap'>
          {priceView()}
        </View>          
        <View className='goods-tag-wrap'>
          {
            Taro.UTIL.configLabelTagList(productData.label).map((text, index) => {
              return (
                <View key={index} className='goods-tag' plain background='#B46820'>
                  <View className='goods-tag-text'>{text}</View>
                </View>
              )
            })
          }      
        </View>
      </View>
    )
  }
  return (
    <>    
      {goodsView()}
    </>
  )
}
