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

  return (
    <View className='pg-order-bg-wrap' onClick={onClick}>
      <View className='pg-order-wrap'>
        <View className='pg-order-num'>{`订单编号：${orderInfo.orderId}`}</View>
        <View className='pg-order-date'>{`下单时间：${orderInfo.orderCreateTime}`}</View>
        <View className='pg-order-status'>{orderInfo.orderStatus}</View>
        {orderInfo.goodsList.map((item, index) => {
          return (
            <View className='pg-order-goods-wrap' key={index}>
              <Image className='pg-order-goods-img' src={item.src} fit='cover'></Image>
              <View className='pg-order-goods-info'>
                <View className='pg-order-goods-name'>{item.title}</View>
                <View className='pg-order-goods-price'>{`${item.price}积分`}</View>
              </View>
              <View className='pg-order-goods-count'>{`x${item.num}`}</View>
            </View>
          );
        })}
        <View className='pg-order-total-wrap'>
          <View className='pg-order-total-count'>{`共计${orderInfo.totalNum}件商品`}</View>
          <View className='pg-order-total-amount'>{`合计${orderInfo.totalAmount}积分`}</View>
        </View>
      </View>
    </View>    
  )
}