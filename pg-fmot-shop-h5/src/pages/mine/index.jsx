import { useState } from "react";
import {
  PullToRefresh,
  Image,
} from "@nutui/nutui-react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertPrivacy from "../../components/pgAlertPrivacy/index";
import PGOrderView from "../../components/pgOrderView/index";
import PGLoading from "../../components/pgLoading/index";
import PGTabBar from "../../components/pgTabbar/index";

import imgTopBar from '../../images/mine-top-bar.png';
import imgOrder from '../../images/mine-order.png';

export default function Index() {

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("我的");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("我的");
    setIsShowPage(true);
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const orderInfo = {
    orderId: '2022010100000000000000000000000000000000000000000000000000000000',
    orderStatus: '待支付',
    orderAmount: '100.00',
    orderCreateTime: '2022-01-01 00:00:00',
    orderDesc: '文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本',
    totalNum: 10,
    totalAmount: 100,
    goodsList: [
      {
        src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
        title:
          "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
        price: "388.0",
        vipPrice: "378",
        num: "1",
      },
      {
        src: "https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg",
        title:
          "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
        price: "388.0",
        vipPrice: "378",
        num: "1",
      },
      {
        src: "https://storage.360buyimg.com/jdc-article/welcomenutui.jpg",
        title:
          "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
        price: "388.0",
        vipPrice: "378",
        num: "1",
      },
    ]
  }
  const [tabIndex, setTabIndex] = useState(0)

  // 下拉刷新
  const refreshData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, 1000);
    });
  };

  // 我的兑换
  const clickMyExchange = () => {
    Taro.ROUTER.navigateTo('/pages/exchange/index');
  };

  // 标签
  const tabChange = (index) => {
    setTabIndex(index);
  }

  // 订单详情
  const clickOrderDetail = (orderId) => {
    console.log(orderId)
    Taro.ROUTER.navigateTo('/pages/orderDetail/index');
  }

  // 我的积分
  const topBarView = () => {
    return (
      <View className='mine-point-wrap'>
        <View className="point-bg-wrap">
          <Image className='point-img' fit='contain' src={imgTopBar}></Image>
          <View className='point-title'>12059000</View>
          <View className='point-btn' onClick={clickMyExchange}>查看我正参与的兑换</View>
        </View>               
      </View>
    )
  }

  // 我的订单
  const tabView = () => {
    return (
      <>
        <View className='mine-order-wrap'>
          <Image className='order-img' fit='contain' src={imgOrder}></Image>
          <View className='order-title'>我的订单</View>
        </View>
        <View className='mine-tab-wrap'>
          <View className="tab-item" onClick={() => tabChange(0)}>
            <View className={tabIndex === 0 ? 'tab-item-text-focus' : 'tab-item-text'}>全部</View>
            <View className={tabIndex === 0 ? 'tab-item-line-focus' : 'tab-item-line'}></View>
          </View>
          <View className="tab-item" onClick={() => tabChange(1)}>
            <View className={tabIndex === 1 ? 'tab-item-text-focus' : 'tab-item-text'}>已取消</View>
            <View className={tabIndex === 1 ? 'tab-item-line-focus' : 'tab-item-line'}></View>
          </View>
        </View> 
      </>
    )
  }

  // 订单标签
  const listView = () => {
    return (
      <>
      <PGOrderView orderInfo={orderInfo} onClick={() => clickOrderDetail()}></PGOrderView>
      <PGOrderView orderInfo={orderInfo} onClick={() => clickOrderDetail()}></PGOrderView> 
      </>
      
    )
  }

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='mine-list' id='scroll'>
              {topBarView()}
              {tabView()}
              {listView()}                                                          
            </View>
          </PullToRefresh>
          <PGTabBar sence='mine'></PGTabBar>
          <PGAlertPrivacy></PGAlertPrivacy>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
</>
  );
}
