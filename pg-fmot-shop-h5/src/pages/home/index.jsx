import { useState } from "react";
import {
  PullToRefresh,
  InfiniteLoading,
  Toast,
  Dialog,
  Swiper,
  Image,
  Indicator
} from "@nutui/nutui-react";
import { View, Input } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGAlertPrivacy from "../../components/pgAlertPrivacy/index";
import PGGoodsView from "../../components/pgGoodsView/index";
import PGLoading from "../../components/pgLoading/index";
import PGTabBar from "../../components/pgTabbar/index";

import imgSearchBar from "../../images/home-search-bar.png";
import imgSearchBarIcon from "../../images/home-search-bar-icon.png";

export default function Index() {
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
    init();
    checkAlertStatus();
  };

  const [isShowPage, setIsShowPage] = useState(false);

  const state = {
    src: "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
    title:
      "洋甘菊无硅油天然洋甘菊无硅油天然",
    price: "388.0",
    vipPrice: "378",
    shopDescription: "自营",
    delivery: "厂商配送",
  };

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
      <View className='home-grid-bg-wrap'>
        <View className='home-grid-wrap'>
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

  // 弹窗
  const [visible, setVisible] = useState(false);
  const checkAlertStatus = () => {
    setVisible(true);
    Taro.hideTabBar();
  };

  const clickAlertConfirm = () => {
    setVisible(false);
    Taro.showTabBar();
  };

  const alertView = () => {
    return (
      <Dialog
        className='home-alert'
        title='请同意协议条款'
        visible={visible}
        hideCancelButton
        confirmText='同意'
        onConfirm={() => clickAlertConfirm()}
      >
        <View className='home-alert-content'>
          文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容
        </View>
      </Dialog>
    );
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
  const bannerList = [
    {
      imgUrl: 'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      url: 'https://www.baidu.com'
    },
    {
      imgUrl: 'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      url: 'https://www.baidu.com'
    },
    {
      imgUrl: 'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      url: 'https://www.baidu.com'
    },
    {
      imgUrl: 'https://storage.360buyimg.com/jdc-article/fristfabu.jpg',
      url: 'https://www.baidu.com'
    },
  ];

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
            bannerList.map((item, index) => {
              return (
                <Swiper.Item key={index} className='swiper-item' onClick={() => clickBanner(item)}>
                  <Image className='swiper-item-img' src={item.imgUrl} fit='cover' />
                </Swiper.Item>
              );
            })
          }
        </Swiper>
        <View className="home-swiper-slide">
          <Indicator total={bannerList.length} type="dualScreen" current={currentIndex} />
        </View>      
      </View>
    );
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
            <View className={visible ? 'home-list' : 'home-tab-list'} id='scroll'>              
              <InfiniteLoading target='scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={Taro.UTIL.refreshRenderFooterSvg('加载中')} loadMoreText={Taro.UTIL.refreshRenderFooterSvg('没有更多了')}>
                {searchBarView()}      
                {swiperView()}
                {goodsListView()}                
              </InfiniteLoading>
            </View>
          </PullToRefresh>
          {/* {alertView()} */}
          <PGTabBar></PGTabBar>
          <PGAlertPrivacy></PGAlertPrivacy>          
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
