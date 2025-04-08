import { useState } from "react";
import {
  PullToRefresh,
  InfiniteLoading,
  Image
} from "@nutui/nutui-react";
import { View  } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";

import imgIcon from '../../images/exchange-icon.png';
import imgArrow from '../../images/exchange-arrow.png';

export default function Index() {
  const sleep = (time) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  };

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
    init();
  };

  const [isShowPage, setIsShowPage] = useState(false);

  // 下拉刷新
  const refreshData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, 1000);
    });
  };

  // 上拉加载
  const [defaultList, setDefaultList] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    await sleep(2000);
    const curLen = defaultList.length;
    for (let i = curLen; i < curLen + 10; i++) {
      defaultList.push(`${i}`);
    }
    if (defaultList.length >= 30) {
      setHasMore(false);
    } else {
      setDefaultList([...defaultList]);
    }
  };

  const init = () => {
    for (let i = 0; i < 20; i++) {
      defaultList.push(`${i}`);
    }
    setDefaultList([...defaultList]);
  };

  // 活动首页
  const clickItem = (item) => {
    const id = item;
    Taro.UTIL.goToActivityHomeWithId(id)
  }

  // 兑换列表
  const exchangeListView = () => {
    return defaultList.map((item, index) => {
      return (
        <View className='exchange-bg-wrap' key={index} onClick={() => clickItem(index)}>
          <View className='exchange-wrap'>
            <Image className='exchange-img' fit='contain' src={imgIcon}></Image>
            <View className='exchange-info'>
              <View className='exchange-name'>活动名称{index}</View>
              <View className='exchange-desc'>开始时间：2025-01-01</View>
              <View className='exchange-desc'>截止时间：2025-01-01</View>
            </View>
            <Image className='exchange-arrow' fit='contain' src={imgArrow}></Image>
          </View>
        </View>        
      );
    });
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() =>refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='exchange-list' id='scroll'>
              <InfiniteLoading target='scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={Taro.UTIL.refreshRenderFooterSvg('加载中')} loadMoreText={Taro.UTIL.refreshRenderFooterSvg('没有更多了')}>
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
