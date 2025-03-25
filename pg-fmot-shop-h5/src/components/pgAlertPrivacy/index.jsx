import { useState, useEffect } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

import ASSET_IMG from '../../utils/assetImg.js'

const imgBG = ASSET_IMG.assetImgWithName('alert-bg.png')
const imgCheckboxSelect = ASSET_IMG.assetImgWithName('alert-checkbox-select.png')
const imgCheckbox = ASSET_IMG.assetImgWithName('alert-checkbox.png')

export default function Index(props) {

  const { isOpen } = props

  useLoad(() => {
    console.log('privacy alert loaded.')
  })

  useEffect(() => {
    console.log('privacy alert effect.') 
    const newTermVersion = Taro.UTIL.getPGStorage('login_info').newTermVersion
    const memberId = Taro.UTIL.getPGStorage('login_info').memberId || ''

    if (memberId && newTermVersion === false) {
      console.log('非最新条款')
      const confirmNewTermVersion = Taro.UTIL.getPGStorage('ok_newTerm') || ''
      if (confirmNewTermVersion === '1') {
        // 已处理
        setIsShowDisable(false)
        setIsShow(false)
      } else {
        // 未处理
        setIsShowDisable(false)
        setIsShow(true)
      }
    } else {
      console.log('最新条款')      
    }
  }, []);


  // 隐私政策  
  const [isShow, setIsShow] = useState(false)
  const [isShowDisable, setIsShowDisable] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  async function requestPostTermsData() {
    const timestamp = Date.parse(new Date())
    const params = {
      creatime: timestamp,
    }

    Taro.HUD.showLoading()
    const res = await Taro.NETWORK.modifyAccountsTerms(params) 
    Taro.HUD.hideLoading()

    if (res.code === 0) { 
      Taro.UTIL.setPGStorage('ok_newTerm', '1')
      showPrivacyAlert(false)
      onSuccessHandler()
    } else {
      Taro.HUD.showToastMessage(res.message)
    }  
  }

  function showPrivacyAlert(isNeedShow) {    
    setIsChecked(false)
    setIsShow(isNeedShow)
    setIsShowDisable(false)
  }

  // 处理成功
  const onSuccessHandler = () => {
    if (props.onSuccess) {
      props.onSuccess()
    }
  }

  // 确定
  const clickConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm()
    }
    if (isChecked) {
      requestPostTermsData()
    } else {
      Taro.HUD.showToastMessage('请同意上述内容')
    }   
  }

  // 取消
  const clickCancel = () => {
    if (props.onCancel) {
      props.onCancel()
    }

    setIsChecked(false)
    setIsShow(false)
    setIsShowDisable(true)
  }

  // 勾选
  const clickCheckBox = () => {
    setIsChecked(!isChecked)
  }

  // 链接
  const clickLink = (e) => {
    e.stopPropagation()
    const url = 'https://memtd.shenghuojia.com/logout/static-pages/privacy.html'
    Taro.ROUTER.navigateToWeb(url)
  }

  function handleTouchMove(e) {
    try {
      e.preventDefault()
      e.stopPropagation()
    } catch (error) {
      
    }    
  }

  return (
    <>
      {
        isOpen || isShow ? (
          <View className='pg-alert-bg' onTouchMove={handleTouchMove}>
            <View className='pg-privacy-alert-wrap'>
              <View className='alert-content'>
                <Image className='alert-bg-img' mode='aspectFill' src={imgBG}></Image>
                <View className='text-title'>隐私声明更新提示</View>
                <View className='text-desc'>请查看最新条款内容，以继续使用会员权益。</View>
                <View className='check-box-wrap' onClick={clickCheckBox}>
                  <Image className='check-box-img' mode='aspectFit' src={isChecked ? imgCheckboxSelect : imgCheckbox}></Image>
                  <Text className='check-box-desc'>我已阅读，充分理解并遵守<Text className='check-box-desc-line' onClick={clickLink}>《消费者隐私政策》</Text>的各条款内容</Text>
                </View>                
                <View className='btn-wrap' style='justify-content: space-between;'>
                  <View className='confirm-btn' onClick={() => clickConfirm()}>确定</View>
                  <View className='cancel-btn' onClick={() => clickCancel()}>取消</View>                                    
                </View>                              
              </View>              
            </View>            
          </View>
        ) : null
      }
      {
         isShowDisable ? (
          <View className='pg-alert-bg' onTouchMove={handleTouchMove}>
            <View className='pg-privacy-alert-wrap' onClick={() => showPrivacyAlert(true)}></View>
          </View>            
        ) : null
      }
    </>
  )
}
