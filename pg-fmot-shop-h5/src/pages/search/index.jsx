import { useState } from "react";
import {
  PullToRefresh,
  InfiniteLoading,
  Toast,
  Image,
} from "@nutui/nutui-react";
import { View, Input } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertPrivacy from "../../components/pgAlertPrivacy/index";
import PGGoodsView from "../../components/pgGoodsView/index";
import PGLoading from "../../components/pgLoading/index";

import imgSearchBar from "../../images/home-search-bar.png";
import imgSearchBarIcon from "../../images/home-search-bar-icon.png";


export default function Index() {

  const router = useRouter()

  const sleep = (time) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  };

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("搜索列表");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("搜索列表");
    setIsShowPage(true);
    init();

    const keyword = router.params.keyword || '';
    setSearchValue(decodeURIComponent(keyword));
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const state = {
    src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
    title:
      "【活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
    price: "388",
    vipPrice: "378",
    shopDescription: "自营",
    delivery: "厂商配送",
    shopName: "阳澄湖大闸蟹自营店>",
  };

  // 搜索
  const [searchValue, setSearchValue] = useState('')

  const searchOnChange = (e) => {
    const value = e.detail.value || ''
    console.log('searchOnChange', value)
    setSearchValue(value)
  };

  const searchOnConfirm = () => {
    const value = searchValue || ''
    console.log('searchOnConfirm', value)
  };

  const searchBarView = () => {
    return (
      <View className="search-search-wrap">
        <Image className='search-search-img' mode='aspectFill' src={imgSearchBar}></Image>
        <View className='search-search-bar-wrap'>                   
          <View className='search-search-bar'>
            <Input 
              className='search-search-input' 
              type='text' 
              placeholder='请输入商品名称搜索' 
              value={searchValue || ''}
              onInput={searchOnChange} 
              onConfirm={searchOnConfirm}
            />
            <View className="search-search-btn" onClick={searchOnConfirm}>
              <Image className='search-search-icon' mode='aspectFit' src={imgSearchBarIcon}></Image>                      
            </View>
          </View>
        </View>                 
      </View> 
    )
  }

  // 下拉刷新
  const refreshData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Toast.show("😊");
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

  // 商品列表
  const goodsListView = () => {
    return (
      <View className='search-grid-bg-wrap'>
        <View className='search-grid-wrap'>
          {
            defaultList.map((item, index) => {
              return (
                <PGGoodsView key={index} item={state}></PGGoodsView>
              );
            })
          }
        </View>
      </View>      
    )
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='search-list' id='scroll'>              
                <InfiniteLoading target='scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={Taro.UTIL.refreshRenderFooterSvg('加载中')} loadMoreText={Taro.UTIL.refreshRenderFooterSvg('没有更多了')}>
                {searchBarView()}
                {goodsListView()}
              </InfiniteLoading>
            </View>
          </PullToRefresh>
          <PGAlertPrivacy></PGAlertPrivacy>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
