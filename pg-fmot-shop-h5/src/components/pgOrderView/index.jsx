import { useEffect } from 'react'
import { Image } from "@nutui/nutui-react";
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index(props) {

  const { orderInfo, onClick } = props

  useLoad(() => {
    console.log('order view loaded.')
  })

  useEffect(() => {
    console.log('order view effect.') 
  }, []);

  // 商品列表
  const goodsListView = () => {
    const cartList = orderInfo.goodsList || [];
    return (
      <>
        {
          cartList.map((item, index) => {
            return (
              <View className='pg-order-goods-wrap' key={index}>
                <Image className='pg-order-goods-img' src={item.src} fit='cover'></Image>
                <View className='pg-order-goods-info'>
                  <View className='pg-order-goods-name'>{item.title}</View>
                  <View className='pg-order-goods-price-old'>{item.price}积分</View>
                  <View className='pg-order-goods-price-wrap'>
                    <View className='pg-order-goods-price'>{item.vipPrice}</View>
                    <View className='pg-order-goods-price-unit'>积分</View>
                  </View>
                  <View className='pg-order-goods-count'>{`x${item.num}`}</View>
                </View>
                <View className='pg-order-goods-line'></View>
              </View>
            );
          })
        }
      </>
    )
  };

  return (
    <View className='pg-order-bg-wrap' onClick={onClick}>
      <View className='pg-order-wrap'>
        <View className='pg-order-info-wrap'>
          <View className='pg-order-num-wrap'>
            <View className='pg-order-num'>{`订单编号：${orderInfo.orderId}`}</View>
            <View className='pg-order-date'>{`下单时间：${orderInfo.orderCreateTime}`}</View>
          </View>          
          <View className='pg-order-status'>{orderInfo.orderStatus}</View>
        </View>       
        {goodsListView()}
        <View className='pg-order-total-wrap'>
          <View className='pg-order-total-count'>{`共计${orderInfo.totalNum}件商品`}</View>
          <View className='pg-order-total-price-wrap'>
            <View className='pg-order-total-price-text'>合计</View>
            <View className='pg-order-total-price-red'>{orderInfo.totalAmount}</View>
            <View className='pg-order-total-price-text'>积分</View>
          </View>
        </View>
      </View>
    </View>    
  )
}