import { useState } from "react";
import { View, Image } from "@tarojs/components";
import Taro, { useLoad, useRouter, useDidShow } from "@tarojs/taro";
import "./index.scss";

import PGLoading from "../../components/pgLoading/index";

import ASSET_IMG from '../../utils/assetImg.js'

const imgBG = ASSET_IMG.assetImgWithName('disable-bg.png')
const imgIcon = ASSET_IMG.assetImgWithName('disable-icon.png')

export default function Index() {

  const router = useRouter()

  useLoad(() => {
    Taro.WXSDK.hideOptionMenu();
    createdPage();
  });

  useDidShow(() => {
    Taro.WXSDK.hideOptionMenu();
  });

  const createdPage = async () => {    
    setIsShowPage(true);

    const act = router.params.act || ''
    const acc = router.params.acc || ''
    setActId(act)
    setAccId(acc)
    
    const status = router.params.status || '';

    if (status === '1') {
      // 不在活动时间内
      setStatusType(1);   
    } else {
      // 暂不符合活动资格
      setStatusType(2);
    }
  };

  const [isShowPage, setIsShowPage] = useState(false);
  const [actId, setActId] = useState('');
  const [accId, setAccId] = useState('');
  const [statusType, setStatusType] = useState(''); // 1: 不在活动时间内 2: 不符合活动资格

  return (
    <>
      {isShowPage ? (  
        <View className='disable-list'>
          <Image className='disable-bg-img' mode='aspectFill' src={imgBG}></Image>
          <View className="disable-empty">
            <Image className='disable-empty-img' mode='aspectFit' src={imgIcon}></Image>
            {statusType === 1 && (
              <>
                <View className='disable-empty-desc'>抱歉！</View>
                <View className='disable-empty-desc'>当前不在活动时间内</View>
              </>
            )}
            {statusType === 2 && (
              <>
                <View className='disable-empty-desc'>抱歉！</View>
                <View className='disable-empty-desc'>暂不符合活动资格</View>
              </>
            )}
          </View>
        </View>
      ) : (
        <PGLoading></PGLoading>
      )}
    </>
  );
}
