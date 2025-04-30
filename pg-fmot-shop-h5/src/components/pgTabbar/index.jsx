import { useEffect } from 'react'
import { View, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

import ASSET_IMG from '../../utils/assetImg.js'

const imgHome = ASSET_IMG.assetImgWithName('home.png')
const imgHomeOn = ASSET_IMG.assetImgWithName('home_on.png')
const imgCart = ASSET_IMG.assetImgWithName('cart.png')
const imgCartOn = ASSET_IMG.assetImgWithName('cart_on.png')
const imgMine = ASSET_IMG.assetImgWithName('mine.png')
const imgMineOn = ASSET_IMG.assetImgWithName('mine_on.png')

export default function Index(props) {

  const { sence, act, acc } = props

  useLoad(() => {
    console.log('tabbar loaded.')
  })

  useEffect(() => {
    console.log('tabbar effect.') 
  }, []);
  
  const clickTabbar = (index) => {    
    if (index === 0) {
      Taro.ROUTER.reLaunchTo(`/pages/home/index?act=${act}&acc=${acc}`);   
    } else if (index === 1) {
      Taro.ROUTER.reLaunchTo(`/pages/cart/index?act=${act}&acc=${acc}`);
    } else if (index === 2) {
      Taro.ROUTER.reLaunchTo(`/pages/mine/index?act=${act}&acc=${acc}`);
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
