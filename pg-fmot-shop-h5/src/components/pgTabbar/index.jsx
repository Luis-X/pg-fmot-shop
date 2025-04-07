import { useEffect } from 'react'
import { Image } from "@nutui/nutui-react";
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

import imgHome from "../../images/home.png";
import imgHomeOn from "../../images/home_on.png";
import imgCart from "../../images/cart.png";
import imgCartOn from "../../images/cart_on.png";
import imgMine from "../../images/mine.png";
import imgMineOn from "../../images/mine_on.png";

export default function Index(props) {

  const { sence } = props

  useLoad(() => {
    console.log('tabbar loaded.')
  })

  useEffect(() => {
    console.log('tabbar effect.') 
  }, []);
  
  const clickTabbar = (index) => {
    console.log('clickTabbar', sence)
    if (index === 0) {
      Taro.ROUTER.redirectTo(`/pages/home/index`);   
    } else if (index === 1) {
      Taro.ROUTER.redirectTo(`/pages/cart/index`);
    } else if (index === 2) {
      Taro.ROUTER.redirectTo(`/pages/mine/index`);
    }
  }

  return (
    <View className='pg-tabbar-wrap'>
      <View className='pg-tabbar-item' onClick={() => clickTabbar(0)}>
        {
          sence === 'home' ? (
            <Image className='pg-tabbar-icon' src={imgHomeOn} fit='contain'></Image>
          ) : (
            <Image className='pg-tabbar-icon' src={imgHome} fit='contain'></Image>
          )
        }                
      </View>
      <View className='pg-tabbar-item' onClick={() => clickTabbar(1)}>
        {
          sence === 'cart' ? (
            <Image className='pg-tabbar-icon' src={imgCartOn} fit='contain'></Image>
          ) : (
            <Image className='pg-tabbar-icon' src={imgCart} fit='contain'></Image>
          )
        }     
      </View>
      <View className='pg-tabbar-item' onClick={() => clickTabbar(2)}>
        {
          sence === 'mine' ? (
            <Image className='pg-tabbar-icon' src={imgMineOn} fit='contain'></Image>
          ) : (
            <Image className='pg-tabbar-icon' src={imgMine} fit='contain'></Image>
          )
        }     
      </View>
    </View>
  )
}
