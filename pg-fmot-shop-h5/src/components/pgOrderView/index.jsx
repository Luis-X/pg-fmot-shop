import { useEffect } from 'react'
import { Image as ImageNut } from "@nutui/nutui-react";
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index(props) {

  const { scenceType, orderInfo, act, acc, onClick } = props

  useLoad(() => {
    // console.log('order view loaded.')
  })

  useEffect(() => {
    // console.log('order view effect.') 
  }, []);

  // 商品详情
  const clickGoods = (item) => {
    if (scenceType === 'order-detail') {
      // const productId = item.activityProductId || '';
      // const actId = act || ''
      // const accId = acc || '' 
      // Taro.ROUTER.navigateTo(`/pages/detail/index?act=${actId}&acc=${accId}&id=${productId}`);
    }    
  }

  // 积分展示
  const priceView = (item) => {
    const isDiscount = item.hasDiscount;
    const discountPrice = item.discountPrice
    const price = item.originalPrice
    let result = null;
    if (isDiscount) {
      result = (
        <>
          <View className='pg-order-goods-price-old'>{price}积分</View>
          <View className='pg-order-goods-price-wrap'>
            <View className='pg-order-goods-price'>{discountPrice}</View>
            <View className='pg-order-goods-price-unit'>积分</View>
          </View>
        </>        
      )
    } else {
      result = (
        <View className='pg-order-goods-price-wrap'>
          <View className='pg-order-goods-price'>{price}</View>
          <View className='pg-order-goods-price-unit'>积分</View>
        </View>
      )
    }
    return result
  }

  // 商品列表
  const goodsListView = () => {
    const cartList = orderInfo.orderItems || [];
    return (
      <>
        {
          cartList.map((item, index) => {
            const productData = item.product || {}
            return (
              <View className='pg-order-goods-wrap' key={index}>
                <ImageNut className='pg-order-goods-img' src={productData.previewUrl} fit='cover' lazy={false} loading={false} onClick={() => clickGoods(item)}/>
                <View className='pg-order-goods-info' onClick={() => clickGoods(item)}>
                  <View className='pg-order-goods-name'>{productData.name}</View>
                  {priceView(item)}
                  <View className='pg-order-goods-count'>{`x${item.quantity}`}</View>
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
            <View className='pg-order-num'>{`订单编号：${orderInfo.orderCode}`}</View>
            <View className='pg-order-date'>{`下单时间：${Taro.UTIL.dateFormatter(orderInfo.createDate, 'YYYY年MM月DD日 HH:mm:ss')}`}</View>
          </View>          
          {
            orderInfo.orderStatus === 'COMPLETED' ? (
              <View className='pg-order-status'>交易成功</View>
            ) : null
          }
          {
            orderInfo.orderStatus === 'CANCELED' ? (
              <View className='pg-order-status-cancel'>已取消</View>
            ) : null
          }
        </View>       
        {goodsListView()}
        <View className='pg-order-total-wrap'>
          <View className='pg-order-total-count'>{`共计${orderInfo.totalCount}件商品`}</View>
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