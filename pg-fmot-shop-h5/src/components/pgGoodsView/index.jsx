import { useEffect } from 'react'
import { Tag, Image as ImageNut } from "@nutui/nutui-react";
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
    console.log('clickGoods', item);    
    const productId = item.product.id || '';
    const actId = act || ''
    const accId = acc || ''

    Taro.ROUTER.navigateTo(`/pages/detail/index?act=${actId}&acc=${accId}&id=${productId}`);
  }

  // 积分展示
  const priceView = (product) => {
    const isDiscountPrice = product.discountPrice;
    let result = null;
    if (isDiscountPrice) {
      result = (
        <>
          <View className='goods-price-new-wrap'>
            <View className='goods-price-new'>{product.discountPrice}</View>
            <View className='goods-price-new-unit'>积分</View>
          </View>              
          <View className='goods-price-old'>{product.price}积分</View>
        </>       
      )
    } else {
      result = (
        <View className='goods-price-new-wrap'>
          <View className='goods-price-new'>{product.price}</View>
          <View className='goods-price-new-unit'>积分</View>
        </View>
      )
    }
    return result
  }

  const goodsView = () => {
    const product = item.product || {}
    return (
      <View className='pg-goods-wrap' onClick={() => clickGoods()}>
      <ImageNut className='goods-img' src={product.previewUrl} fit='cover' lazy loading={true}/>
      <Text className='goods-name'>{product.name}</Text>
      <View className='goods-price-wrap'>
        {priceView(product)}            
      </View>          
      <View className='goods-tag-wrap'>
        {
          Taro.UTIL.configLabelTagList(product.label).map((text, index) => {
            return (
              <Tag key={index} className='goods-tag' plain background='#B46820'>{text}</Tag>
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
