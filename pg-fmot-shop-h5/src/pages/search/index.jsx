import { useState } from "react";
import { PullToRefresh, InfiniteLoading } from "@nutui/nutui-react";
import { View, Input, Image, ScrollView } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGGoodsView from "../../components/pgGoodsView/index";
import PGLoading from "../../components/pgLoading/index";

import imgSearchBar from "../../images/home-search-bar.png";
import imgSearchBarIcon from "../../images/home-search-bar-icon.png";


export default function Index() {

  const router = useRouter()

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

    const act = router.params.act || ''
    const acc = router.params.acc || ''    
    setActId(act)
    setAccId(acc)

    const q = decodeURIComponent(router.params.q || '');
    setSearchValue(q);

    requestListData({
      activityId: act,
      pointAccountId: acc,
      pageIndex: 0,
      keyword: q,
    }, false)
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [searchValue, setSearchValue] = useState('')

  const searchOnChange = (e) => {
    const value = e.detail.value || ''
    console.log('searchOnChange', value)
    setSearchValue(value)
  };

  const searchOnConfirm = () => {
    const value = searchValue || ''
    console.log('searchOnConfirm', value)
    requestListData({
      activityId: actId,
      pointAccountId: accId,
      pageIndex: 0,
      keyword: value,
    }, false)
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
    return requestListData({
      activityId: actId,
      pointAccountId: accId,
      pageIndex: 0,
      keyword: searchValue,
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
      keyword: searchValue,
    }, true)
  };

  // request
  async function requestListData(query, isLoadMore) {

    const pageIndex = query.pageIndex || 0
    const activityId = query.activityId || ''
    const pointAccountId = query.pointAccountId || ''
    const keyword = query.keyword || ''    

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
      size: 10,
      keyword: keyword,
    }
    
    const res = await Taro.NETWORK.searchList(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}

      const activityProducts = resData.activityProducts || []
      let list = []
      const totalPages = resData.totalPages || 0

      // 过滤
      if (keyword) {
        list = activityProducts.filter((item) => {
          const productData = item.product || {}
          const nameValue = productData.name || ''
          return nameValue.indexOf(keyword) > -1
        })
      } else {
        list = activityProducts
      }

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
  

  // 商品列表
  const goodsListView = () => {
    return (
      <View className='search-grid-bg-wrap'>
        <View className='search-grid-wrap'>
          {
            dataList.map((item, index) => {
              return (
                <PGGoodsView key={index} item={item} act={actId} acc={accId}></PGGoodsView>
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
          <PullToRefresh onRefresh={() => refreshData()}>
            <View className='search-list' id='search-scroll'>              
                <InfiniteLoading target='search-scroll' hasMore={hasMore} onLoadMore={loadMore} loadingText={'加载中...'} loadMoreText={'没有更多了'}>
                {searchBarView()}
                {goodsListView()}
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
