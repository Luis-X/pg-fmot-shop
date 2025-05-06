import { useState } from "react";
import { 
  PullToRefresh, 
  InfiniteLoading, 
  Swiper, 
  Indicator, 
  Image as ImageNut
} from "@nutui/nutui-react";
import { View, Input, Image, ScrollView } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow, useDidHide, useUnload } from "@tarojs/taro";
import "./index.scss";

import PGAlertAgree from "../../components/pgAlertAgree/index";
import PGGoodsView from "../../components/pgGoodsView/index";
import PGLoading from "../../components/pgLoading/index";
import PGTabBar from "../../components/pgTabbar/index";

import ASSET_IMG from '../../utils/assetImg.js'

const imgSearchBar = ASSET_IMG.assetImgWithName('home-search-bar.png')
const imgSearchBarIcon = ASSET_IMG.assetImgWithName('home-search-bar-icon.png')

export default function Index() {

  const router = useRouter()

  const [trackId, setTrackId] = useState('')
  const configTracker = (type, trackData) => {
    if (type === 1) {
      // 活动首页浏览
      Taro.TRACKER.eventTracker('ACTIVITY_HOME_PAGE', trackData, eventId => {
        if (eventId) {
          setTrackId(eventId)
        }       
      })
    }
  }

  useLoad(() => {
    console.log('home onLoad')
    Taro.WXSDK.hideOptionMenu();
    createdPage();   
  });

  useDidShow(() => {
    console.log('home onShow')
    Taro.WXSDK.hideOptionMenu();
    configTracker(1, {
      activityId: actId,
      pointAccountId: accId,
    })  
  });

  useDidHide(() => {
    console.log('home onHide')
    if (trackId) {
      configTracker(1, {
        activityId: actId,
        pointAccountId: accId,
        id: trackId,
      })
    }    
  });

  useUnload(() => {
    console.log('home onUnload')
    if (trackId) {
      configTracker(1, {
        activityId: actId,
        pointAccountId: accId,
        id: trackId,
      })
    } 
  })

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }

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
      setBannerList([])
      setCurrentIndex(0)
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
                <PGGoodsView key={index} item={item} act={actId} acc={accId}></PGGoodsView>
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
    setSearchValue(value)
  };

  const searchOnConfirm = () => {
    const value = searchValue || ''
    Taro.ROUTER.navigateTo(`/pages/search/index?act=${actId}&acc=${accId}&q=${value}`);
  };

  const searchBarView = () => {
    return (
      <View className="home-search-wrap">
        <Image className='home-search-img' mode='aspectFill' src={imgSearchBar}></Image>
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
              <Image className='home-search-icon' mode='aspectFit' src={imgSearchBarIcon}></Image>                      
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
    setCurrentIndex(index)
  }
  
  const swiperView = () => {
    return (
      <View className='home-swiper-wrap'>
        <Swiper 
          className='swiper-item'
          loop
          indicator={false}
          touchable={bannerList.length > 1 ? true : false}
          onChange={onChangeSwiperItem}
        >
          {
            bannerList && bannerList.length > 0 && bannerList.map((item, index) => {
              return (
                <Swiper.Item key={index} className='swiper-item' onClick={() => clickBanner(item)}>
                  <ImageNut className='swiper-item-img' src={item.imageUrl} fit="cover" lazy={false} loading={false} />
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
    const url = item.url;
    if (!url) {
      console.log('url 为空')
      return
    }
    Taro.ROUTER.navigateToWeb(url);
  };

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()}>
            <View className='home-list' id='home-scroll'>              
              <InfiniteLoading target='home-scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={'加载中...'} loadMoreText={'没有更多了'}>
                {searchBarView()}      
                {bannerList && bannerList.length > 0 ? swiperView() : null}
                {goodsListView()}                
              </InfiniteLoading>
            </View>
          </PullToRefresh>
          <PGTabBar sence='home' act={actId} acc={accId}></PGTabBar>
          <PGAlertAgree></PGAlertAgree>          
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
