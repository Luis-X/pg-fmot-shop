import { useEffect } from 'react'
import { Overlay } from '@nutui/nutui-react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

import ASSET_IMG from '../../utils/assetImg.js'

const imgBG = ASSET_IMG.assetImgWithName('alert-bg.png')
import imgCart from "../../images/alert-cart.png";
import imgLight from "../../images/alert-light.png";

export default function Index(props) {

  const { styleType, show, title, desc, goodsList, confirmText, cancelText } = props;
  const goodsListArray = goodsList || [];

  useLoad(() => {
    console.log('confirm alert loaded.')
  })

  useEffect(() => {
    console.log('confirm alert effect.') 
  }, []);

  // 确定
  const clickConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm()
    } 
  }

  // 取消
  const clickCancel = () => {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  // styleType 0通用提示, 1商品详情购买, 2确定订单提示
  const alertViewStyleNormal = () =>  {
    return (
      <View className='alert-content'>
        <Image className='alert-img' mode='aspectFit' src={imgLight}></Image>
        <View className='text-title'>{title}</View>
        <View className='text-content'>{desc}</View>         
        <View className='btn-wrap'>   
          {
            cancelText && (
              <View className='cancel-btn' onClick={() => clickCancel()}>{cancelText}</View>
            )
          }
          {
            confirmText && (
              <View className='confirm-btn' onClick={() => clickConfirm()}>{confirmText}</View>
            )
          }
        </View>                       
      </View>
    )            
  }

  const alertViewStyleBuy = () =>  {
    return (
      <View className='alert-content'>
        <Image className='alert-img' mode='aspectFit' src={imgCart}></Image>
        <View className='text-title'>{title}</View>
        <View className='text-content'>{desc}</View>        
        <View className='btn-wrap'>   
          {
            cancelText && (
              <View className='cancel-btn' onClick={() => clickCancel()}>{cancelText}</View>
            )
          }
          {
            confirmText && (
              <View className='confirm-btn' onClick={() => clickConfirm()}>{confirmText}</View>
            )
          }
        </View>                       
      </View>
    )            
  }

  const alertViewStyleOrder = () =>  {
    return (
      <View className='alert-content'>
        <Image className='alert-img' mode='aspectFit' src={imgLight}></Image>
        <View className='text-title'>{title}</View>
        <View className='text-content-left'>{desc}</View>  
        <View className='text-goods-scroll'>       
          {
            goodsListArray.map((item, index) => {
              return (
                <View className='text-goods' key={index}>{item.title}</View>
              )
            })
          }      
         </View>  
        <View className='btn-wrap'>   
          {
            cancelText && (
              <View className='cancel-btn' onClick={() => clickCancel()}>{cancelText}</View>
            )
          }
          {
            confirmText && (
              <View className='confirm-btn' onClick={() => clickConfirm()}>{confirmText}</View>
            )
          }
        </View>                       
      </View>
    )            
  }

  return (
    <Overlay visible={show}>
      <View className='pg-confirm-alert-wrap'>
      {
        styleType == 0 ? ( alertViewStyleNormal() ) : null
       }
       {
        styleType == 1 ? ( alertViewStyleBuy() ) : null
       }
       {
        styleType == 2 ? ( alertViewStyleOrder() ) : null
       }       
      </View>            
    </Overlay>
  )
}
