import React, { useState, useEffect } from 'react';
import { Drawer, Form, message, Button, Upload } from 'antd';
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
          let list = [];
          respData.data.forEach((item) => {
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
  const requestDetailData = async () => {
    let detailData = {};  

    try {
      const res = await api.goodsDetail(goodsId);
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          detailData = respData.data;

          // 预览图
          const goodsImgUrls = detailData.goodsImg ? [detailData.goodsImg] : [];
          detailData.goodsImg = Util.imgUrlsToFiles(goodsImgUrls);

          // 轮播图（视频、封面、图片）
          let bannerPoster = [];
          let bannerVideo = [];
          let bannerImgs = [];
          const bannerPosterUrls = detailData.bannerPoster ? [detailData.bannerPoster] : [];
          bannerPoster = Util.imgUrlsToFiles(bannerPosterUrls);
          const bannerVideoUrls = detailData.bannerVideo ? [detailData.bannerVideo] : [];
          bannerVideo = Util.imgUrlsToFiles(bannerVideoUrls);
          const bannerImgsUrls = detailData.bannerImgs ? detailData.bannerImgs : [];
          bannerImgs = Util.imgUrlsToFiles(bannerImgsUrls);
          detailData.goodsBanner = [{
            bannerPoster: bannerPoster,
            bannerVideo: bannerVideo,
            bannerImgs: bannerImgs,
          }];

          // 视频
          const goodsVideoUrls = detailData.goodsVideo ? [detailData.goodsVideo] : [];
          detailData.goodsVideo = Util.imgUrlsToFiles(goodsVideoUrls);

          // 长图
          const goodsIntroImgUrls = detailData.goodsIntroImg ? [detailData.goodsIntroImg] : [];
          detailData.goodsIntroImg = Util.imgUrlsToFiles(goodsIntroImgUrls);

        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    } catch (err) {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }
    console.log('---detailData---', detailData);
    return detailData;
  };

  // 创建、保存
  const saveAndCreateGoods = (type) => {
    setLoading(true);
    form.validateFields().then((values) => {
      console.log('处理前：', values);

      // 预览图
      const goodsImgFiles = values.goodsImg ? values.goodsImg : [];
      values.goodsImg = Util.filesToImgUrls(goodsImgFiles)[0] || '';

      // 轮播图（视频、封面、图片）
      let bannerPoster = '';
      let bannerVideo = '';
      let bannerImgs = [];
      values.goodsBanner.forEach((item) => {
        const bannerPosterFiles = item.bannerPoster ? item.bannerPoster : [];
        bannerPoster = Util.filesToImgUrls(bannerPosterFiles)[0] || '';
        const bannerVideoFiles = item.bannerVideo ? item.bannerVideo : [];
        bannerVideo = Util.filesToImgUrls(bannerVideoFiles)[0] || '';
        const bannerImgFiles = item.bannerImgs ? item.bannerImgs : [];
        bannerImgs = Util.filesToImgUrls(bannerImgFiles) || [];
      });
      values.bannerPoster = bannerPoster;
      values.bannerVideo = bannerVideo;
      values.bannerImgs = bannerImgs;
      values.goodsBanner = [];

      // 视频
      const goodsVideoFiles = values.goodsVideo ? values.goodsVideo : [];
      values.goodsVideo = Util.filesToImgUrls(goodsVideoFiles)[0] || '';

      // 长图
      const goodsIntroFiles = values.goodsIntroImg ? values.goodsIntroImg : [];
      values.goodsIntroImg = Util.filesToImgUrls(goodsIntroFiles)[0] || '';

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
    console.log('处理后，创建：', values);    
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
  const saveHandler = (values) => {
    console.log('处理后，保存：', values);
    api.goodsSave({
      ...values,
    }).then((res) => {
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
  const beforeUpload = (file) => {
    console.log('---file---', file);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('图片格式不是JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 <= 10.1;
    if (!isLt2M) {
      message.error('图片需要小于10MB!');
    }
    return (isJpgOrPng && isLt2M) ? true : Upload.LIST_IGNORE;
  };

  const handleImgChange = (info) => {
    console.log('---info---', info);
    const { status } = info.file;
    if (status === 'uploading') {
      setLoading(true);
      return;
    }
    // 上传
    if (status === 'done') {
      setLoading(false);
      const resp = info.file.response;
      console.log('---resp---', resp);
      if (resp.code === 0) {
        const url = resp.data
        console.log(url)
      } else {
        message.info(resp.message)
      }
    } else {
      setLoading(false);
      console.log('file upload failed', info.file);
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
              name="bannerVideo"
              label="视频"
              extra="只能上传mp4文件，最好不要超过100KB"
              rules={[{ required: false, message: '请上传视频' }]}
              max={1}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                beforeUpload: beforeUpload,
              }}
              title="上传视频"
              action={api.uploadFile()}
              onChange={handleImgChange}
            />
          </div>
          <div className="goods-banner-row">
            <ProFormUploadButton
              name="bannerPoster"
              label="封面"
              extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：100x100"
              rules={[{ required: false, message: '请上传封面' }]}
              max={1}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                beforeUpload: beforeUpload,
              }}
              title="上传图片"
              action={api.uploadFile()}
              onChange={handleImgChange}
            />
          </div>
        </div>
        <ProFormUploadButton
          name="bannerImgs"
          label="图片"
          extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：100x100"
          rules={[{ required: true, message: '请上传商品轮播图' }]}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload: beforeUpload,
          }}
          title="上传图片"
          action={api.uploadFile()}
          onChange={handleImgChange}
        />
      </>      
    )
  }

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
        width={920} 
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
            name="goodsType"
            label="商品类型"
            rules={[{ required: true, message: '请选择商品类型' }]}
            options={goodsTypeList}
          />
          <ProFormSelect
            options={categoryList}
            name="goodsCategory"
            label="商品类别"
            rules={[{ required: true, message: '请选择商品类别' }]}
            placeholder="请选择商品类别"
          />
          <ProFormText
            name="goodsCode"
            label="商品编码"
            rules={[{ required: true, message: '请输入商品编码' }]}
            placeholder="请输入商品编码"
          />
          <ProFormText
            name="goodsName"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
            placeholder="请输入商品名称"
          />
          <ProFormDigit
            name="goodsPrice"
            label="商品价格"
            rules={[{ required: true, message: '请输入商品价格' }]}
            placeholder="请输入商品价格"
            fieldProps={{ precision: 1 }}
          />
          <ProFormText
            name="goodsTag"
            label="商品标签"
            rules={[{ required: false, message: '请输入商品标签' }]}
            placeholder="请输入商品标签"
          />
          <ProFormUploadButton
            name="goodsImg"
            label="商品预览图"
            extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：100x100"
            rules={[{ required: true, message: '请上传商品预览图' }]}
            max={1}
            fieldProps={{ 
              name: 'file',
              listType: 'picture-card',
              beforeUpload: beforeUpload,
            }}
            title="上传图片"
            action={api.uploadFile()}
            onChange={handleImgChange}
          />
          {
            goodsId? (
              <ProFormList
                name="goodsBanner"
                label="商品轮播图"
                creatorButtonProps={false}
                copyIconProps={false}
                deleteIconProps={false}
                itemRender={({ listDom, action }, { index }) => (
                  <ProCard bordered style={{ marginBlockEnd: 8 }} extra={action} bodyStyle={{ paddingBlockEnd: 0 }}>{listDom}</ProCard>
                )}
              >
                {goodsBannerItemView()}
              </ProFormList>
            ) : (
              <ProFormList
                name="goodsBanner"
                label="商品轮播图"
                creatorButtonProps={false}
                copyIconProps={false}
                deleteIconProps={false}
                itemRender={({ listDom, action }, { index }) => (
                  <ProCard bordered style={{ marginBlockEnd: 8 }} extra={action} bodyStyle={{ paddingBlockEnd: 0 }}>{listDom}</ProCard>
                )}
                initialValue={[
                  {
                    bannerVideo: [],
                    bannerPoster: [],
                    bannerImgs: [],
                  },
                ]}
              >
                {goodsBannerItemView()}
              </ProFormList>
            )
          }
          <ProFormUploadButton
            name="goodsVideo"
            label="商品视频"
            extra="只能上传mp4文件，最好不要超过100KB"
            rules={[{ required: false, message: '请上传商品视频' }]}
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              beforeUpload: beforeUpload,
            }}
            title="上传视频"
            action={api.uploadFile()}
            onChange={handleImgChange}
          />
          <ProFormUploadButton
            name="goodsIntroImg"
            label="商品介绍长图"
            extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：100x100"
            rules={[{ required: true, message: '请上传商品介绍长图' }]}
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              beforeUpload: beforeUpload,
            }}
            title="上传图片"
            showUploadList={false}
            action={api.uploadFile()}
            onChange={handleImgChange}
          />
        </ProForm>
      </Drawer>
    </React.Fragment>
  );
}
