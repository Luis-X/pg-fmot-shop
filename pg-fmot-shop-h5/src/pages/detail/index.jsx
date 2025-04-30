import { useState, useRef } from "react";
import {
  PullToRefresh,
  Badge,
  Swiper,
  Tag,  
  Indicator,
  Image as ImageNut,
} from "@nutui/nutui-react";
import { View, Video, Image, ScrollView } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow, useDidHide, useUnload } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";
import PGAlertConfirm from "../../components/pgAlertConfirm/index";

import ASSET_IMG from '../../utils/assetImg.js'

const imgPriceBar = ASSET_IMG.assetImgWithName('detail-price-bar.png')
const imgService = ASSET_IMG.assetImgWithName('detail-service.png')
const imgCart = ASSET_IMG.assetImgWithName('detail-cart.png')
const imgLine = ASSET_IMG.assetImgWithName('detail-line.png')
const imgCartAdd = ASSET_IMG.assetImgWithName('detail-cart-add.png')
const imgVideoPlay = ASSET_IMG.assetImgWithName('detail-video-play.png')

export default function Index() {

  const router = useRouter()

  const [trackId, setTrackId] = useState('')
  const [trackBannerVideoId, setTrackBannerVideoId] = useState('')
  const [trackDetailVideoId, setTrackDetailVideoId] = useState('')

  const configTrackerProductIds = () => {
    if (tpId) {
      return [tpId]
    } else {
      return []
    }
  }

  const configTracker = (type, trackData) => {
    if (type === 1) {
      // 商品详情页浏览
      Taro.TRACKER.eventTracker('PRODUCT_DETAIL_PAGE', trackData, eventId => {
        if (eventId) {
          setTrackId(eventId)
        } 
      })
    } else if (type === 2) {
      // 商品轮播图视频
      Taro.TRACKER.eventTracker('PRODUCT_CAROUSEL_VIDEO', trackData, eventId => {
        if (eventId) {
          setTrackBannerVideoId(eventId)
        } 
      })
    } else if (type === 3) {
      // 商品详情视频
      Taro.TRACKER.eventTracker('PRODUCT_DETAIL_VIDEO', trackData, eventId => {
        if (eventId) {
          setTrackDetailVideoId(eventId)
        } 
      })
    } else if (type === 4) {
      // 商品详情加购物车
      Taro.TRACKER.eventTracker('PRODUCT_ADD_CART', trackData)
    }
  }

  useLoad(() => {
    console.log('detail onLoad')
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    console.log('detail onShow')
    Taro.WXSDK.hideOptionMenu();
    const tpIds = configTrackerProductIds()
    if (tpIds.length > 0) {
      configTracker(1, {
        activityId: actId,
        pointAccountId: accId,
        productIds: tpIds,
      })
    }
  });

  useDidHide(() => {
    console.log('detail onHide')
    const tpIds = configTrackerProductIds()
    if (trackId && tpIds.length > 0) {      
      configTracker(1, {
        activityId: actId,
        pointAccountId: accId,
        productIds: tpIds,
        id: trackId,
      })
    }
  });

  useUnload(() => {
    console.log('detail onUnload')
    const tpIds = configTrackerProductIds()
    if (trackId && tpIds.length > 0) {      
      configTracker(1, {
        activityId: actId,
        pointAccountId: accId,
        productIds: tpIds,
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
    const id = router.params.id || ''
    setActId(act)
    setAccId(acc)    
    setProductId(id)
    
    requestData({
      activityId: act,
      pointAccountId: acc,
      id: id,
    }, 'load')
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [productId, setProductId] = useState('');
  const [tpId, setTpId] = useState('');

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

  // 视频播放
  const clickPreviewVideo = () => {
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
    startVideoTracker(sence, elm)          
  }

  // 视频播放暂停~
  const onVideoPauseEvent = (elm, sence) => {
    console.log('video 播放暂停', elm)
  }

  // 视频播放结束~
  const onVideoPlayendEvent = (elm, sence) => {
    console.log('video 播放结束', elm)
    endVideoTracker(sence)   
  }
  
  const onVideoTimeUpdate = (elm, sence) => {   
    const time = elm.detail.currentTime;
    // const time = Math.floor(timeValue);
    console.log('视频播放时长: ', time);
    playingVideoTracker(sence, time)       
  };


  const [playBannerVideoTime, setPlayBannerVideoTime] = useState(0);
  const [playDetailVideoTime, setPlayDetailVideoTime] = useState(0);
  // 播放开始，上报
  const startVideoTracker = (sence, elm) => {
    // 轮播视频
    if (sence === 'banner') {   
      if (playBannerVideoTime === 0) {
        // 首次播放
        console.log('首次播放-轮播')
        setPlayBannerVideoTime(3)
        const tpIds = configTrackerProductIds()
        if (tpIds.length > 0) {
          configTracker(2, {
            activityId: actId,
            pointAccountId: accId,
            productIds: tpIds,
          }) 
        }        
      } else if (playBannerVideoTime === -1) {        
        // 完播后，播放
        console.log('完播后，播放-轮播')
        setPlayBannerVideoTime(3)
        const tpIds = configTrackerProductIds()
        if (tpIds.length > 0) {
          configTracker(2, {
            activityId: actId,
            pointAccountId: accId,
            productIds: tpIds,
          }) 
        }   
      } else {
        // 暂停后，重新播放
        console.log('暂停后，重新播放-轮播')
        const tpIds = configTrackerProductIds()
        if (trackBannerVideoId && tpIds.length > 0) {
          configTracker(2, {
            activityId: actId,
            pointAccountId: accId,
            productIds: tpIds,
            id: trackBannerVideoId,
          }) 
        }      
      }            
    }
    // 详情视频
    if (sence === 'detail') {
      if (playDetailVideoTime === 0) {
        // 首次播放
        console.log('首次播放-详情')
        setPlayDetailVideoTime(3)
        const tpIds = configTrackerProductIds()
        if (tpIds.length > 0) {
          configTracker(3, {
            activityId: actId,
            pointAccountId: accId,
            productIds: tpIds,
          }) 
        }
      } else if (playDetailVideoTime === -1) {        
        // 完播后，播放
        console.log('完播后，播放-详情')
        setPlayDetailVideoTime(3)
        const tpIds = configTrackerProductIds()
        if (tpIds.length > 0) {
          configTracker(3, {
            activityId: actId,
            pointAccountId: accId,
            productIds: tpIds,
          }) 
        } 
      } else {
        // 暂停后，重新播放
        console.log('暂停后，重新播放-详情')
        const tpIds = configTrackerProductIds()
        if (trackDetailVideoId && tpIds.length > 0) {
          configTracker(3, {
            activityId: actId,
            pointAccountId: accId,
            productIds: tpIds,
            id: trackDetailVideoId,
          })
        }         
      }     
    }
  }

  // 播放播放中，上报（3秒1次）  
  const playingVideoTracker = (sence, time) => {
    // 轮播视频
    if (sence === 'banner' && time > playBannerVideoTime && playBannerVideoTime >= 0) {
      setPlayBannerVideoTime(time + 3)       
      if (trackBannerVideoId) {
        const tpIds = configTrackerProductIds()
        if (tpIds.length > 0) {
          configTracker(2, {
            activityId: actId,
            pointAccountId: accId,
            productIds: tpIds,
            id: trackBannerVideoId,
          })
        }
      }       
    }
    // 详情视频
    if (sence === 'detail' && time > playDetailVideoTime && playDetailVideoTime >= 0) {
      setPlayDetailVideoTime(time + 3)
      const tpIds = configTrackerProductIds()
      if (trackDetailVideoId && tpIds.length > 0) {
        configTracker(3, {
          activityId: actId,
          pointAccountId: accId,
          productIds: tpIds,
          id: trackDetailVideoId,
        })
      }        
    }
  }

  // 播放结束，上报
  const endVideoTracker = (sence) => {
    // 轮播视频
    if (sence === 'banner') {    
      setPlayBannerVideoTime(-1) 
      const tpIds = configTrackerProductIds()
      if (trackBannerVideoId && tpIds.length > 0) {
        configTracker(2, {
          activityId: actId,
          pointAccountId: accId,
          productIds: tpIds,
          id: trackBannerVideoId,
          finished: true,
        })      
      }      
    } 
    // 详情视频
    if (sence === 'detail') { 
      setPlayDetailVideoTime(-1)   
      const tpIds = configTrackerProductIds()
      if (trackDetailVideoId && tpIds.length > 0) {
        configTracker(3, {
          activityId: actId,
          pointAccountId: accId,
          productIds: tpIds,
          id: trackDetailVideoId,
          finished: true,
        })
      }  
    }
  }

  // 下拉刷新
  const refreshData = () => {
    return requestData({
      activityId: actId,
      pointAccountId: accId,
      id: productId
    })
  };

  // request
  async function requestData(query, scence) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.goodsDetail(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {

      // 获取限购信息、购物车信息
      requestActivityData({
        activityId: query.activityId,
        pointAccountId: query.pointAccountId,
      })

      const resData = res.data || {}
      const productData = resData.product || {}
      const banner = productData.productCarouselImages || []

      if (scence === 'load') {
        const productOfId = productData.id || ''
        if (productOfId) {
          configTracker(1, {
            activityId: query.activityId,
            pointAccountId: query.pointAccountId,
            productIds: [productOfId],
          })
        }        
        setTpId(productOfId)
      }

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

  const [orderActivityInfo, setOrderActivityInfo] = useState({})
  const [cartList, setCartList] = useState([])
  async function requestActivityData(query) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.orderActivityInfo(params) 
    // Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      setOrderActivityInfo(resData)
      requestCartData(query)
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  async function requestCartData(query) {
    const params = {
      ...query
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.cartList(params) 
    // Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      const list = resData || []

      setCartList(list)
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
    
    const tpIds = configTrackerProductIds()
    if (tpIds.length > 0) {
      configTracker(4, {
        activityId: actId,
        pointAccountId: accId,
        productIds: tpIds,
      })
    }     

    let newValue = 1
    // 购物车中是否有该商品
    const goodsItem = cartList.find(item => item.activityProductId === productId) || {}   
    if (goodsItem.activityProductId) {
      newValue = goodsItem.quantity + 1
    } else {
      newValue = 1
    }
    console.log('newValue', newValue);

    if (checkLimitNum(newValue)) {  
      requestAddCartData(newValue)
    }
  }

  // 限购数量检测（每个商品）
  const checkLimitNum = (val) => {
    const maxLimit = orderActivityInfo.maxQuantity || 0;
    console.log('maxLimit', maxLimit);
    if (val > maxLimit) {
      Taro.HUD.showToastMessage('加购商品超过数量上限')
      return false;
    }
    return true;
  }

  async function requestAddCartData(val) {
    const params = {
      activityId: actId,
      pointAccountId: accId,
      activityProductId: productId,
      quantity: val,
    }

    // Taro.HUD.showLoading()
    const res = await Taro.NETWORK.cartChange(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) {
      const resData = res.data || {}
      refreshCartNum({
        activityId: actId,
        pointAccountId: accId,
        id: productId
      })
      Taro.HUD.showToastMessage('加入购物车成功')
    } else {
      Taro.HUD.showToastMessage(res.message)
    }   
  }

  // 刷新购物车数量
  async function refreshCartNum(query) {
    const params = {
      ...query
    }
    const res = await Taro.NETWORK.goodsDetail(params)
    if (res.code === 0) {
      // 获取限购信息、购物车信息
      requestActivityData({
        activityId: query.activityId,
        pointAccountId: query.pointAccountId,
      })
      const resData = res.data || {}
      // 购物车信息
      const shopCartProductCount = resData.shopCartProductCount || 0
      setCartNum(shopCartProductCount)
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
      tpId: productData.id,
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
    // Taro.UTIL.showPreviewImg(url)
  }
  
  const onChangeSwiperItem = (index) => {
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
                              onEnded={(elm) => onVideoPlayendEvent(elm, 'banner')}
                              onTimeUpdate={(elm) => onVideoTimeUpdate(elm, 'banner')}
                            />
                          ) : (
                            <>
                              <ImageNut className='swiper-img' src={item.videoImgUrl} fit='contain' lazy={false} loading={false} />
                              <Image className='swiper-video-play' mode='aspectFit' src={imgVideoPlay} onClick={() => clickPreviewVideo()}></Image>
                            </>
                          )
                        }                        
                      </View>                    
                    ) : (
                      <View className='swiper-item-content'>
                        <ImageNut className='swiper-img' src={item.imgUrl} fit='contain' lazy={true} loading={true} onClick={() => clickPreviewImg(item.imgUrl)} />
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

  // 积分展示
  const priceView = (product, discountPrice) => {
    const isDiscountPrice = discountPrice;
    let result = null;
    if (isDiscountPrice) {
      result = (
        <View className='detail-price-item'>
          <View className='detail-price-new-wrap'>
            <View className='detail-price-new'>{discountPrice}</View>
            <View className='detail-price-new-unit'>积分</View>
          </View>       
          <View className='detail-price-old'>{product.price}积分</View>   
        </View>    
      )
    } else {
      result = (
        <View className='detail-price-item'>
          <View className='detail-price-new-wrap'>
            <View className='detail-price-new'>{product.price}</View>
            <View className='detail-price-new-unit'>积分</View>
          </View>    
        </View>
      )
    }
    return result
  }
  // 商品信息
  const goodsInfoView = () => {
    return (
      <>
        <View className='detail-price-wrap'>
          <Image className='detail-price-img' mode='aspectFill' src={imgPriceBar}></Image>
          { priceView(goodsInfo.product, goodsInfo.discountPrice) }                    
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
  // FIXME: 视频缺少封面
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
              <Video
                className='detail-video'  
                id='detail-video-ref'
                src={detailVideoSource.src}
                // poster={detailVideoSource.poster}
                initialTime={videoOptions.initialTime}
                controls={videoOptions.controls}
                autoplay={videoOptions.autoplay}
                loop={videoOptions.loop}
                muted={videoOptions.muted}
                onPlay={(elm) => onVideoPlayEvent(elm, 'detail')}
                onPause={(elm) => onVideoPauseEvent(elm, 'detail')}
                onEnded={(elm) => onVideoPlayendEvent(elm, 'detail')}
                onTimeUpdate={(elm) => onVideoTimeUpdate(elm, 'detail')}
              />
              </View>                        
            </View>
          ) : null
        }
        {
          goodsInfo.product.longImageUrl ? (
            <View className='detail-img-wrap'>
              <ImageNut className='detail-img' src={goodsInfo.product.longImageUrl} fit='contain' lazy={false} loading={false} />
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
