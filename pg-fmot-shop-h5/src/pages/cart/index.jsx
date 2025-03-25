import { useState } from "react";
import {
  PullToRefresh,
  Toast,
  Image,
  Button,
  InputNumber
} from "@nutui/nutui-react";
import { CheckNormal, Checked } from '@nutui/icons-react'
import { View } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertPrivacy from "../../components/pgAlertPrivacy/index";
import PGLoading from "../../components/pgLoading/index";

export default function Index() {

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

    const cartListData = [
      {
        id: 1,
        src: "https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg",
        title: "商品名称商品名称商品名称商品名称商品名称商品名称",
        price: 100,
        num: 2,
        limit: 10,
        isSelect: true
      },
      {
        id: 2,
        src: "https://storage.360buyimg.com/jdc-article/welcomenutui.jpg",
        title: "商品名称商品名称商品名称商品名称商品名称商品名称",
        price: 200,
        num: 1,
        limit: 5,
        isSelect: false
      }
    ]

    setCartList(cartListData);
    checkCartStatus(cartListData);
  };

  const [isShowPage, setIsShowPage] = useState(false);

  // 下拉刷新
  const refreshData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Toast.show("😊");
        resolve("done");
      }, 1000);
    });
  };

  // 购物车状态
  const [cartList, setCartList] = useState([])
  const [isAllSelect, setIsAllSelect] = useState(true);
  const [totalNum, setTotalNum] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const checkCartStatus = (list) => {
    let totalNumVal = 0;
    let totalAmountVal = 0;
    let selectNumVal = 0;
    list.forEach((item) => {
      if (item.isSelect) {
        totalNumVal += item.num;
        totalAmountVal += item.num * item.price;
        selectNumVal += 1;
      }
    });
    setTotalNum(totalNumVal);
    setTotalAmount(totalAmountVal);
    if (selectNumVal > 0 && selectNumVal === list.length) {
      setIsAllSelect(true);
    } else {
      setIsAllSelect(false);
    }
  }

  // 单个删除
  const cartNumDelete = (index) => {
    const newCartList = [...cartList];
    newCartList.splice(index, 1);
    setCartList(newCartList);
    checkCartStatus(newCartList);
  }

  // 单个添加、减少
  const cartNumOnChange = (val, index) => {
    // console.log(val, index);
    if (val <= 0) {
      cartNumDelete(index);
      return;
    }
    const newCartList = [...cartList];    
    newCartList[index].num = val;
    setCartList(newCartList);
    checkCartStatus(newCartList);
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
    const ids = [];
    cartList.forEach((item) => {
      if (item.isSelect) {
        ids.push(item.id);
      }
    });

    if (ids.length <= 0) {
      Toast.show("请选择商品");
      return;
    }

    console.log(ids);
    Taro.ROUTER.navigateTo('/pages/orderConfirm/index');
  };

  // 商品列表
  const goodsListView = () => {
    return cartList.map((item, index) => {
      return (
        <View className='goods-wrap' key={index}>
          {
            item.isSelect ? (
              <View className='goods-select' onClick={() => clickSelectItem(false, index)}>
                <Checked style={{ color: "red" }} />
              </View>
            ) : (
              <View className='goods-select' onClick={() => clickSelectItem(true, index)}>
                <CheckNormal />
              </View>
            )
          }
          <Image className='goods-img' src={item.src} fit='cover'></Image>
          <View className='goods-info'>
            <View className='goods-name'>{item.title}</View>
            <View className='goods-price'>{item.price}积分</View>
          </View>
          <InputNumber className='goods-count' value={item.num} max={item.limit} min={0} allowEmpty onChange={(val) => cartNumOnChange(val, index)} />
        </View>
      );
    });
  };

  // 工具栏
  const toolsView = () => {
    return (
      <View className='cart-tools-wrap'>            
        <View className='total-wrap'>
          <View className='select-wrap'>
            {/* <Radio className='select-all' icon={<CheckNormal />} activeIcon={<Checked style={{ color: 'red' }} />} value='1'></Radio> */}
            {
            isAllSelect ? (
              <View className='select-all' onClick={() => clickAllSelect(false)}>
                <Checked style={{ color: "red" }} />
              </View>
            ) : (
              <View className='select-all' onClick={() => clickAllSelect(true)}>
                <CheckNormal />
              </View>
            )
          }
            <View className='select-all-text'>全选</View>
          </View>
          <View className='total-text-wrap'>
            <View className='total-count'>{`共计${totalNum}件商品`}</View>
            <View className='total-amount'>{`合计${totalAmount}积分`}</View>
          </View>              
        </View>
        <Button className='next-step-btn' block type='primary' onClick={clickNextStep}>下一步</Button>
      </View>
    )
  }

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='cart-list' id='scroll'>
              <View className='cart-item-wrap'>{goodsListView()}</View>                                                                        
            </View>
          </PullToRefresh>
          {toolsView()}
          <PGAlertPrivacy></PGAlertPrivacy>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
