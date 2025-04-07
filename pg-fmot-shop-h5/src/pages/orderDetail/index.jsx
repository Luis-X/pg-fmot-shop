import { useState } from "react";
import {
  PullToRefresh,
  Dialog,
  CountDown
} from "@nutui/nutui-react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertPrivacy from "../../components/pgAlertPrivacy/index";
import PGOrderView from "../../components/pgOrderView/index";
import PGLoading from "../../components/pgLoading/index";

export default function Index() {

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    setTimeout(() => {
      createdPage();
    }, 1000);
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("订单详情");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("订单详情");
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
        src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
        title:
          "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
        price: "388.0",
        vipPrice: "378",
        num: "1",
      },
      {
        src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
        title:
          "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
        price: "388.0",
        vipPrice: "378",
        num: "1",
      },
      {
        src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
        title:
          "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
        price: "388.0",
        vipPrice: "378",
        num: "1",
      },
    ]
  }

  // 下拉刷新
  const refreshData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, 1000);
    });
  };

  // 订单详情
  const orderInfoView = () => {
    return (
      <PGOrderView orderInfo={orderInfo}></PGOrderView>    
    )
  }
  
  // 领取说明
  const noteView = () => {
    return (
      <View className='order-detail-note-wrap'>
        <View className="note-wrap">
          <View className='note-title'>领取说明：</View>
          <View className='note-content'>{orderInfo.orderDesc}</View>
        </View>        
      </View> 
    )
  }

  // 取消订单
  const [visible, setVisible] = useState(false);

  const clickCancel = () => {
    setVisible(true)
  };

  const clickCancelConfirm = () => {
    setVisible(false);
    requestOrderCancelData() 
  };
  
  const requestOrderCancelData = () => {
    const isSuccess = true;

    Taro.HUD.showLoading('取消中...');
    setTimeout(() => {
      
      Taro.HUD.hideLoading();
      if (isSuccess) {
        Taro.HUD.showToastMessage('取消成功')
        setTimeout(() => {
          Taro.ROUTER.navigateBack()
        }, 2000);        
      } else {
        Taro.HUD.showToastMessage('取消失败')
      }
      
    }, 1000);        
  }

  const btnView = () => {
    return (
      <View className='order-detail-btn-wrap'>
        <View className='order-detail-cancel' onClick={clickCancel}>取消订单</View>
        <View className='order-detail-count-down-wrap'>
          <View className='order-detail-count-down'>剩余可取消时间：</View>
          <CountDown remainingTime={60 * 1000} />
        </View>        
      </View> 
    )
  }

  const alertView = () => {
    return (
      <Dialog
        className='order-detail-alert'
        title='提示'
        visible={visible}
        confirmText='确认'
        cancelText='取消'            
        onConfirm={() => clickCancelConfirm()}
        onCancel={() => setVisible(false)}
      >
        <View className='order-detail-alert-content'>              
          确认取消订单？
        </View>
      </Dialog>
    )
  }

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='order-detail-list' id='scroll'>      
              {orderInfoView()}
              {noteView()} 
              {btnView()}                              
            </View>
          </PullToRefresh>                 
          {alertView()}
          <PGAlertPrivacy></PGAlertPrivacy>          
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
