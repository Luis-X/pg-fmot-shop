import { useState } from "react";
import {
  PullToRefresh,
  Radio,  
  InputNumber,
  Image as ImageNut
} from "@nutui/nutui-react";
import { CheckNormal, Checked } from '@nutui/icons-react'
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow, useUnload } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";


export default function Index() {

  const router = useRouter()

  // 订单中的，商品id
  const configTrackerProductIds = (list) => {  
    let productIds = []
    list.forEach((item) => {
      const tpId = item.tpId
      if (tpId) {
        productIds.push(tpId)
      }      
    })
    return productIds
  }

  const configTracker = (type, trackData) => {
    if (type === 1) {
      // 确认订单
      Taro.TRACKER.eventTracker('ORDER_CHECK_PAGE', trackData)
    } else if (type === 2) {
      // 确认兑换
      Taro.TRACKER.eventTracker('ORDER_CONFIRM_EXCHANGE', trackData)
    } else if (type === 3) {
      // 兑换成功
      Taro.TRACKER.eventTracker('ORDER_EXCHANGE_SUCCESS', trackData)
    } else if (type === 4) {
      // 兑换失败
      Taro.TRACKER.eventTracker('ORDER_EXCHANGE_FAILED', trackData)
    }
  }

  useUnload(() => {
    Taro.UTIL.clearPGStorage('order_confirm_info')
  })

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    Taro.WXSDK.hideOptionMenu();
    const tpIds = configTrackerProductIds(cartList)
    if (tpIds.length > 0) {
      configTracker(1, {
        activityId: actId,
        pointAccountId: accId,
        productIds: tpIds,
      })
    }   
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }

    setIsShowPage(true);    

    const act = router.params.act || ''
    const acc = router.params.acc || ''
    setActId(act)
    setAccId(acc)

    requestData({
      activityId: act,
      pointAccountId: acc
    }, 'load')
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');

  const [orderActivityInfo, setOrderActivityInfo] = useState({})
  const [cartList, setCartList] = useState([])
  const [totalNum, setTotalNum] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // 合计
  const checkCartStatus = (list) => {
    let totalNumVal = 0;
    let totalAmountVal = 0;
    let selectNumVal = 0;
    list.forEach((item) => {
      const isDiscount = item.discountPrice ? true : false;
      const discountPrice = Number(item.discountPrice)
      const quantity = Number(item.quantity)
      const price = Number(item.price) 
      if (isDiscount) {
        totalAmountVal += quantity * discountPrice;
      } else {
        totalAmountVal += quantity * price;
      }      
      totalNumVal += quantity;
      selectNumVal += 1;
    });
    totalAmountVal = parseFloat(totalAmountVal.toFixed(1));
    setTotalNum(totalNumVal);
    setTotalAmount(totalAmountVal);
  }

  // 选择发货方式
  const [deliveryType, setDeliveryType] = useState('')
  const onDeliveryChange = (val) => {
    setDeliveryType(val)
  }

   // 下拉刷新
   const refreshData = () => {
    return requestData({
      activityId: actId,
      pointAccountId: accId
    });
  };

  // request
  async function requestData(query, scence) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.orderActivityInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setOrderActivityInfo(resData)
      configConfirmOrderData(query, scence);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  function configConfirmOrderData(query, scence) {
    const orderConfirmInfo = Taro.UTIL.getPGStorage('order_confirm_info')
    const goodsList = orderConfirmInfo.goodsList || []
    setCartList(goodsList)
    checkCartStatus(goodsList);

    if (scence === 'load') {
      const tpIds = configTrackerProductIds(goodsList)
      if (tpIds.length > 0) {
        configTracker(1, {
          activityId: query.activityId,
          pointAccountId: query.pointAccountId,
          productIds: tpIds,
        })
      }
    }
  }

  async function requestCartChangeData(val, id) {
    if (!id) {
      Taro.HUD.showToastMessage('缺少商品ID')
      setDelAlertQuery({})
      return;
    }

    const newCartList = [...cartList];
    for (let i = 0; i < newCartList.length; i++) {
      const item = newCartList[i];
      const productId = item.id || ''
      if (productId === id) {
        item.quantity = val;
        if (val <= 0) {
          newCartList.splice(i, 1);            
        }
        break;
      }
    }
    setCartList(newCartList);
    checkCartStatus(newCartList); 
  }

  // 单个添加、减少
  const cartNumOnChange = (val, item) => {
    const productId = item.id || '';

    const newValue = parseInt(val || 0);
    console.log('newValue', newValue);

    if (newValue <= 0) {
      setDelAlertQuery({
        val: newValue,
        productId: productId
      })
      setDelAlertShow(true);
    } else {
      if (checkLimitNum(newValue, item)) {
        requestCartChangeData(newValue, productId)
      }
    }    
  }

  // 限购数量检测（每个商品）
  const checkLimitNum = (val, item) => {
    const oldValue = item.quantity || 0;    
    const maxLimit = orderActivityInfo.maxQuantity || 0;
    console.log('maxLimit', maxLimit);  
    console.log('oldValue', oldValue); 
    if (val > maxLimit) {
      Taro.HUD.showToastMessage('加购商品超过数量上限')
      if (val < oldValue) {
        console.log('减少')
        return true;
      }
      return false;
    }
    return true;
  }

  // 积分展示
  const priceView = (item) => {
    const isDiscount = item.discountPrice ? true : false;
    const discountPrice = item.discountPrice 
    const price = item.price
    let result = null;
    if (isDiscount) {
      result = (
        <>
          <View className='goods-price-old'>{price}积分</View>
          <View className='goods-price-new-wrap'>
            <View className='goods-price-new'>{discountPrice}</View>
            <View className='goods-price-new-unit'>积分</View>
          </View>
        </>        
      )
    } else {
      result = (
        <View className='goods-price-new-wrap'>
          <View className='goods-price-new'>{price}</View>
          <View className='goods-price-new-unit'>积分</View>
        </View>
      )
    }
    return result
  }

  // 商品详情
  const clickGoods = (item) => {
    // const productId = item.id || '';   
    // Taro.ROUTER.navigateTo(`/pages/detail/index?act=${actId}&acc=${accId}&id=${productId}`);
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
                  <ImageNut className='goods-img' src={item.previewUrl} fit='cover' lazy={false} loading={false} onClick={() => clickGoods(item)} />
                  <View className='goods-info' onClick={() => clickGoods(item)}>
                    <View className='goods-name'>{item.name}</View>
                    {priceView(item)}
                  </View>
                  <InputNumber className='goods-count' value={item.quantity} min={0} allowEmpty={false} readOnly onChange={(val) => cartNumOnChange(val, item)} />
                </View>
                <View className="goods-line"></View>
              </View>
            );
          })
        }      
      </View>
    )
  };


  // 工具栏
  const totalView = () => {
    return (
      <View className='order-confirm-total-wrap'>            
        <View className='total-wrap'>
          <View className='total-text-wrap'>
            <View className='total-count'>{`共计${totalNum}件商品`}</View>
            <View className='total-price-wrap'>
              <View className='total-price-text'>合计</View>
              <View className='total-price-red'>{totalAmount}</View>
              <View className='total-price-text'>积分</View>
            </View>
          </View>              
        </View>
      </View>
    )
  }

  // 发货方式
  const deliveryView = () => {
    return (
      <View className='order-confirm-delivery-wrap'>
        <View className="delivery-wrap">
          <View className='delivery-title'>请选择发货方式：</View>
          <View className='delivery-option'>
          <Radio.Group defaultValue={deliveryType} direction='horizontal' onChange={onDeliveryChange}> 
            {
              orderActivityInfo.deliveryType === 'BOTH' ? (
                <>
                  <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='SELF_PICKUP'>线下自提</Radio>
                  <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='POST'>邮寄</Radio>
                </>
              ) : null
            }     
            {
              orderActivityInfo.deliveryType === 'SELF_PICKUP' ? (
                <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='SELF_PICKUP'>线下自提</Radio>
              ) : null
            }    
            {
              orderActivityInfo.deliveryType === 'POST' ? (               
                <Radio className='delivery-option-item' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='POST'>邮寄</Radio>
              ) : null
            }           
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
    const tpIds = configTrackerProductIds(cartList)
    if (tpIds.length > 0) {
      configTracker(2, {
        activityId: actId,
        pointAccountId: accId,
        productIds: tpIds,
      })
    }

    // 是否选择商品
    if (cartList.length <= 0) {
      Taro.HUD.showToastMessage('您还没有选择商品')
      return;
    }

    // 是否选择发货方式
    if (!deliveryType) {
      Taro.HUD.showToastMessage('您还没有选择发货方式')
      return;
    }

    // 是否包含虚拟商品
    let newList = []
    cartList.forEach(item => {
      if (item.productType === 'VIRTUAL_OBJECT') {
        newList.push(item)
      }
    })
    const isShortage = newList.length > 0

    // 是否所有都为虚拟商品                 
    const isAllShortage = newList.length >= cartList.length
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

    let orderItems = []
    let orderTpIds = []
    // 过滤虚拟商品，仅结算实物商品
    cartList.forEach(item => {
      if (item.productType === 'PHYSICAL_OBJECT') {
        const obj = {
          activityProductId: item.id,
          quantity: item.quantity
        }
        orderItems.push(obj)
        const tpId = item.tpId
        if (tpId) {
          orderTpIds.push(tpId)
        }        
      }      
    })

    const params = {
      activityId: actId,
      pointAccountId: accId,
      deliveryType: deliveryType,
      orderItems: orderItems
    }

    Taro.HUD.showLoading('兑换中...')
    const res = await Taro.NETWORK.orderConfirm(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const orderId = resData.id || ''

      if (cartList.length > 0) {
        configTracker(3, {
          activityId: actId,
          pointAccountId: accId,
          orderId: orderId,
          productIds: orderTpIds,
        })
      }

      Taro.HUD.showToastMessage('兑换成功')
      
      // 清理兑换信息，返回我的并刷新
      Taro.UTIL.clearPGStorage('order_confirm_info')
      setTimeout(() => {
        Taro.ROUTER.reLaunchTo(`/pages/mine/index?act=${actId}&acc=${accId}`);
      }, 2000);
    } else {
      if (cartList.length > 0) {
        configTracker(4, {
          activityId: actId,
          pointAccountId: accId,
          productIds: orderTpIds,
        })
      }

      Taro.HUD.showToastMessage(res.message)
    }        
  }

  const btnView = () => {
    return (
      <View className='order-confirm-btn-wrap'>
        <View className='order-confirm-ok' onClick={clickExchange}>
          <View className='order-confirm-ok-text'>确认兑换</View>
        </View>
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
    const val = delAlertQuery.val || 0;
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
              <View className='order-space-top'></View>             
              { cartList && cartList.length > 0 ? goodsListView() : null }
              { cartList && cartList.length > 0 ? totalView() : null  }
              { orderActivityInfo.deliveryType ? deliveryView() : null }
              { orderActivityInfo.collectionInstructions ? noteView() : null }
              { orderActivityInfo.deliveryType ? btnView() : null }
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
