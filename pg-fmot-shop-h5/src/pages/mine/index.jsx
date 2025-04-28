import { useState } from "react";
import { PullToRefresh, InfiniteLoading } from "@nutui/nutui-react";
import { View, Image } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertAgree from "../../components/pgAlertAgree/index";
import PGOrderView from "../../components/pgOrderView/index";
import PGLoading from "../../components/pgLoading/index";
import PGTabBar from "../../components/pgTabbar/index";

import ASSET_IMG from '../../utils/assetImg.js'

const imgTopBar = ASSET_IMG.assetImgWithName('mine-top-bar.png')
const imgOrder = ASSET_IMG.assetImgWithName('mine-order.png')

export default function Index() {

  const router = useRouter()
  

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("我的");
    }
    Taro.WXSDK.hideOptionMenu();

    // 取消后，刷新
    const orderCancelInfo = Taro.UTIL.getPGStorage('order_cancel_info') || {}
    if (orderCancelInfo.needRefresh) {
      Taro.UTIL.clearPGStorage('order_cancel_info')
      refreshData()
    }
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("我的");
    setIsShowPage(true);

    const act = router.params.act || ''
    const acc = router.params.acc || ''
    setActId(act)
    setAccId(acc)
    
    setTabId(0)

    requestListData({
      activityId: act,
      pointAccountId: acc,
      pageIndex: 0,
      tabIndex: 0,
    }, false)
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [tabId, setTabId] = useState(0)

  const [availablePoint, setAvailablePoint] = useState(-1)

  // 下拉刷新
  const refreshData = () => {
    return requestListData({
      activityId: actId,
      pointAccountId: accId,
      pageIndex: 0,
      tabIndex: tabId,
    }, false);
  };

  // 上拉加载
  const [dataList, setDataList] = useState([]);
  const [pageCurrentIndex, setPageCurrentIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    await requestListData({
      activityId: actId,
      pointAccountId: accId,
      pageIndex: pageCurrentIndex,
      tabIndex: tabId,
    }, true)
  };

  // request
  async function requestListData(query, isLoadMore) {

    const pageIndex = query.pageIndex || 0
    const tabIndex = query.tabIndex || 0
    const activityId = query.activityId || ''
    const pointAccountId = query.pointAccountId || ''

    if (!isLoadMore) {
      // Taro.HUD.showLoading()
      setAvailablePoint(-1)
      setDataList([])
    } else {
      if (pageIndex > 0 && !hasMore) {
        console.log('no more')
        return
      }
    }

    const params = {
      activityId: activityId,
      pointAccountId: pointAccountId,
      page: pageIndex,
      size: 10,
    }

    const res = await Taro.NETWORK.mineOrderList(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}

      const availablePoint = resData.availablePoint || 0   
      const orders = resData.orders || []   
      let list = []
      const totalPages = resData.totalPages || 0

      // 过滤
      if (tabIndex === 1) {
        list = orders.filter((item) => {
          return item.orderStatus === 'CANCELED'
        })
      } else {
        list = orders
      }

      // 分页
      let newList = []
      if (isLoadMore) {
        newList = dataList.concat(list)
      } else {
        newList = list
      }

      setAvailablePoint(availablePoint)
      setDataList(newList)  
      setPageCurrentIndex(pageIndex + 1)
      
      // 没有更多
      if (pageIndex >= totalPages - 1) {
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
    Taro.ROUTER.navigateTo(`/pages/exchange/index?act=${actId}&acc=${accId}`);
  };

  // 标签
  const tabChange = (index) => {
    setTabId(index);
    requestListData({
      activityId: actId,
      pointAccountId: accId,
      pageIndex: 0,
      tabIndex: index,
    }, false)
  }

  // 订单详情
  const clickOrderDetail = (item) => {    
    const orderId = item.id || ''
    Taro.ROUTER.navigateTo(`/pages/orderDetail/index?act=${actId}&acc=${accId}&id=${orderId}`);
  }

  // 我的积分
  const topBarView = () => {
    return (
      <View className='mine-point-wrap'>
        <View className="point-bg-wrap" onClick={clickMyExchange}>
          <Image className='point-img' mode='aspectFit' src={imgTopBar} ></Image>
          <View className='point-title'>{availablePoint >= 0 ? availablePoint : '--'}</View>
          <View className='point-btn'>查看我正在参与的兑换</View>
        </View>               
      </View>
    )
  }

  // 我的订单
  const tabView = () => {
    return (
      <>
        <View className='mine-order-wrap'>
          <Image className='order-img' mode='aspectFit' src={imgOrder}></Image>
          <View className='order-title'>我的订单</View>
        </View>
        <View className='mine-tab-wrap'>
          <View className="tab-item" onClick={() => tabChange(0)}>
            <View className={tabId === 0 ? 'tab-item-text-focus' : 'tab-item-text'}>全部</View>
            <View className={tabId === 0 ? 'tab-item-line-focus' : 'tab-item-line'}></View>
          </View>
          <View className="tab-item" onClick={() => tabChange(1)}>
            <View className={tabId === 1 ? 'tab-item-text-focus' : 'tab-item-text'}>已取消</View>
            <View className={tabId === 1 ? 'tab-item-line-focus' : 'tab-item-line'}></View>
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
          <PGOrderView key={index} orderInfo={item} act={actId} acc={accId} onClick={() => clickOrderDetail(item)}></PGOrderView>
        );
      })
    )
  }

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()}>
            <View className='mine-list' id='mine-scroll'>
              <InfiniteLoading target='mine-scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={'加载中...'} loadMoreText={'没有更多了'}>
                {topBarView()}
                {tabView()}
                {listView()}        
              </InfiniteLoading>                                                  
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
