import { useState } from "react";
import { PullToRefresh, InfiniteLoading, Swiper, Image, Indicator } from "@nutui/nutui-react";
import { View, Input } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertAgree from "../../components/pgAlertAgree/index";
import PGGoodsView from "../../components/pgGoodsView/index";
import PGLoading from "../../components/pgLoading/index";
import PGTabBar from "../../components/pgTabbar/index";

import imgSearchBar from "../../images/home-search-bar.png";
import imgSearchBarIcon from "../../images/home-search-bar-icon.png";

export default function Index() {

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();   
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("首页");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("首页");
    setIsShowPage(true);

    requestListData({
      pageIndex: 0,
      activityId: '',
    }, false)
  };

  const [isShowPage, setIsShowPage] = useState(false);

  // 下拉刷新
  const refreshData = () => {
    return requestListData({
      pageIndex: 0,
      activityId: '',
    }, false)
  };

  // 上拉加载
  const [dataList, setDataList] = useState([]);
  const [pageCurrentIndex, setPageCurrentIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    await requestListData({
      pageIndex: pageCurrentIndex,
      activityId: '',
    }, true)
  };

   // request
  async function requestListData(query, isLoadMore) {

    const pageIndex = query.pageIndex || 0
    const activityId = query.activityId || ''

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
      activityId: activityId,
    }

    const res = await Taro.NETWORK.activityList(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}

      const banner = resData.activityCarouselImages || []
      const list = resData.activityProducts || []
      const totalPages = resData.totalPages || 0

      let newList = []
      if (isLoadMore) {
        newList = dataList.concat(list)
      } else {
        newList = list
      }
            
      setBannerList(banner)
      setCurrentIndex(0)
      
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

  // 商品列表
  const goodsListView = () => {
    return (
      <View className='home-grid-bg-wrap'>
        <View className='home-grid-wrap'>
          {
            dataList && dataList.length > 0 && dataList.map((item, index) => {
              return (
                <PGGoodsView key={index} item={item}></PGGoodsView>
              );
            })
          }
        </View>
      </View>      
    )
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
    Taro.ROUTER.navigateTo(`/pages/search/index?keyword=${value}`);
  };

  const searchBarView = () => {
    return (
      <View className="home-search-wrap">
        <Image className='home-search-img' fit='fill' src={imgSearchBar}></Image>
        <View className='home-search-bar-wrap'>                   
          <View className='home-search-bar'>
            <Input 
              className='home-search-input' 
              type='text' 
              placeholder='请输入商品名称搜索' 
              value={searchValue || ''}
              onInput={searchOnChange} 
              onConfirm={searchOnConfirm}
            />
            <View className="home-search-btn" onClick={searchOnConfirm}>
              <Image className='home-search-icon' fit='contain' src={imgSearchBarIcon}></Image>                      
            </View>
          </View>
        </View>                 
      </View>
    )
  }

  // 轮播图
  const [bannerList, setBannerList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const onChangeSwiperItem = (index) => {
      console.log('onChangeSwiperItem', index)
      setCurrentIndex(index)
    }
  
  const swiperView = () => {
    return (
      <View className='home-swiper-wrap'>
        <Swiper 
          className='swiper-item'
          loop
          indicator={false}
          onChange={onChangeSwiperItem}
        >
          {
            bannerList && bannerList.length > 0 && bannerList.map((item, index) => {
              return (
                <Swiper.Item key={index} className='swiper-item' onClick={() => clickBanner(item)}>
                  <Image className='swiper-item-img' src={item.imageUrl} fit='cover' />
                </Swiper.Item>
              );
            })
          }
        </Swiper>
        {
          bannerList.length > 1? (
            <View className="home-swiper-slide">
              <Indicator total={bannerList.length} type="dualScreen" current={currentIndex} />
            </View> 
          ) : null
        }
      </View>
    )
  };

  const clickBanner = (item) => {
    console.log("clickBanner", item);
    const url = item.url;
    Taro.ROUTER.navigateToWeb(url);
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='home-list' id='scroll'>              
              <InfiniteLoading target='scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={Taro.UTIL.refreshRenderFooterSvg('加载中')} loadMoreText={Taro.UTIL.refreshRenderFooterSvg('没有更多了')}>
                {searchBarView()}      
                {bannerList && bannerList.length > 0 ? swiperView() : null}
                {goodsListView()}                
              </InfiniteLoading>
            </View>
          </PullToRefresh>
          <PGTabBar sence='home'></PGTabBar>
          <PGAlertAgree></PGAlertAgree>          
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
