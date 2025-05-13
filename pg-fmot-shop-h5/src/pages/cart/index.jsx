import { useState } from "react";
import { PullToRefresh, InputNumber, Image as ImageNut } from "@nutui/nutui-react";
import { CheckNormal, Checked } from '@nutui/icons-react'
import { View } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertAgree from "../../components/pgAlertAgree/index";
import PGLoading from "../../components/pgLoading/index";
import PGTabBar from "../../components/pgTabbar/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";

export default function Index() {

  const router = useRouter()

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {    
    setIsShowPage(true);

    const act = router.params.act || ''
    const acc = router.params.acc || ''
    setActId(act)
    setAccId(acc)

    requestData({
      activityId: act,
      pointAccountId: acc,
    });
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [isFirstLoadCart, setIsFirstLoadCart] = useState(true);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [orderActivityInfo, setOrderActivityInfo] = useState({})

  // 下拉刷新
  const refreshData = () => {
    return requestData({
      activityId: actId,
      pointAccountId: accId,
    })
  };

  // request
  async function requestData(query) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.orderActivityInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setOrderActivityInfo(resData)
      requestCartData(query)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  async function requestCartData(query) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.cartList(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const list = resData || []

      setCartList(list)
      checkCartStatus(list)
      setIsFirstLoadCart(false)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 购物车状态
  const [cartList, setCartList] = useState([])
  const [isAllSelect, setIsAllSelect] = useState(false);
  const [totalNum, setTotalNum] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const checkCartStatus = (list) => {
    let totalNumVal = 0;
    let totalAmountVal = 0;
    let selectNumVal = 0;
    list.forEach((item) => {
      if (item.isSelect) {
        const isDiscount = item.discountPrice ? true : false;
        const discountPrice = Number(item.discountPrice)
        const quantity = Number(item.quantity)  
        const productData = item.product || {}
        const price = Number(productData.price)              
        if (isDiscount) {
          totalAmountVal += quantity * discountPrice;
        } else {
          totalAmountVal += quantity * price;
        }      
        totalNumVal += quantity;
        selectNumVal += 1;
      }
    });
    totalAmountVal = parseFloat(totalAmountVal.toFixed(1));
    setTotalNum(totalNumVal);
    setTotalAmount(totalAmountVal);
    if (selectNumVal > 0 && selectNumVal === list.length) {
      setIsAllSelect(true);
    } else {
      setIsAllSelect(false);
    }
  }

  async function requestCartChangeData(val, id) {
    if (!id) {
      Taro.HUD.showToastMessage('缺少商品ID')
      setDelAlertQuery({})
      return;
    }
    
    const params = {
      activityId: actId,
      pointAccountId: accId,
      activityProductId: id,
      quantity: val,
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.cartChange(params) 
    // Taro.HUD.hideLoading()
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
      checkCartStatus(newCartList);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 单个添加、减少
  const cartNumOnChange = (val, item) => {
    const productId = item.activityProductId || '';

    const newValue = parseInt(val || 0);
    // console.log('newValue', newValue);

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
    // console.log('maxLimit', maxLimit);  
    // console.log('oldValue', oldValue);  
    if (val > maxLimit) {
      Taro.HUD.showToastMessage('加购商品超过数量上限')
      if (val < oldValue) {
        // console.log('减少')
        return true;
      }
      return false;
    }
    return true;
  }

  // 单个勾选、取消
  const clickSelectItem = (isSelect, index) => {
    const newCartList = [...cartList];
    newCartList[index].isSelect = isSelect;
    setCartList(newCartList);
    checkCartStatus(newCartList);
  }

  // 全部勾选、取消
  const clickAllSelect = (isSelect) => {
    const newCartList = [...cartList];
    newCartList.forEach((item) => {
      item.isSelect = isSelect;
    });
    setCartList(newCartList);
    checkCartStatus(newCartList);
  }

  // 下一步
  const clickNextStep = () => {

    // 提取选中的商品ID
    let goodsList = [];
    cartList.forEach((item) => {
      if (item.isSelect) {
        const productData = item.product || {};
        const goods = {
          tpId: productData.id,
          id: item.activityProductId,
          productType: productData.productType,
          previewUrl: productData.previewUrl,
          name: productData.name,
          price: productData.price,
          discountPrice: item.discountPrice,         
          quantity: item.quantity,
        }
        goodsList.push(goods);
      }
    });

    // 是否选择商品
    if (goodsList.length <= 0) {
      Taro.HUD.showToastMessage('您还没有选择商品')
      return;
    }

    const orderConfirmInfo = {
      goodsList: goodsList,
    }
    Taro.UTIL.setPGStorage('order_confirm_info', orderConfirmInfo)	
    Taro.ROUTER.navigateTo(`/pages/orderConfirm/index?act=${actId}&acc=${accId}`);
  };

  // 商品详情
  const clickGoods = (item) => {
    // const productId = item.activityProductId || '';   
    // Taro.ROUTER.navigateTo(`/pages/detail/index?act=${actId}&acc=${accId}&id=${productId}`);
  }

  // 积分展示
  const priceView = (item) => {
    const isDiscount = item.discountPrice ? true : false;
    const discountPrice = item.discountPrice 
    const productData = item.product || {}
    const price = productData.price
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

  // 商品列表
  const goodsListView = () => {
    return (
      <View className='cart-item-wrap'>   
      {
        !isFirstLoadCart && cartList.length <= 0 ? (
          <View className='cart-empty-text'>购物车是空的</View>
        ) : null
      }     
      {
        cartList.map((item, index) => {
          const productData = item.product || {}
          return (
            <View className={index === 0 ? 'goods-bg-wrap-radius' : 'goods-bg-wrap'} key={index}>           
              <View className='goods-wrap'>
                {
                  item.isSelect ? (
                    <View className='goods-select' onClick={() => clickSelectItem(false, index)}>
                      <Checked style={{ color: "red" }} />
                    </View>
                  ) : (
                    <View className='goods-select' onClick={() => clickSelectItem(true, index)}>
                      <CheckNormal style={{ color: '#B7BED1' }} />
                    </View>
                  )
                }
                <ImageNut className='goods-img' src={productData.previewUrl} fit='cover' lazy={false} loading={false} onClick={() => clickGoods(item)} />
                <View className='goods-info' onClick={() => clickGoods(item)}>
                  <View className='goods-name'>{productData.name}</View>
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
  const toolsView = () => {
    return (
      <View className='cart-tools-wrap'>            
        <View className='total-wrap'>
          <View className='select-wrap'>
            {
            isAllSelect ? (
              <View className='select-all' onClick={() => clickAllSelect(false)}>
                <Checked style={{ color: "red" }} />
              </View>
            ) : (
              <View className='select-all' onClick={() => clickAllSelect(true)}>
                <CheckNormal style={{ color: '#B7BED1' }} />
              </View>
            )
          }
            <View className='select-all-text'>全选</View>
          </View>
          <View className='total-text-wrap'>
            <View className='total-count'>{`共计${totalNum}件商品`}</View>
            <View className='total-price-wrap'>
              <View className='total-price-text'>合计</View>
              <View className='total-price-red'>{totalAmount}</View>
              <View className='total-price-text'>积分</View>
            </View>
          </View>              
        </View>
        <View className='next-step-btn' onClick={clickNextStep}>
          <View className='next-step-btn-text'>下一步</View>
        </View>
      </View>
    )
  }

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
            <View className='cart-list' id='scroll'>
              <View className="cart-empty-bg"></View>
              <View className='cart-space-top'></View>
              {goodsListView()}                                                                                     
            </View>
          </PullToRefresh>
          {toolsView()}
          <PGTabBar sence='cart' act={actId} acc={accId}></PGTabBar>
          <PGAlertAgree></PGAlertAgree>
          {delAlertView()}
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
