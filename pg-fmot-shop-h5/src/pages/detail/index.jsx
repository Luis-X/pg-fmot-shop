import { useState, useRef } from "react";
import {
  PullToRefresh,
  Badge,
  Swiper,
  Tag,  
  Indicator,
  Image as ImageNut,
  Video as VideoNut,
} from "@nutui/nutui-react";
import { View, Video, Image, ScrollView } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";

import imgPriceBar from "../../images/detail-price-bar.png";
import imgService from "../../images/detail-service.png";
import imgCart from "../../images/detail-cart.png";
import imgLine from "../../images/detail-line.png";
import imgCartAdd from "../../images/detail-cart-add.png";
import imgVideoPlay from "../../images/detail-video-play.png";

export default function Index() {

  const router = useRouter()

  const configTracker = (type) => {
    const trackData = {}
    if (type === 1) {
      Taro.TRACKER.eventTracker('PRODUCT_DETAIL_PAGE', trackData, "商品详情页-浏览人数/次数")
    } else if (type === 2) {
      Taro.TRACKER.eventTracker('PRODUCT_DETAIL_PAGE', trackData, "商品详情页-页面停留时长")
    } else if (type === 3) {
      Taro.TRACKER.eventTracker('PRODUCT_CAROUSEL_VIDEO', trackData, "商品详情页-轮播图视频播放时长")
    } else if (type === 4) {
      Taro.TRACKER.eventTracker('PRODUCT_CAROUSEL_VIDEO', trackData, "商品详情页-轮播图视频播放人数/次数")
    } else if (type === 5) {
      Taro.TRACKER.eventTracker('PRODUCT_CAROUSEL_VIDEO', trackData, "商品详情页-轮播图视频完播人数/次数")
    } else if (type === 6) {
      Taro.TRACKER.eventTracker('PRODUCT_DETAIL_VIDEO', trackData, "商品详情页-商品详情视频播放时长")
    } else if (type === 7) {
      Taro.TRACKER.eventTracker('PRODUCT_DETAIL_VIDEO', trackData, "商品详情页-商品详情视频播放人数/次数")
    } else if (type === 8) {
      Taro.TRACKER.eventTracker('PRODUCT_DETAIL_VIDEO', trackData, "商品详情页-商品详情视频完播人数/次数")
    } else if (type === 9) {
      Taro.TRACKER.eventTracker('PRODUCT_ADD_CART', trackData, "商品详情页-加购物车人数/次数")
    }
  }

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
    configTracker(1)
    configTracker(2)

    const act = router.params.act || ''
    const acc = router.params.acc || ''
    const id = router.params.id || '';
    setActId(act)
    setAccId(acc)
    setProductId(id);
    
    requestData({
      activityId: act,
      pointAccountId: acc,
      id: id,
    })
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [productId, setProductId] = useState('');

  // 商品信息
  const [goodsInfo, setGoodsInfo] = useState({});  
  // 视频信息
  const [isVideoPlay, setIsVideoPlay] = useState(false);
  const [videoSource, setVideoSource] = useState({});
  const [detailVideoSource, setDetailVideoSource] = useState({});

  const videoOptions = {
    initialTime: 0,
    controls: true,
    autoplay: false,   
    loop: false,    
    muted: false,
    showProgress: false,
  }

  const [currentTime, setCurrentTime] = useState(0);
  // 视频播放
  const clickPreviewVideo = () => {
    console.log('clickPreviewVideo', videoSource)
    videoPlay()   
  }

  // 视频播放
  const videoPlay = () => {
    setIsVideoPlay(true)
    console.log('videoPlay', videoSource)
    setTimeout(() => {
      const videoContext = Taro.createVideoContext('swiper-video-ref');
      if (videoContext) {
        videoContext.play();
      }   
    }, 500);    
  }

  // 视频暂停
  const videoPause = () => {
    console.log('videoPause', videoSource)
    const videoContext = Taro.createVideoContext('swiper-video-ref');
    if (videoContext) {
      videoContext.pause();
    }   
    setIsVideoPlay(false)
  }

  // 视频播放开始~
  const onVideoPlayEvent = (elm, sence) => {
    console.log('video 播放开始', elm)
    
    if (sence === 'banner') {
      configTracker(4)
    } else if (sence === 'detail') {
      if (elm) {
        elm.addEventListener('timeupdate', () => {
          const currentTime = Math.floor(elm.currentTime);
          console.log('视频播放时长：', currentTime);
        })
      }      
      configTracker(7)
    }
  }

  // 视频播放暂停~
  const onVideoPauseEvent = (elm, sence) => {
    console.log('video 播放暂停', elm)
  }

  // 视频播放结束~
  const onVideoPlayendEvent = (elm, sence) => {
    console.log('video 播放结束', elm)

    if (sence === 'banner') {
      configTracker(5)
    } else if (sence === 'detail') {
      configTracker(8)
    }
  }
  
  const onVideoTimeUpdate = (elm, sence) => {   
    const time = elm.detail.currentTime;
    console.log('当前播放时长: ', time);
    setCurrentTime(time);
    
    if (sence === 'banner') {
      configTracker(3)
    } else if (sence === 'detail') {
      configTracker(6)
    }
  };

  // 下拉刷新
  const refreshData = () => {
    return requestData({
      activityId: actId,
      pointAccountId: accId,
      id: productId
    })
  };

  // request
  async function requestData(query) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.goodsDetail(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const productData = resData.product || {}
      const banner = productData.productCarouselImages || []

      setGoodsInfo(resData)
      setBannerList(banner)

      // banner 视频
      const videoUrl = banner[0].videoUrl || ''
      const videoImgUrl = banner[0].videoImgUrl || ''
      const video = {
        src: videoUrl,
        poster: videoImgUrl,
        type: 'video/mp4',
      }
      setVideoSource(video)

      // 详情视频
      const detailVideoUrl = productData.productVideo || ''
      const detailVideo = {
        src: detailVideoUrl,
        poster: '',
        type: 'video/mp4',
      }
      setDetailVideoSource(detailVideo)
      
      // 购物车信息
      const shopCartProductCount = resData.shopCartProductCount || 0
      setCartNum(shopCartProductCount)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 客服
  const clickService = () => {
    const serviceInfo = goodsInfo.activity || {}
    Taro.UTIL.setPGStorage('service_info', serviceInfo)	
    Taro.ROUTER.navigateTo(`/pages/service/index?act=${actId}&acc=${accId}`);
  }

  // 购物车
  const clickCart = () => {
    Taro.ROUTER.reLaunchTo(`/pages/cart/index?act=${actId}&acc=${accId}`);
  }

  // 加入购物车
  const [cartNum, setCartNum] = useState(0);
  const clickCartAdd = () => {    
    requestAddCartData()
  }

  async function requestAddCartData() {
    const params = {
      activityId: actId,
      pointAccountId: accId,
      activityProductId: productId,
      quantity: 1,
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.cartChange(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      configTracker(8)
      const resData = res.data || {}
      const newCartNum = cartNum + 1;
      setCartNum(newCartNum)
      Taro.HUD.showToastMessage('加入购物车成功')
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 立即购买
  const clickBuyNow = () => {
    setBuyAlertShow(true);
  }

  // 工具栏
  const toolsView = () => {
    return (
      <View className='detail-tools-wrap'>
        <View className='tools-bar'>
          <View className='left-btn-wrap'>
            <View className='left-btn' onClick={() => clickService()}>
              <Image className='left-btn-img' mode='aspectFit' src={imgService}></Image>
            </View>
            <Image className='left-btn-line' mode='aspectFit' src={imgLine}></Image>            
              <View className='left-btn' onClick={() => clickCart()}>
                <Image className='left-btn-img' mode='aspectFit' src={imgCart}></Image>
                <Badge className="left-btn-tag" value={cartNum} max={99}></Badge>                
              </View> 
          </View>              
          <View className='right-btn-wrap'>
            <View className='right-btn-add'onClick={() => clickCartAdd()}>
              <Image className='right-btn-add-img' mode='aspectFit' src={imgCartAdd}></Image>
            </View>
            <View className='right-btn-buy'onClick={() => clickBuyNow()}>立即购买</View>
          </View>
        </View>
      </View>
    )
  }

  // 购买弹窗
  const [buyAlertShow, setBuyAlertShow] = useState(false);
  const buyAlertView = () => {
    return (
      <PGAlertConfirm
        show={buyAlertShow}
        styleType={1}
        title='确认购买'
        desc='直接跳转至积分结算页面'        
        confirmText='兑换'
        cancelText='取消'            
        onConfirm={() => clickConfirmBuy()}
        onCancel={() => clickCancelBuy()}
      >
      </PGAlertConfirm>
    )
  }

  const clickConfirmBuy = () => {
    setBuyAlertShow(false); 
    const productData = goodsInfo.product || {}

    let goodsList = [];
    const goods = {
      id: goodsInfo.id,
      productType: productData.productType,
      previewUrl: productData.previewUrl,
      name: productData.name,
      price: productData.price,
      discountPrice: goodsInfo.discountPrice,      
      quantity: 1,
    }
    goodsList = [goods];
    const orderConfirmInfo = {
      goodsList: goodsList,
    }
    Taro.UTIL.setPGStorage('order_confirm_info', orderConfirmInfo)	
    Taro.ROUTER.navigateTo(`/pages/orderConfirm/index?act=${actId}&acc=${accId}`);
  };

  const clickCancelBuy = () => {
    setBuyAlertShow(false);
  };
  
  // 轮播图
  const [bannerList, setBannerList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)

  const clickPreviewImg = (url) => {
    Taro.UTIL.showPreviewImg(url)
  }
  
  const onChangeSwiperItem = (index) => {
    console.log('onChangeSwiperItem', index)

    if (currentIndex != index) {      
      if (index === 0) {
        console.log('banner 0')
      } else {
        if (isVideoPlay) {
          videoPause()
        }       
      }      
      setCurrentIndex(index)
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
          {
            bannerList && bannerList.length > 0 && bannerList.map((item, index) => {
              return (
                <Swiper.Item key={index} className='swiper-item' >
                  {
                    item.videoUrl && item.videoUrl.length > 0 ? (
                      <View className='swiper-item-content'>
                        {
                          isVideoPlay ? (
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
                              onPlay={(elm) => onVideoPlayEvent(elm, 'banner')}
                              onPause={(elm) => onVideoPauseEvent(elm, 'banner')}
                              onPlayend={(elm) => onVideoPlayendEvent(elm, 'banner')}
                              onTimeUpdate={(elm) => onVideoTimeUpdate(elm, 'banner')}
                            />
                          ) : (
                            <>
                              <ImageNut className='swiper-img' src={item.videoImgUrl} fit='contain' loading={true} />
                              <Image className='swiper-video-play' mode='aspectFit' src={imgVideoPlay} onClick={() => clickPreviewVideo()}></Image>
                            </>
                          )
                        }                        
                      </View>                    
                    ) : (
                      <View className='swiper-item-content'>
                        <ImageNut className='swiper-img' src={item.imgUrl} fit='contain' loading={true} onClick={() => clickPreviewImg(item.imgUrl)} />
                      </View>                   
                    )
                  }                
                </Swiper.Item>
              );
            })
          }
        </Swiper>
        {
          !isVideoPlay ? (
            <View className="detail-swiper-slide">
              <Indicator total={bannerList.length} type="dualScreen" current={currentIndex} />
            </View>  
          ) : null
        }         
      </View>     
    )
  }

  // 商品信息
  const goodsInfoView = () => {
    return (
      <>
        <View className='detail-price-wrap'>
          <Image className='detail-price-img' mode='aspectFill' src={imgPriceBar}></Image>
          <View className='detail-price-item'>
            <View className='detail-price-new-wrap'>
              <View className='detail-price-new'>{goodsInfo.discountPrice}</View>
              <View className='detail-price-new-unit'>积分</View>
            </View>       
            {
              goodsInfo.product.price && (
                <View className='detail-price-old'>{goodsInfo.product.price}积分</View>
              )
            }     
          </View>           
        </View>
        <View className='detail-name-wrap'>
          <View className='detail-name'>{goodsInfo.product.name}</View>
        </View>
        <View className='detail-tag-wrap'>
          <View className='detail-tag-item'>
            {
              Taro.UTIL.configLabelTagList(goodsInfo.product.label).map((text, index) => {
                return (
                  <Tag key={index} className='detail-tag-text'>{text}</Tag>
                )
              })
            }
          </View>          
        </View>
      </>
    )
  }

  // 商品视频、图片
  const rootRef = useRef(null)
  const goodsVideoAndImgView = () => {
    return (
      <>
        <View className='detail-divider-wrap'>
          <View className='detail-divider'>商品详情</View>
        </View>  
        {
          detailVideoSource && detailVideoSource.src ? (
            <View className='detail-video-wrap'>
              <View className='detail-video-item'>
              {/* <Video
                className='detail-video'  
                id='video'
                src={detailVideoSource.src}
                poster={detailVideoSource.poster}
                initialTime={videoOptions.initialTime}
                controls={videoOptions.controls}
                autoplay={videoOptions.autoplay}
                loop={videoOptions.loop}
                muted={videoOptions.muted}
                onPlay={(elm) => onVideoPlayEvent(elm, 'detail')}
                onPause={(elm) => onVideoPauseEvent(elm, 'detail')}
                onPlayend={(elm) => onVideoPlayendEvent(elm, 'detail')}
                onTimeUpdate={(elm) => onVideoTimeUpdate(elm, 'detail')}
              /> */}
              <VideoNut 
                className='detail-video'  
                ref={rootRef}              
                source={detailVideoSource}
                options={videoOptions}
                onPlay={(elm) => onVideoPlayEvent(elm, 'detail')}
                onPause={(elm) => onVideoPauseEvent(elm, 'detail')}
                onPlayEnd={(elm) => onVideoPlayendEvent(elm, 'detail')}
              />
              </View>                        
            </View>
          ) : null
        }
        {
          goodsInfo.product.longImageUrl ? (
            <View className='detail-img-wrap'>
              <ImageNut className='detail-img' src={goodsInfo.product.longImageUrl} fit='contain' loading={true} />
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
          <PullToRefresh onRefresh={() => refreshData()}>
            <View className='detail-list' id='scroll'>          
              {bannerList && bannerList.length > 0 ? swiperView() : null}
              {goodsInfo && goodsInfo.product ? goodsInfoView() : null}
              {goodsInfo && goodsInfo.product ? goodsVideoAndImgView() : null}
            </View>
          </PullToRefresh>
          {toolsView()}
          {buyAlertView()}                   
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
