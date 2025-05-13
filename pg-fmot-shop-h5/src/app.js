import '@nutui/nutui-react/dist/style.css'
import VConsole from 'vconsole';
import WXSDK from 'weixin-js-sdk';
import Taro, { useLaunch, useUnload } from '@tarojs/taro'
import './app.scss'


// common module
import UTIL from './utils/util'
import HUD from './utils/hud'
import NETWORK from './api/network'
import ROUTER from './utils/router'
import TRACKER from './utils/tracker'

Taro.WXSDK = WXSDK

Taro.UTIL = UTIL
Taro.HUD = HUD
Taro.NETWORK = NETWORK
Taro.ROUTER = ROUTER
Taro.TRACKER = TRACKER

if (process.env.TARO_ENV === 'h5') {
  const vConsole = new VConsole();
  // vConsole.show()
}


function App({ children }) {  

  useLaunch(() => {
    // console.log('App launch')
  })

  useUnload(() => {
    // console.log('App unload')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
