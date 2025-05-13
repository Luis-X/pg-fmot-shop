import React, { useState, useEffect } from 'react';
import { Drawer, Form, message, Button, Upload, Modal} from 'antd';
import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormRadio,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import '@ant-design/pro-components/dist/components.css';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import Dict from '../../config/Dict';
import Util from '../../utils/util';

export function AddGoodsFun({
  goodsId,
  show,
  onHide,
  updateList,
}) {
  const [goodsTypeList, setGoodsTypeList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      await requestCategoryListData();
      configGooodsTypeList();
    }
    fetchData();
  }, []);

  // 商品类型
  const configGooodsTypeList = () => {
    const list = Dict.getOptionsList('goodsType');
    setGoodsTypeList(list);
  }

  // 商品类别
  const requestCategoryListData = async () => {   
    api.goodsCategoryList().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          const categoryDataList = respData.data || [];
          let list = [];
          categoryDataList.forEach((item) => {
            list.push({
              label: item.name,
              value: item.id,
            });
          })
          setCategoryList(list);
        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    })
  };

  // 详情数据
  const [oldBannerList, setOldBannerList] = useState([]);
  const requestDetailData = async () => {
    let detailData = {};  

    try {
      const res = await api.goodsDetail({
        id: goodsId,
      });
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          detailData = respData.data;

          // 预览图
          const previewImgUrls = detailData.previewUrl ? [detailData.previewUrl] : [];
          detailData.previewUrl = Util.imgUrlsToFiles(previewImgUrls);

          // 轮播图（视频、封面、图片）
          let bannerPoster = [];
          let bannerVideo = [];
          let bannerImgs = [];

          let bannerList = detailData.productCarouselImages || [];
          setOldBannerList(bannerList);
          bannerList.forEach((item) => {
            // banner封面
            if (item.videoImgUrl) {
              bannerPoster.push(item.videoImgUrl);
            }
            // banner视频
            if (item.videoUrl) {
              bannerVideo.push(item.videoUrl);
            }
            // banner图片
            if (item.imgUrl) {
              bannerImgs.push(item.imgUrl);
            }                                                   
          });

          let newBannerItem = {}
          // banner封面 file
          if (bannerPoster.length > 0) {
            newBannerItem.videoImgUrl = Util.imgUrlsToFiles(bannerPoster);
          }
          // banner视频 file
          if (bannerVideo.length > 0) {
            newBannerItem.videoUrl = Util.imgUrlsToFiles(bannerVideo, true);
          }
          // banner图片 file
          if (bannerImgs.length > 0) {
            newBannerItem.imgUrl = Util.imgUrlsToFiles(bannerImgs);
          }
          detailData.productCarouselImages = [newBannerItem];

          // 视频
          const videoUrls = detailData.productVideo ? [detailData.productVideo] : [];
          detailData.productVideo = Util.imgUrlsToFiles(videoUrls, true);

          // 长图
          const longImageUrls = detailData.longImageUrl ? [detailData.longImageUrl] : [];
          detailData.longImageUrl = Util.imgUrlsToFiles(longImageUrls);

        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    } catch (err) {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }
    // console.log('---detailData---', detailData);
    return detailData;
  };

  // 创建、保存
  const saveAndCreateGoods = (type) => {
    setLoading(true);
    form.validateFields().then((values) => {
      // console.log('处理前：', values);

      // 预览图
      const previewFiles = values.previewUrl || [];
      values.previewUrl = Util.filesToImgUrls(previewFiles)[0] || '';

      // 轮播图（视频、封面、图片）
      let bannerPoster = '';
      let bannerVideo = '';
      let bannerImgs = [];
      let bannerQueryList = []
      values.productCarouselImages.forEach((item) => {
        // 封面
        const bannerPosterFiles = item.videoImgUrl || [];
        bannerPoster = Util.filesToImgUrls(bannerPosterFiles)[0] || '';
        // 视频
        const bannerVideoFiles = item.videoUrl || [];
        bannerVideo = Util.filesToImgUrls(bannerVideoFiles)[0] || '';
        // 图片
        const bannerImgFiles = item.imgUrl || [];;
        bannerImgs = Util.filesToImgUrls(bannerImgFiles) || [];        
        // banner-视频、封面
        if (bannerVideo || bannerPoster) {
          const videoObj = {
            videoImgUrl: bannerPoster,
            videoUrl: bannerVideo,
          }
          bannerQueryList.push(videoObj);
        }
        // banner-图片
        bannerImgs.forEach((item) => {
          const imbObj = {
            imgUrl: item,
          }
          bannerQueryList.push(imbObj)         
        })
      });
      values.productCarouselImages = bannerQueryList;

      if (bannerVideo) {
        // if (!bannerPoster) {
        //   message.error('请上传视频封面！', 2);
        //   setLoading(false);
        //   return;
        // }
        // console.log('上传视频时，未上传封面也可提交')
      } else if (bannerPoster) {        
        if (!bannerVideo) {
          message.error('请上传视频！', 2);
          setLoading(false);
          return;
        }
        // console.log('上传封面时，必须上传视频，否则无法提交')
      } else {
        if (bannerImgs.length <= 0) {
          message.error('请上传轮播图！', 2);
          setLoading(false);
          return;
        }
      }
      

      // 视频
      const videoFiles = values.productVideo || [];
      values.productVideo = Util.filesToImgUrls(videoFiles)[0] || '';

      // 长图
      const longImageFiles = values.longImageUrl || [];
      values.longImageUrl = Util.filesToImgUrls(longImageFiles)[0] || '';

      // 操作
      if ('save' === type) {
        saveHandler(values);
      } else if ('create' === type) {
        createHandler(values);
      }
    }).catch((error) => {
      setLoading(false);
    });
  };

  // 创建
  const createHandler = (values) => {
    // console.log('处理后，创建：', values);    
    api.goodsCreate({
      ...values,
    }).then((res) => {
      if (res) {
        setLoading(false);
        const respData = res.data || {};
        if (0 === respData.code) {
          onHide();
          updateList();
          message.success('创建成功!', 3);
        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      setLoading(false)
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    })
  };

  // 保存
  // productCarouselImages 修改需要携带id参数（后端要求）
  const saveHandler = (values) => {
    // console.log('处理后，保存：', values);
    const params = {
      id: goodsId,
      ...values,
    }

    // 轮播图 id 
    let bannerList = params.productCarouselImages || [];
    bannerList.forEach((item, index) => {
      const oldItem = oldBannerList[index] || {};
      const id = oldItem.id || '';
      if (id) {
        item.id = oldItem.id;
      }
    })
    // console.log('处理id后，保存：', params);

    api.goodsSave(params).then((res) => {
      if (res) {
        setLoading(false);
        const respData = res.data || {};
        if (0 === respData.code) {
          onHide();
          updateList();
          message.success('保存成功!', 3);
        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      setLoading(false);
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  // 上传图片
  const beforeUpload = async (file, type) => {
    // console.log('---file---', file);
    // 视频
    if (type === 'video') {
      const isAllowVideo = file.type === 'video/mp4';
      if (!isAllowVideo) {
        message.error('视频格式不是MP4!');
        return Upload.LIST_IGNORE
      }
    }
    // 图片
    if (type === 'img') {
      const isAllowImg = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isAllowImg) {
        message.error('图片格式不是JPG/JPEG/PNG/GIF!');
        return Upload.LIST_IGNORE
      }
    }    
    // 图片大小
    // const isAllowSize = file.size / 1024 <= 100;
    // if (!isAllowSize) {
    //   message.error('文件需要小于100KB!');
    //   return Upload.LIST_IGNORE
    // }
    // 刷新签名
    await requestSignData();
    return true
  };

  // 1.上传图片签名
  const [signData, setSignData] = useState({})
  const requestSignData = async () => {   
    // console.log('获取签名')
    await api.uploadFileSignPublic().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          // console.log('获取签名，成功', respData)
          const signInfo = respData.data || {};
          setSignData(signInfo);
        } else {
          console.log('获取签名，错误')
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      console.log('获取签名，失败')
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    })
  };

  // 2.上传图片处理
  const handleImgChange = async (info) => {
    // console.log('上传信息', info);
    const { status } = info.file;
    if (status === 'uploading') {
      // console.log('上传中', info);
      setLoading(true);
      return;
    }
    // 上传
    if (status === 'done') {
      setLoading(false);
      const resp = info.file.response;
      // console.log('上传结束', resp);
      const fileId = resp.fileId 
      const url = resp.url
      // 公有图片
      if (url) {
        // console.log('上传成功-公有', url);
        info.file.url = url;
        return;
      }
      // 私有图片 
      if (fileId) {     
        // console.log('上传成功-私有', fileId);  
        // console.log('通过fileId获取url', fileId);          
        const fileUrlResp = await api.uploadFileGetUrl([fileId]);
        const respData = fileUrlResp.data || {};
        if (0 === respData.code) {
          // console.log('获取url成功', respData);
          const fileUrl = respData[fileId] || '';
          info.file.url = fileUrl;
        } else {
          console.log('获取url失败', fileId);
          MyAlert({ errorMsg: respData.message });
        }   
        return
      }
      console.log('上传失败-无法获取fileId或url');  
      message.info('上传失败，请重试')
    } else {
      setLoading(false);
      console.log('上传失败', info.file);
    }
  };
  
  /**
   * Form布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const goodsBannerItemView = () => {
    return (
      <>
        <div className="goods-banner-row-wrap">
          <div className="goods-banner-row">
            <ProFormUploadButton
              name="videoUrl"
              label="视频"
              extra="只能上传mp4文件，最好不要超过100KB"
              rules={[{ required: false, message: '请上传视频' }]}
              max={1}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                beforeUpload: (file) => beforeUpload(file, 'video'),
                data: signData.params,
                onChange: handleImgChange,
                onPreview: (file) => handlePreview(file, 'video')
              }}
              title="上传视频"
              action={signData.url}              
            />            
          </div>
          <div className="goods-banner-row">
            <ProFormUploadButton
              name="videoImgUrl"
              label="封面"
              extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：375x375"
              rules={[{ required: false, message: '请上传封面' }]}
              max={1}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                beforeUpload: (file) => beforeUpload(file, 'img'),
                data: signData.params,
                onChange: handleImgChange,
                onPreview: (file) => handlePreview(file, 'img')
              }}
              title="上传图片"
              action={signData.url}
            />
          </div>
        </div>
        <ProFormUploadButton
          name="imgUrl"
          label="图片"
          extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：375x375"
          rules={[{ required: false, message: '请上传商品轮播图' }]}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload: (file) => beforeUpload(file, 'img'),
            data: signData.params,
            onChange: handleImgChange,
            onPreview: (file) => handlePreview(file, 'img')
          }}
          title="上传图片"
          action={signData.url}
        />
      </>      
    )
  }

  // 检查输入是否以逗号分隔
  const validateCommaSeparated = (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]+(、[\u4e00-\u9fa5a-zA-Z0-9]+)*$/;
    if (regex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请使用、分隔商品标签'));
  };

  // 预览图片
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const handleCancel = () => {
    setPreviewImage('');
    setPreviewVideo('');
    setPreviewOpen(false);
  }
  const handlePreview = (file, type) => {
    const url = file.url || ''
    if (type === 'video') {
      setPreviewImage('');
      setPreviewVideo(url);
    } else {
      setPreviewImage(url);
      setPreviewVideo('');
    }   
    setPreviewOpen(true);
  };

  return (
    <React.Fragment>
      <Drawer 
        title={goodsId ? '编辑商品' : '新增商品'} 
        footer={
          <div className="create-event-btn">
            {
              goodsId ? (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateGoods('save') }}>保存</Button>
              ) : (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateGoods('create')}}>新增商品</Button>
              )
            }
            <Button onClick={onHide}>取消</Button>
          </div>
        } 
        width={1020} 
        open={show} 
        onClose={() => { onHide() }} 
        bodyStyle={{ paddingBottom: 80 }}
      >
        <ProForm
          form={form}
          className="add-event-porForm"
          disabled={false}
          {...formItemLayout}
          layout="LAYOUT_TYPE_HORIZONTAL"
          // layout='horizontal'//horizontal
          name="sonForm"
          submitter={{
            submitButtonProps: {
              style: {
                display: 'none', // 隐藏提交按钮
              },
            },
            resetButtonProps: {
              // 配置按钮的属性
              style: {
                display: 'none', // 隐藏重置按钮
              },
            },
          }}
          params={{}} //网络请求参数
          request={goodsId ? requestDetailData : null}
        >
          <ProFormRadio.Group
            name="productType"
            label="商品类型"
            rules={[{ required: true, message: '请选择商品类型' }]}
            options={goodsTypeList}
          />
          <ProFormSelect
            options={categoryList}
            name="productCategoryId"
            label="商品类别"
            rules={[{ required: true, message: '请选择商品类别' }]}
            placeholder="请选择商品类别"
          />
          <ProFormText
            name="code"
            label="商品编码"
            rules={[{ required: true, message: '请输入商品编码' }]}
            placeholder="请输入商品编码"
          />
          <ProFormText
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
            placeholder="请输入商品名称"
          />
          <ProFormDigit
            name="price"
            label="商品价格"
            rules={[{ required: true, message: '请输入商品价格' }]}
            placeholder="请输入商品价格"
            fieldProps={{ precision: 1 }}
          />
          <ProFormText
            name="label"
            label="商品标签"
            rules={[
              { required: false, message: '请输入商品标签，多个标签之间以”、“分隔' },
              { validator: validateCommaSeparated }
            ]}
            placeholder="请输入商品标签，多个标签之间以”、“分隔"
          />
          <ProFormUploadButton
            name="previewUrl"
            label="商品预览图"
            extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：160x160"
            rules={[{ required: true, message: '请上传商品预览图' }]}            
            max={1}
            fieldProps={{ 
              name: 'file',
              listType: 'picture-card',
              beforeUpload: (file) => beforeUpload(file, 'img'),
              data: signData.params,
              onChange: handleImgChange,
              onPreview: (file) => handlePreview(file, 'img')
            }}
            title="上传图片"
            action={signData.url}
          />
          {
            goodsId ? (
              <ProFormList
                required={true}
                name="productCarouselImages"
                label="商品轮播图"
                creatorButtonProps={false}
                copyIconProps={false}
                deleteIconProps={false}
                itemRender={({ listDom, action }, { index }) => (
                  <ProCard bordered style={{ marginBlockEnd: 8 }} extra={action} bodyStyle={{  paddingBlockEnd: 0 }}>{listDom}</ProCard>
                )}
              >
                {goodsBannerItemView()}
              </ProFormList>
            ) : (
              <ProFormList
                required={true}
                name="productCarouselImages"
                label="商品轮播图"
                creatorButtonProps={false}
                copyIconProps={false}
                deleteIconProps={false}
                itemRender={({ listDom, action }, { index }) => (
                  <ProCard bordered style={{ marginBlockEnd: 8 }} extra={action} bodyStyle={{ paddingBlockEnd: 0 }}>{listDom}</ProCard>
                )}
                initialValue={[
                  {
                    videoUrl: [],
                    videoImgUrl: [],
                    imgUrl: [],
                  },
                ]}
              >
                {goodsBannerItemView()}
              </ProFormList>
            )
          }
          <ProFormUploadButton
            name="productVideo"
            label="商品视频"
            extra="只能上传mp4文件，最好不要超过100KB"
            rules={[{ required: false, message: '请上传商品视频' }]}
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              beforeUpload: (file) => beforeUpload(file, 'video'),
              data: signData.params,
              onChange: handleImgChange,
              onPreview: (file) => handlePreview(file, 'video')
            }}
            title="上传视频"
            action={signData.url}
          />
          <ProFormUploadButton
            name="longImageUrl"
            label="商品介绍长图"
            extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：375x925"
            rules={[{ required: true, message: '请上传商品介绍长图' }]}
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              beforeUpload: (file) => beforeUpload(file, 'img'),
              data: signData.params,
              onChange: handleImgChange,
              onPreview: (file) => handlePreview(file, 'img')
            }}
            title="上传图片"
            showUploadList={false}
            action={signData.url}
          />
        </ProForm>
        <Modal open={previewOpen} title={null} footer={null} onCancel={handleCancel}>
          <div style={{ maxHeight: '500px', overflow: 'auto' }}>
            {
              previewImage ? (
                <img alt="example" style={{ width: '100%' }} src={previewImage} width={500} />
              ) : null
            }
            {
              previewVideo ? (
                <video alt="example" controls style={{ width: '100%' }} src={previewVideo} width={500} height={500} />
              ) : null
            }
          </div>
        </Modal>
      </Drawer>
    </React.Fragment>
  );
}
