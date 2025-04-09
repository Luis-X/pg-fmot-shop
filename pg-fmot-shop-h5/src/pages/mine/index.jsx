import { useState } from "react";
import {
  PullToRefresh,
  Image,
} from "@nutui/nutui-react";
import { View } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertAgree from "../../components/pgAlertAgree/index";
import PGOrderView from "../../components/pgOrderView/index";
import PGLoading from "../../components/pgLoading/index";
import PGTabBar from "../../components/pgTabbar/index";

import imgTopBar from '../../images/mine-top-bar.png';
import imgOrder from '../../images/mine-order.png';

export default function Index() {

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("我的");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("我的");
    setIsShowPage(true);

    requestListData({
      pageIndex: 0,
      tabIndex: 0,
    }, false)

    requestData()
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [tabIndex, setTabIndex] = useState(0)

  const [userInfo, setUserInfo] = useState({})
  const [dataList, setDataList] = useState([]);
  const [pageCurrentIndex, setPageCurrentIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true);

  // 下拉刷新
  const refreshData = () => {
    requestData()
    return requestListData({
      pageIndex: 0,
      tabIndex: tabIndex,
    }, false);
  };

  // request
  async function requestData() {
    const params = {}
    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.mineInfo(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setUserInfo(resData)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }
  

  async function requestListData(query, isLoadMore) {

    const pageIndex = query.pageIndex || 0
    const tabIndex = query.tabIndex || ''

    if (!isLoadMore) {
      setDataList([])
    } else {
      if (pageIndex > 0 && !hasMore) {
        console.log('no more')
        return
      }
    }

    const params = {
      page: pageIndex,
      size: 10,
      type: tabIndex,
    }

    const res = await Taro.NETWORK.mineOrderList(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}

      const list = resData.list || []

      let newList = []
      if (isLoadMore) {
        newList = dataList.concat(list)
      } else {
        newList = list
      }

      setDataList(newList)  
      setPageCurrentIndex(pageIndex + 1)
      
      // 没有更多
      if (pageIndex >= resData.totalPages - 1) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

    } else {
      Taro.HUD.showToastMessage(res.message)
    } 
  }

  // 我的兑换
  const clickMyExchange = () => {
    Taro.ROUTER.navigateTo('/pages/exchange/index');
  };

  // 标签
  const tabChange = (index) => {
    setTabIndex(index);
    requestListData({
      pageIndex: 0,
      tabIndex: index,
    }, false)
  }

  // 订单详情
  const clickOrderDetail = (orderId) => {
    console.log(orderId)
    Taro.ROUTER.navigateTo('/pages/orderDetail/index');
  }

  // 我的积分
  const topBarView = () => {
    return (
      <View className='mine-point-wrap'>
        <View className="point-bg-wrap">
          <Image className='point-img' fit='contain' src={imgTopBar}></Image>
          <View className='point-title'>{userInfo.points >= 0 ? userInfo.points : '--'}</View>
          <View className='point-btn' onClick={clickMyExchange}>查看我正参与的兑换</View>
        </View>               
      </View>
    )
  }

  // 我的订单
  const tabView = () => {
    return (
      <>
        <View className='mine-order-wrap'>
          <Image className='order-img' fit='contain' src={imgOrder}></Image>
          <View className='order-title'>我的订单</View>
        </View>
        <View className='mine-tab-wrap'>
          <View className="tab-item" onClick={() => tabChange(0)}>
            <View className={tabIndex === 0 ? 'tab-item-text-focus' : 'tab-item-text'}>全部</View>
            <View className={tabIndex === 0 ? 'tab-item-line-focus' : 'tab-item-line'}></View>
          </View>
          <View className="tab-item" onClick={() => tabChange(1)}>
            <View className={tabIndex === 1 ? 'tab-item-text-focus' : 'tab-item-text'}>已取消</View>
            <View className={tabIndex === 1 ? 'tab-item-line-focus' : 'tab-item-line'}></View>
          </View>
        </View> 
      </>
    )
  }

  // 订单标签
  const listView = () => {
    return (
      dataList.map((item, index) => {
        return (
          <PGOrderView key={index} orderInfo={item} onClick={() => clickOrderDetail()}></PGOrderView>
        );
      })
    )
  }

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='mine-list' id='scroll'>
              {topBarView()}
              {tabView()}
              {listView()}                                                          
            </View>
          </PullToRefresh>
          <PGTabBar sence='mine'></PGTabBar>
          <PGAlertAgree></PGAlertAgree>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
</>
  );
}
