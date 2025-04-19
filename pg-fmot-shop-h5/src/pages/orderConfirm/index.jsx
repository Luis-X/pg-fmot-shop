import { useState } from "react";
import {
  PullToRefresh,
  Radio,  
  InputNumber,
  Image as ImageNut
} from "@nutui/nutui-react";
import { CheckNormal, Checked } from '@nutui/icons-react'
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";


export default function Index() {

  const router = useRouter()

  const configTracker = (type) => {
    const trackData = {}
    if (type === 1) {
      Taro.TRACKER.eventTracker('ORDER_CHECK_PAGE', trackData, "确认订单信息-购买人数")
    } else if (type === 2) {
      Taro.TRACKER.eventTracker('ORDER_CONFIRM_EXCHANGE', trackData, "确认订单信息-点击“确认兑换”人数/次数")
    } else if (type === 3) {
      Taro.TRACKER.eventTracker('ORDER_EXCHANGE_SUCCESS', trackData, "确认订单信息&确认购买弹窗-兑换成功人数/次数")
    } else if (type === 4) {
      Taro.TRACKER.eventTracker('ORDER_EXCHANGE_FAILED', trackData, "确认订单信息&确认购买弹窗-兑换失败人数/次数")
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
    configTracker(1)

    const activityId = router.params.activityId || '';
    setQueryActivityId(activityId)

    requestOrderActivityInfo(activityId)
    requestData();
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [queryActivityId, setQueryActivityId] = useState('');

  const [orderActivityInfo, setOrderActivityInfo] = useState({})
  const [cartList, setCartList] = useState([])

  // 选择发货方式
  const [deliveryType, setDeliveryType] = useState('SELF_PICKUP')
  const onDeliveryChange = (val) => {
    setDeliveryType(val)
  }

   // 下拉刷新
   const refreshData = () => {
    return requestData();
  };

  // request
  async function requestData() {
    const params = {}

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.orderConfirmInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const goodsList = resData.goodsList || []
      setCartList(goodsList)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  async function requestOrderActivityInfo(activityId) {
    const params = {
      activityId: activityId
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.orderActivityInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setOrderActivityInfo(resData)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  async function requestCartChangeData(val, id) {
    if (!id) {
      Taro.HUD.showToastMessage('缺少商品ID')
      setDelAlertQuery({})
      return;
    }
    
    const params = {
      id: id,
      quantity: val
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.cartChange(params) 
    Taro.HUD.hideLoading()
    setDelAlertQuery({})

    if (res.code === 0) {
      const newCartList = [...cartList];
      for (let i = 0; i < newCartList.length; i++) {
        const item = newCartList[i];
        if (item.activityProductId === id) {
          item.quantity = val;
          if (val <= 0) {
            newCartList.splice(i, 1);            
          }
          break;
        }
      }
      setCartList(newCartList);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 单个添加、减少
  const cartNumOnChange = (val, item) => {
    console.log('cartNumOnChange', val, item);
    const productId = item.activityProductId || '';

    if (val <= 0) {
      setDelAlertQuery({
        val: val,
        productId: productId
      })
      setDelAlertShow(true);
    } else {
      requestCartChangeData(val, productId)
    }    
  }

  // 积分展示
  const priceView = (item) => {
    const isDiscountPrice = item.discountPrice;
    let result = null;
    if (isDiscountPrice) {
      result = (
        <>
          <View className='goods-price-old'>{item.price}积分</View>
          <View className='goods-price-new-wrap'>
            <View className='goods-price-new'>{item.discountPrice}</View>
            <View className='goods-price-new-unit'>积分</View>
          </View>
        </>        
      )
    } else {
      result = (
        <View className='goods-price-new-wrap'>
          <View className='goods-price-new'>{item.price}</View>
          <View className='goods-price-new-unit'>积分</View>
        </View>
      )
    }
    return result
  }

  // 商品详情
  const clickGoods = (item) => {
    console.log('clickGoods', item);
    // const activityId = item.id || '';
    // const productId = item.activityProductId || '';
    // Taro.ROUTER.navigateTo(`/pages/detail/index?activityId=${activityId}&id=${productId}`);
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
                  <ImageNut className='goods-img' src={item.previewUrl} fit='cover' lazy loading={true} onClick={() => clickGoods(item)} />
                  <View className='goods-info' onClick={() => clickGoods(item)}>
                    <View className='goods-name'>{item.name}</View>
                    {priceView(item)}
                  </View>
                  <InputNumber className='goods-count' value={item.quantity} min={0} allowEmpty onChange={(val) => cartNumOnChange(val, item)} />
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
            <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='SELF_PICKUP'>线下自提</Radio>
            <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='POST'>邮寄</Radio>
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
          <View className='note-content'>{orderActivityInfo.collectionInstructions}</View>
        </View>        
      </View>                                       
    )
  }

  // 确认兑换
  const [shortageList, setShortageList] = useState([]);
  const [hideConfimBtn, setHideConfimBtn] = useState(false);

  const clickExchange = () => {
    configTracker(2)

    // 是否选择商品
    if (cartList.length <= 0) {
      Taro.HUD.showToastMessage('您还没有选择商品')
      return;
    }

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
      setShortageAlertShow(true)
    } else {
      requestOrderConfirmData()      
    }    
  };  

  const requestOrderConfirmData = async () => {  

    const orderItems = []
    cartList.forEach(item => {
      const obj = {
        activityProductId: item.activityProductId,
        quantity: item.quantity
      }
      orderItems.push(obj)
    })

    const params = {
      activityId: queryActivityId,
      deliveryType: deliveryType,
      orderItems: orderItems
    }

    Taro.HUD.showLoading('兑换中...')
    const res = await Taro.NETWORK.orderConfirm(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      configTracker(3)
      const resData = res.data || {}
      Taro.HUD.showToastMessage('兑换成功')
      setTimeout(() => {
        Taro.ROUTER.navigateTo('/pages/mine/index');
      }, 2000);
    } else {
      configTracker(4)
      Taro.HUD.showToastMessage(res.message)
    }        
  }

  const btnView = () => {
    return (
      <View className='order-confirm-btn-wrap'>
        <View className='order-confirm-ok' onClick={clickExchange}>确认兑换</View>
      </View> 
    )
  }
  
  // 缺货弹框
  const [shortageAlertShow, setShortageAlertShow] = useState(false);

  const shortageAlertView = () => {
    return (
      <PGAlertConfirm
        show={shortageAlertShow}
        styleType={2}
        title='提示'
        desc='以下商品缺货，是否继续结算？'        
        goodsList={shortageList}
        confirmText={hideConfimBtn ? '' : '继续结算'}
        cancelText='放弃'            
        onConfirm={() => clickConfirmExchange()}
        onCancel={() => clickCancelExchange()}
      >
      </PGAlertConfirm>
    )
  }

  const clickConfirmExchange = () => {
    setShortageAlertShow(false);
    requestOrderConfirmData()   
  };

  const clickCancelExchange = () => {
    setShortageAlertShow(false); 
  };

  // 删除弹框
  const [delAlertShow, setDelAlertShow] = useState(false);
  const [delAlertQuery, setDelAlertQuery] = useState({});

  const delAlertView = () => {
    return (
      <PGAlertConfirm
        show={delAlertShow}
        styleType={0}
        title='提示'
        desc='确认删除商品吗？'        
        confirmText='确认'
        cancelText='取消'            
        onConfirm={() => clickConfirmDel()}
        onCancel={() => clickCancelDel()}
      >
      </PGAlertConfirm>
    )
  }

  const clickConfirmDel = () => {
    setDelAlertShow(false);
    const val = delAlertQuery.val || '';
    const productId = delAlertQuery.productId || '';
    requestCartChangeData(val, productId)
  };

  const clickCancelDel = () => {
    setDelAlertQuery({})
    setDelAlertShow(false);
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()}>
            <View className='order-confirm-list' id='scroll'>                        
              { cartList && cartList.length > 0 ? goodsListView() : null }
              { deliveryView() }
              { orderActivityInfo.collectionInstructions ? noteView() : null }
              { btnView() }
            </View>
          </PullToRefresh>                
          {shortageAlertView()}
          {delAlertView()}
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
