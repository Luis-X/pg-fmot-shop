import { useState } from "react";
import {
  PullToRefresh,
  CountDown
} from "@nutui/nutui-react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGOrderView from "../../components/pgOrderView/index";
import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";

export default function Index() {

  const router = useRouter()

  const configTracker = (type) => {
    const trackData = {}
    if (type === 1) {
      Taro.TRACKER.eventTracker('ORDER_CANCEL', trackData, "订单详情页-取消人数/次数")
    }
  }

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

    const activityId = router.params.activityId || '';
    const orderId = router.params.id || '';
    setQueryActivityId(activityId)
    setQueryOrderId(orderId)

    requestData();
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [queryActivityId, setQueryActivityId] = useState('');
  const [queryOrderId, setQueryOrderId] = useState('');

  const [orderInfo, setOrderInfo] = useState({})

  // 下拉刷新
  const refreshData = () => {
    return requestData();
  };

  // request
  async function requestData() {
    const params = {
      activityId: queryActivityId,
      id: queryOrderId
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
      <PGOrderView orderInfo={orderInfo.order}></PGOrderView>    
    )
  }
  
  // 领取说明
  const noteView = () => {
    return (
      <View className='order-detail-note-wrap'>
        <View className="note-wrap">
          <View className='note-title'>领取说明：</View>
          <View className='note-content'>{orderInfo.activity.collectionInstructions}</View>
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
  
  const requestOrderCancelData = async () => {
    const params = {
      activityId: queryActivityId,
      id: queryOrderId
    }

    Taro.HUD.showLoading('取消中...')
    const res = await Taro.NETWORK.orderCancel(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      configTracker(1)
      const resData = res.data || {}
      Taro.HUD.showToastMessage('取消成功')
      setTimeout(() => {
        Taro.ROUTER.navigateBack()
      }, 2000);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }       
  }

  const btnView = () => {
    return (
      <View className='order-detail-btn-wrap'>
        <View className='order-detail-cancel' onClick={() => clickCancel()}>取消订单</View>
        <View className='order-detail-count-down-wrap'>
          <View className='order-detail-count-down'>剩余可取消时间：</View>
          <CountDown remainingTime={60 * 60 * 1000} />
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
          <PullToRefresh onRefresh={() => refreshData()}>
            <View className='order-detail-list' id='scroll'>      
              { orderInfo.order ? orderInfoView() : null}
              { orderInfo.activity && orderInfo.activity.collectionInstructions ? noteView() : null }
              { orderInfo.order && orderInfo.order.orderStatus !== 'CANCELED' ? btnView() : null}                              
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
