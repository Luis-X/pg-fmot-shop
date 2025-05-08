import { useState } from "react";
import {
  PullToRefresh,
  CountDown
} from "@nutui/nutui-react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";
import DayJS from 'dayjs';

import PGOrderView from "../../components/pgOrderView/index";
import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";

export default function Index() {

  const router = useRouter()

  // 订单中的，商品id
  const configTrackerProductIds = () => {  
    let productIds = []
    const orderData = orderInfo.order || {} 
    const list = orderData.orderItems || []
    list.forEach((item) => {
      const productData = item.product || {}
      const tpId = productData.id
      if (tpId) {
        productIds.push(tpId)
      }      
    })
    return productIds
  }

  const configTracker = (type, trackData) => {
    if (type === 1) {
      // 订单取消
      Taro.TRACKER.eventTracker('ORDER_CANCEL', trackData)
    }
  }

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // setIsShowPage(true)

    const act = router.params.act || ''
    const acc = router.params.acc || ''    
    setActId(act)
    setAccId(acc)
    
    const id = router.params.id || '';
    setOrderId(id);

    requestData({
      activityId: act,
      pointAccountId: acc,
      id: id,
    });
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [orderId, setOrderId] = useState('');

  const [orderInfo, setOrderInfo] = useState({})
  const [cancelTime, setCancelTime] = useState(0);

  // 下拉刷新
  const refreshData = () => {
    return requestData({
      activityId: actId,
      pointAccountId: accId,
      id: orderId,
    });
  };

  // request
  async function requestData(query, onlyRefresh) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.orderDetailInfo(params) 
    setIsShowPage(true)
    if (onlyRefresh) {
      console.log('仅刷新')
    } else {
      Taro.HUD.hideLoading()
    }
    

    if (res.code === 0) {
      const resData = res.data || {}
      setOrderInfo(resData)

      // 交易成功的订单，可以在兑换后1小时内取消
      const orderData = resData.order || {}     
      if (orderData.orderStatus === 'COMPLETED') {
        const nowTime = DayJS(orderData.serverDate);                          // 当前时间
        const createTime = DayJS(orderData.createDate);                       // 创建时间
        const diffSeconds = nowTime.diff(createTime, 'second');               // 时间差的秒数
        const oneHourSeconds = 1 * 60 * 60;                                   // 1小时的秒数
        const remainingSeconds = Math.max(0, oneHourSeconds - diffSeconds);   // 剩余可取消的秒数
        console.log('cancelTime', remainingSeconds * 1000);
        setCancelTime(remainingSeconds * 1000);                               // 转换为毫秒
      } else {
        setCancelTime(0);
      }
      
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 订单详情
  const orderInfoView = () => {
    return (
      <PGOrderView scenceType='order-detail' orderInfo={orderInfo.order} act={actId} acc={accId}></PGOrderView>    
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
    // setCancelAlertShow(true)
    requestOrderCancelData()
  };  
  
  const requestOrderCancelData = async () => {
    const params = {
      activityId: actId,
      pointAccountId: accId,
      id: orderId,
    }

    Taro.HUD.showLoading('取消中...')
    const res = await Taro.NETWORK.orderCancel(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}

      const tpIds = configTrackerProductIds()
      if (tpIds.length > 0) {
        configTracker(1, {
          activityId: actId,
          pointAccountId: accId,
          orderId: orderId,
          productIds: tpIds,
        })
      }
      
      Taro.HUD.showToastMessage('取消成功')
      
      // 返回刷新
      const orderCancelInfo = {
        needRefresh: true,
        orderId: orderId,
      }
      Taro.UTIL.setPGStorage('order_cancel_info', orderCancelInfo)	

      // 刷新数据
      requestData({
        activityId: actId,
        pointAccountId: accId,
        id: orderId,
      }, true);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }       
  }

  const btnView = () => {
    return (
      <View className='order-detail-btn-wrap'>
        <View className='order-detail-cancel' onClick={() => clickCancel()}>
          <View className='order-detail-cancel-text'>取消订单</View>
        </View>
        <View className='order-detail-count-down-wrap'>
          <View className='order-detail-count-down'>剩余可取消时间：</View>
          <CountDown remainingTime={cancelTime} onEnd={() => { setCancelTime(0) }}/>
        </View>        
      </View> 
    )
  }

  // 取消弹框
  const [cancelAlertShow, setCancelAlertShow] = useState(false);

  const cancelAlertView = () => {
    return (
      <PGAlertConfirm
        show={cancelAlertShow}
        styleType={0}
        title='提示'
        desc='确认取消订单？'        
        confirmText='确认'
        cancelText='取消'            
        onConfirm={() => clickConfirmCancel()}
        onCancel={() => clickCancelCancel()}
      >
      </PGAlertConfirm>
    )
  }

  const clickConfirmCancel = () => {
    setCancelAlertShow(false);
    requestOrderCancelData() 
  };

  const clickCancelCancel = () => {
    setCancelAlertShow(false);
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()}>
            <View className='order-detail-list' id='scroll'>      
              { orderInfo.order ? orderInfoView() : null}
              { orderInfo.activity && orderInfo.activity.collectionInstructions ? noteView() : null }
              { orderInfo.order && cancelTime > 0 ? btnView() : null}                              
            </View>
          </PullToRefresh>                 
          {cancelAlertView()}        
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
