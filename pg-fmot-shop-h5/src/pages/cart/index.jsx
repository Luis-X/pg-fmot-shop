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
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("购物车");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("购物车");
    setIsShowPage(true);

    const activityId = router.params.activityId || '';
    setQueryActivityId(activityId)
    requestData();
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [queryActivityId, setQueryActivityId] = useState('');

  // 下拉刷新
  const refreshData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, 1000);
    });
  };

  // request
  async function requestData(id) {
    const params = {
      
    }

    const res = await Taro.NETWORK.cartList(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const list = resData.list || []

      setCartList(list)
      checkCartStatus(list)
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
        totalNumVal += item.quantity;
        totalAmountVal += item.quantity * item.price;
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
      checkCartStatus(newCartList);
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
    const ids = [];
    cartList.forEach((item) => {
      if (item.isSelect) {
        ids.push(item.id);
      }
    });

    // 是否选择商品
    if (ids.length <= 0) {
      Taro.HUD.showToastMessage('您还没有选择商品')
      return;
    }

    console.log(ids);
    Taro.ROUTER.navigateTo('/pages/orderConfirm/index');
  };

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
      <View className='cart-item-wrap'>        
      {
        cartList.map((item, index) => {
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
                <ImageNut className='goods-img' src={item.previewUrl} fit='cover' lazy loading={true} onClick={() => clickGoods(item)} />
                <View className='goods-info' onClick={() => clickGoods(item)}>
                  <View className='goods-name'>{item.name}</View>
                  <View className='goods-price-old'>{item.price}积分</View>
                  <View className='goods-price-new-wrap'>
                    <View className='goods-price-new'>{item.discountPrice}</View>
                    <View className='goods-price-new-unit'>积分</View>
                  </View>
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
        <View className='next-step-btn' onClick={clickNextStep}>下一步</View>
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
            <View className='cart-list' id='scroll'>
              <View className="cart-empty-bg"></View>
              <View className='cart-space-top'></View>
              {goodsListView()}                                                                                     
            </View>
          </PullToRefresh>
          {toolsView()}
          <PGTabBar sence='cart'></PGTabBar>
          <PGAlertAgree></PGAlertAgree>
          {delAlertView()}
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
