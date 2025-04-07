import { useEffect, useState } from 'react'
import { Tabbar } from "@nutui/nutui-react";
import { Cart, Home, User } from '@nutui/icons-react'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index() {

  useLoad(() => {
    console.log('tabbar loaded.')
  })

  useEffect(() => {
    console.log('tabbar effect.') 
  }, []);

  const [index, setIndex] = useState(0)
  
  const clickTabbar = (value) => {
    console.log('clickTabbar', value)
    setIndex(value)
    if (value === 0) {
      Taro.ROUTER.navigateTo(`/pages/home/index`);   
    } else if (value === 1) {
      Taro.ROUTER.navigateTo(`/pages/cart/index`);
    } else if (value === 2) {
      Taro.ROUTER.navigateTo(`/pages/user/index`);
    }
  }

  return (
    <Tabbar fixed value={index} onSwitch={(value) => clickTabbar(value)}>
      <Tabbar.Item icon={<Home />} />
      <Tabbar.Item icon={<Cart />} />
      <Tabbar.Item icon={<User />} />
    </Tabbar>
  )
}
