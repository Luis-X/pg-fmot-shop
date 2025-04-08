import { useState } from "react";
import {
  PullToRefresh,
  Badge,
  Swiper,
  Tag,
  Image,
  Indicator
} from "@nutui/nutui-react";
import { View, Video } from "@tarojs/components";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";

import imgPriceBar from "../../images/detail-price-bar.png";
import imgService from "../../images/detail-service.png";
import imgCart from "../../images/detail-cart.png";
import imgLine from "../../images/detail-line.png";
import imgCartAdd from "../../images/detail-cart-add.png";

export default function Index() {

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    setTimeout(() => {
      createdPage();
    }, 1000);
  });

  useDidShow(() => {
    if (isShowPage) {
      Taro.TRACKER.pageViewTracker("商品详情");
    }
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {
    // const isLogin = await Taro.UTIL.checkIsLogin()
    // if (!isLogin) {
    //   return
    // }
    Taro.TRACKER.pageViewTracker("商品详情");
    setIsShowPage(true);

    requestData()
  };

  const [isShowPage, setIsShowPage] = useState(false);

  const [goodsInfo, setGoodsInfo] = useState({});  

  // 视频
  const [videoSource, setVideoSource] = useState({});

  const videoOptions = {
    initialTime: 0,
    controls: true,
    autoplay: false,   
    loop: false,    
    muted: false,
    showProgress: false,
  }

  const [currentTime, setCurrentTime] = useState(0);
  const onVideoPlay = (elm) => {
    console.log('播放开始', elm)
  }

  const onVideoPause = (elm) => {
    console.log('播放暂停', elm)
  }

  const onVideoPlayend = (elm) => {
    console.log('播放结束', elm)
  }
  
  const onVideoTimeUpdate = (elm) => {   
    const time = elm.detail.currentTime;
    console.log('当前播放时长: ', time);
    setCurrentTime(time);
  };

  // 下拉刷新
  const refreshData = () => {
    return requestData()
  };

  // request
  async function requestData(id) {
    const params = {
      id: id
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.goodsDetail(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const banner = resData.banner || []
      const video = resData.video || {}
      setGoodsInfo(resData)
      setBannerList(banner)
      setVideoSource(video)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 确认购买
  const clickConfirmBuy = () => {
    setIsAlertShow(false);
    Taro.ROUTER.navigateTo('/pages/orderConfirm/index');
  };

  // 客服
  const clickService = () => {
    Taro.ROUTER.navigateTo('/pages/service/index');
  }

  // 购物车
  const clickCart = () => {
    Taro.ROUTER.navigateTo('/pages/cart/index');
  }

  // 加入购物车
  const [cartNum, setCartNum] = useState(0);
  const clickCartAdd = () => {
    const id = 0;
    const maxLimit = 10;
    const num = cartNum + 1;
    if (num >= maxLimit) {
      Taro.HUD.showToastMessage('加购商品超过数量上限')
      return;
    }
    requestAddCartData(id, num)
  }

  async function requestAddCartData(id, num) {
    const params = {
      id: id
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.goodsAddCart(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setCartNum(num)
      Taro.HUD.showToastMessage('加入购物车成功')
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 立即购买
  const clickBuyNow = () => {
    setIsAlertShow(true);
  }

  // 工具栏
  const toolsView = () => {
    return (
      <View className='detail-tools-wrap'>
        <View className='tools-bar'>
          <View className='left-btn-wrap'>
            <View className='left-btn' onClick={() => clickService()}>
              <Image className='left-btn-img' fit='contain' src={imgService}></Image>
            </View>
            <Image className='left-btn-line' fit='contain' src={imgLine}></Image>            
              <View className='left-btn' onClick={() => clickCart()}>
                <Image className='left-btn-img' fit='contain' src={imgCart}></Image>
                <Badge className="left-btn-tag" value={cartNum} max={99}></Badge>                
              </View> 
          </View>              
          <View className='right-btn-wrap'>
            <View className='right-btn-add'onClick={() => clickCartAdd()}>
              <Image className='right-btn-add-img' fit='contain' src={imgCartAdd}></Image>
            </View>
            <View className='right-btn-buy'onClick={() => clickBuyNow()}>立即购买</View>
          </View>
        </View>
      </View>
    )
  }

  // 弹窗
  const [isAlertShow, setIsAlertShow] = useState(false);
  const alertView = () => {
    return (
      <PGAlertConfirm
        show={isAlertShow}
        styleType={1}
        title='确认购买'
        desc='直接跳转至积分结算页面'        
        confirmText='兑换'
        cancelText='取消'            
        onConfirm={() => clickConfirmBuy()}
        onCancel={() => setIsAlertShow(false)}
      >
      </PGAlertConfirm>
    )
  }
  
  // 轮播图
  const [bannerList, setBannerList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)

  const clickSwiperItem = (item) => {
    const currentUrl = item;
    const urlList = list;
    Taro.previewImage({
      current: currentUrl,
      urls: urlList
    })
  }

  const [videoPauseTime, setVideoPauseTime] = useState(0);
  
  const onChangeSwiperItem = (index) => {
    console.log('onChangeSwiperItem', index)

    setCurrentIndex(index)

    const videoContext = Taro.createVideoContext('swiper-video-ref');
    if(!videoContext) {
      return
    }

    if (index === 0) {
      if (videoPauseTime > 0) {
        videoContext.seek(videoPauseTime);
        // videoContext.play();
      }     
    } else {
      if (currentTime > 0) {
        setVideoPauseTime(currentTime)
        videoContext.pause();
      }    
    }
  }
  
  const swiperView = () => {
    return (
      <View className='detail-swiper-wrap'>
        <Swiper 
          className='swiper-item'
          loop
          indicator={false}
          onChange={onChangeSwiperItem}
        >
          {bannerList.map((item, index) => {
            return (
              <Swiper.Item key={index} className='swiper-item' >
                {
                  index === 0 ? (
                    <View className='swiper-item'>
                    <Video 
                      className='swiper-video'
                      id='swiper-video-ref'
                      src={videoSource.src}
                      poster={videoSource.poster}
                      initialTime={videoOptions.initialTime}
                      controls={videoOptions.controls}
                      autoplay={videoOptions.autoplay}
                      loop={videoOptions.loop}
                      muted={videoOptions.muted}
                      onPlay={onVideoPlay}
                      onPause={onVideoPause}
                      onPlayend={onVideoPlayend}
                      onTimeUpdate={onVideoTimeUpdate}
                    />
                    </View>                    
                  ) : (
                    <View className='swiper-item'>
                      <Image className='swiper-img' src={item} fit='cover' onClick={clickSwiperItem} />
                    </View>                   
                  )
                }                
              </Swiper.Item>
            );
          })}
        </Swiper>
        <View className="detail-swiper-slide">
          <Indicator total={bannerList.length} type="dualScreen" current={currentIndex} />
        </View>   
      </View>     
    )
  }

  // 商品信息
  const goodsInfoView = () => {
    return (
      <>
        <View className='detail-price-wrap'>
          <Image className='detail-price-img' fit='fill' src={imgPriceBar}></Image>
          <View className='detail-price-item'>
            <View className='detail-price-new-wrap'>
              <View className='detail-price-new'>{goodsInfo.vipPrice}</View>
              <View className='detail-price-new-unit'>积分</View>
            </View>       
            {
              goodsInfo.price && (
                <View className='detail-price-old'>{goodsInfo.price}积分</View>
              )
            }     
          </View>           
        </View>
        <View className='detail-name-wrap'>
          <View className='detail-name'>{goodsInfo.title}</View>
        </View>
        <View className='detail-tag-wrap'>
          <View className='detail-tag-item'>
            <Tag className='detail-tag-text'>{goodsInfo.shopDescription}</Tag>
            <Tag className='detail-tag-text'>{goodsInfo.shopName}</Tag>
            <Tag className='detail-tag-text'>{goodsInfo.delivery}</Tag>
          </View>          
        </View>
      </>
    )
  }

  // 商品视频、图片
  const goodsVideoAndImgView = () => {
    return (
      <>
        <View className='detail-divider-wrap'>
          <View className='detail-divider'>商品详情</View>
        </View>  
        {
          videoSource.src ? (
            <View className='detail-video-wrap'>
              <View className='detail-video-item'>
              <Video 
                className='detail-video'
                id='video'
                src={videoSource.src}
                poster={videoSource.poster}
                initialTime={videoOptions.initialTime}
                controls={videoOptions.controls}
                autoplay={videoOptions.autoplay}
                loop={videoOptions.loop}
                muted={videoOptions.muted}
                onPlay={onVideoPlay}
                onPause={onVideoPause}
                onPlayend={onVideoPlayend}
                onTimeUpdate={onVideoTimeUpdate}
              />
              </View>          
            </View>
          ) : null
        }
        {
          goodsInfo.src ? (
            <View className='detail-img-wrap'>
              <Image className='detail-img' src={goodsInfo.src} fit='contain'></Image>
            </View>
          ) : null
        }                     
      </>
    )
  }

  return (
    <>
      {isShowPage ? (
        <View className='pg-index'>
          <PullToRefresh onRefresh={() => refreshData()} renderIcon={(status) => Taro.UTIL.refreshRenderHeaderSvg(status)}>
            <View className='detail-list' id='scroll'>          
              {bannerList && bannerList.length > 0 ? swiperView() : null}
              {goodsInfo && goodsInfo.title ? goodsInfoView() : null}
              {(goodsInfo.video || goodsInfo.src) ? goodsVideoAndImgView() : null}
            </View>
          </PullToRefresh>
          {toolsView()}
          {alertView()}                   
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
