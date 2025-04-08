import { useState } from "react";
import {
  PullToRefresh,
  CountDown
} from "@nutui/nutui-react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGOrderView from "../../components/pgOrderView/index";
import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";

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

    requestData();
  };

  const [isShowPage, setIsShowPage] = useState(false);

  const [orderInfo, setOrderInfo] = useState({})

  // 下拉刷新
  const refreshData = () => {
    return requestData();
  };

  // request
  async function requestData(id) {
    const params = {
      id: id
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.orderDetailInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setOrderInfo(resData)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

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
  const clickCancel = () => {
    setIsAlertShow(true)
  };

  const clickCancelConfirm = () => {
    setIsAlertShow(false);
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

  // 弹框
  const [isAlertShow, setIsAlertShow] = useState(false);

  const alertView = () => {
    return (
      <PGAlertConfirm
        show={isAlertShow}
        styleType={0}
        title='提示'
        desc='确认取消订单？'        
        confirmText='确认'
        cancelText='取消'            
        onConfirm={() => clickCancelConfirm()}
        onCancel={() => setIsAlertShow(false)}
      >
      </PGAlertConfirm>
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
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
