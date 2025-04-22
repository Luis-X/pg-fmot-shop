import { useEffect } from 'react'
import { View, Image } from '@tarojs/components'
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
    const activityInfo = Taro.UTIL.getPGStorage('activity_info')
    const act = activityInfo.act || ''
    const acc = activityInfo.acc || ''
    
    if (index === 0) {
      Taro.ROUTER.redirectTo(`/pages/home/index?act=${act}&acc=${acc}`);   
    } else if (index === 1) {
      Taro.ROUTER.redirectTo(`/pages/cart/index?act=${act}&acc=${acc}`);
    } else if (index === 2) {
      Taro.ROUTER.redirectTo(`/pages/mine/index?act=${act}&acc=${acc}`);
    }
  }

  return (
    <View className='pg-tabbar-wrap'>
      <View className='pg-tabbar-item' onClick={() => clickTabbar(0)}>
        {
          sence === 'home' ? (
            <Image className='pg-tabbar-icon' src={imgHomeOn} mode='aspectFit'></Image>
          ) : (
            <Image className='pg-tabbar-icon' src={imgHome} mode='aspectFit'></Image>
          )
        }                
      </View>
      <View className='pg-tabbar-item' onClick={() => clickTabbar(1)}>
        {
          sence === 'cart' ? (
            <Image className='pg-tabbar-icon' src={imgCartOn} mode='aspectFit'></Image>
          ) : (
            <Image className='pg-tabbar-icon' src={imgCart} mode='aspectFit'></Image>
          )
        }     
      </View>
      <View className='pg-tabbar-item' onClick={() => clickTabbar(2)}>
        {
          sence === 'mine' ? (
            <Image className='pg-tabbar-icon' src={imgMineOn} mode='aspectFit'></Image>
          ) : (
            <Image className='pg-tabbar-icon' src={imgMine} mode='aspectFit'></Image>
          )
        }     
      </View>
    </View>
  )
}
