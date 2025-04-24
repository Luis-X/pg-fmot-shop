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
      // Taro.HUD.showLoading()
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
    Taro.UTIL.goToActivityHomeWithActId(activityId, pointAccountId)

    // requestLoginData({
    //   activityId: actId,
    //   pointAccountId: accId,
    // })
  }
  // FIXME: 活动对应账号和token
  async function requestLoginData(query) {
    
    const params = {
      ...query 
    }

    const res = await Taro.NETWORK.login(params) 

    const activityId = params.activityId || ''

    if (res.code === 0) {
      const resData = res.data || {}
      userDataHandler(params, resData)
    } else if (res.code === -20004)  {
      // SSO账号不存在
      Taro.HUD.showToastMessage(res.message)
    } else if (res.code === -20005)  {
      // 该积分账号已绑定
      Taro.HUD.showToastMessage(res.message)
    } else if (res.code === -20006)  {
      // 用户账号状态异常
      console.log("用户账号状态异常");
      Taro.ROUTER.redirectTo(`/pages/disable/index?act=${activityId}&status=2`);
    } else if (res.code === -20007)  {
      // 当前不在活动时间
      console.log("当前不在活动时间");
      Taro.ROUTER.redirectTo(`/pages/disable/index?act=${activityId}&status=1`);
    } else {
      Taro.HUD.showToastMessage(res.message)
    }
  }

  // 活动处理
  const userDataHandler = (params, resData) => {
    const activityId = params.activityId || ''
    const pointAccountId = resData.pointAccountId || ''
    console.log('活动时间内，账号正常')

    // 登录信息      
    const token = resData.token || ''
    const tokenInfo = {
      token: token
    }
    Taro.UTIL.setPGStorage('token_info', tokenInfo)
      
    // 用户信息
    const loginInfo = resData
    Taro.UTIL.setPGStorage('login_info', loginInfo)
      
    // 活动信息
    const activityInfo = {
      act: activityId,
      acc: pointAccountId,
    }
    Taro.UTIL.setPGStorage('activity_info', activityInfo)

    // 活动类型、绑定状态
    const activityData = resData.activity || {}
    const activityType = activityData.activityType || '';
    const isBind = pointAccountId ? true : false;

    // 内部活动
    if (activityType === 'EMPLOYEE') {
      console.log("内部活动")
      if (isBind) {
        console.log("内部-已绑定");
        Taro.UTIL.goToActivityHomeWithActId(activityId, pointAccountId)
      } else {
        console.log("内部-未绑定");
        console.log("内部-sso登录");
        Taro.UTIL.goToSSOLoginWithActId(activityId)           
      }
      return
    }      
    // 外部活动
    if (activityType === 'CUSTOMER') {
      console.log("外部活动")
      if (isBind) {
        console.log("外部-已绑定");
        Taro.UTIL.goToActivityHomeWithActId(activityId, pointAccountId)
      } else {
        console.log("外部-未绑定");
        console.log("进入登录页");
        Taro.ROUTER.redirectTo(`/pages/login/index?act=${activityId}`);
      }
      return
    }
    // 未知活动
    console.log("未知活动")
    Taro.HUD.showToastMessage('未知活动')
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
