import { useState } from "react";
import { PullToRefresh, InfiniteLoading } from "@nutui/nutui-react";
import { View, Image } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";

import imgIcon from '../../images/exchange-icon.png';
import imgArrow from '../../images/exchange-arrow.png';

export default function Index() {

  const router = useRouter()

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    setTimeout(() => {
      createdPage();
    }, 1000);
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("我的兑换");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("我的兑换");
    setIsShowPage(true);

    const act = router.params.act || ''
    const acc = router.params.acc || ''
    setActId(act)
    setAccId(acc)

    requestListData({
      activityId: act,
      pointAccountId: acc,
      pageIndex: 0,
    }, false)
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');

  // 下拉刷新
  const refreshData = () => {
    return requestListData({
      activityId: actId,
      pointAccountId: accId,
      pageIndex: 0,
    }, false)
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
    }, true)
  };

  // request
  async function requestListData(query, isLoadMore) {

    const pageIndex = query.pageIndex || 0
    const activityId = query.activityId || ''
    const pointAccountId = query.pointAccountId || ''

    if (!isLoadMore) {
      Taro.HUD.showLoading()
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
      size: 10
    }

    const res = await Taro.NETWORK.mineExchangeList(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || []

      const list = resData
      const totalPages = resData.totalPages || 0

      let newList = []
      if (isLoadMore) {
        newList = dataList.concat(list)
      } else {
        newList = list
      }
      
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

  // 活动首页
  const clickItem = (item) => {
    const actId = item.activityId || '';
    const accId = item.pointAccountId || '';
    Taro.UTIL.checkUserStatusGoHome(actId, accId)
  }

  // 兑换列表
  const exchangeListView = () => {
    return dataList.map((item, index) => {
      return (
        <View className='exchange-bg-wrap' key={index} onClick={() => clickItem(item)}>
          <View className='exchange-wrap'>
            <Image className='exchange-img' mode='aspectFit' src={imgIcon}></Image>
            <View className='exchange-info'>
              <View className='exchange-name'>{item.name}</View>
              <View className='exchange-desc'>{`开始时间：${Taro.UTIL.dateFormatter(item.beginDate, 'YYYY-MM-DD')}`}</View>
              <View className='exchange-desc'>{`截止时间：${Taro.UTIL.dateFormatter(item.endDate, 'YYYY-MM-DD')}`}</View>
            </View>
            <Image className='exchange-arrow' mode='aspectFit' src={imgArrow}></Image>
          </View>
        </View>        
      );
    });
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() =>refreshData()}>
            <View className='exchange-list' id='exchange-scroll'>
              <InfiniteLoading target='exchange-scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={'加载中...'} loadMoreText={'没有更多了'}>
                <View className="exchange-space-top"></View>
                {exchangeListView()}
              </InfiniteLoading>
            </View>
          </PullToRefresh>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
