import { useState } from "react";
import {
  PullToRefresh,
  Radio,
  Image,
  InputNumber
} from "@nutui/nutui-react";
import { CheckNormal, Checked } from '@nutui/icons-react'
import { View } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

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
      Taro.TRACKER.pageViewTracker("确认订单");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("确认订单");
    setIsShowPage(true);

    requestData();
  };

  const [isShowPage, setIsShowPage] = useState(false);

  const [orderInfo, setOrderInfo] = useState({})
  const [cartList, setCartList] = useState([])

  // 选择发货方式
  const [deliveryType, setDeliveryType] = useState('1')
  const onDeliveryChange = (val) => {
    setDeliveryType(val)
  }

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
    const res = await Taro.NETWORK.orderConfirmInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const goodsList = resData.goodsList || []
      setOrderInfo(resData)
      setCartList(goodsList)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 商品列表
  const goodsListView = () => {
    return (
      <View className='order-confirm-item-wrap'>
        {
          cartList.map((item, index) => {
            return (
              <View className={index === 0 ? 'goods-bg-wrap-radius' : 'goods-bg-wrap'} key={index}>           
                <View className='goods-wrap'>
                  <Image className='goods-img' src={item.src} fit='cover'></Image>
                  <View className='goods-info'>
                    <View className='goods-name'>{item.title}</View>
                    <View className='goods-price-old'>{item.price}积分</View>
                    <View className='goods-price-new-wrap'>
                      <View className='goods-price-new'>{item.vipPrice}</View>
                      <View className='goods-price-new-unit'>积分</View>
                    </View>
                  </View>
                  <InputNumber className='goods-count' value={item.num} max={item.limit} min={0} allowEmpty onChange={(val) => cartNumOnChange(val, index)} />
                </View>
                <View className="goods-line"></View>
              </View>
            );
          })
        }      
      </View>
    )
  };

  // 发货方式
  const deliveryView = () => {
    return (
      <View className='order-confirm-delivery-wrap'>
        <View className="delivery-wrap">
          <View className='delivery-title'>请选择发货方式：</View>
          <View className='delivery-option'>
          <Radio.Group defaultValue={deliveryType} direction='horizontal' onChange={onDeliveryChange}> 
            <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='1'>线下自提</Radio>
            <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='2'>邮寄</Radio>
          </Radio.Group>                  
          </View>         
        </View>               
      </View>
    )
  }

  // 领取说明
  const noteView = () => {
    return (
      <View className='order-confirm-note-wrap'>
        <View className="note-wrap">
          <View className='note-title'>领取说明：</View>
          <View className='note-content'>{orderInfo.orderDesc}</View>
        </View>        
      </View>                                       
    )
  }

  // 确认兑换
  const [shortageList, setShortageList] = useState([]);
  const [hideConfimBtn, setHideConfimBtn] = useState(false);

  const clickExchange = () => {

    // 是否包含虚拟商品
    const newList = []
    cartList.forEach(item => {
      if (item.type === 1) {
        newList.push(item)
      }
    })
    const isShortage = newList.length > 0 // 是否包含虚拟商品
    const isAllShortage = newList.length >= cartList.length; // 是否所有都为虚拟商品
    setShortageList(newList)

    if (isShortage) {      
      if (isAllShortage) {
        setHideConfimBtn(true)
      } else {
        setHideConfimBtn(false)
      }
      setIsAlertShow(true)
    } else {
      requestOrderConfirmData()      
    }    
  };

  const clickExchangeConfirm = () => {
    setIsAlertShow(false);
    requestOrderConfirmData()   
  };

  const requestOrderConfirmData = () => {
    const isSuccess = true;

    Taro.HUD.showLoading('兑换中...');
    setTimeout(() => {
      
      Taro.HUD.hideLoading();
      if (isSuccess) {
        Taro.HUD.showToastMessage('兑换成功')
        setTimeout(() => {
          Taro.ROUTER.navigateTo('/pages/mine/index');
        }, 2000);        
      } else {
        Taro.HUD.showToastMessage('兑换失败，不能超过活动商品最大订购量')
      }
      
    }, 1000);        
  }

  const btnView = () => {
    return (
      <View className='order-confirm-btn-wrap'>
        <View className='order-confirm-ok' onClick={clickExchange}>确认兑换</View>
      </View> 
    )
  }
  
  // 弹框
  const [isAlertShow, setIsAlertShow] = useState(false);

  const alertView = () => {
    return (
      <PGAlertConfirm
        show={isAlertShow}
        styleType={2}
        title='提示'
        desc='以下商品缺货，是否继续结算？'        
        goodsList={shortageList}
        confirmText={hideConfimBtn ? '' : '继续结算'}
        cancelText='放弃'            
        onConfirm={() => clickExchangeConfirm()}
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
            <View className='order-confirm-list' id='scroll'>                        
              { cartList && cartList.length > 0 ? goodsListView() : null }
              { cartList && cartList.length > 0 ? deliveryView() : null }
              { orderInfo.orderDesc ? noteView() : null }
              { cartList && cartList.length > 0 ? btnView() : null }
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
