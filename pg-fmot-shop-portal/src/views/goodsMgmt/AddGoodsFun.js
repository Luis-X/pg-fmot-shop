import React, { useState, useEffect } from 'react';
import { Drawer, Form, message, Button } from 'antd';
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

export function AddGoodsFun({
  eventId,
  show,
  onHide,
  updateList,
}) {
  const [categoryData, setCategoryData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      await requestCategoryData();
    }
    fetchData();
  }, []);

  // urls转files
  function imgUrlsToFiles(imgUrls) {
    let list = [];
    imgUrls.forEach((item) => {
      const url = item || '';
      if (url) {
        list.push({
          url: url,
        });
      }
    });

    return list;
  }

  // files转urls
  function filesToImgUrls(files) {
    let list = [];
    files.forEach((item) => {
      const url = item.url || '';
      if (url) {
        list.push(url);
      }
    });
    return list;
  }

  /**
   * 详情数据
   */
  const requestDetailData = async () => {
    let detailData = {};    
    try {
      const res = await api.goodsDetail(eventId);
      if (res) {
        if (0 === res.data.code) {
          detailData = res.data.data;
          // 预览图
          const goodsImgUrls = detailData.goodsImg ? [detailData.goodsImg] : [];
          detailData.goodsImg = imgUrlsToFiles(goodsImgUrls);
          // 轮播图（视频、封面、图片）
          let bannerPoster = [];
          let bannerVideo = [];
          let bannerImgs = [];
          const bannerPosterUrls = detailData.bannerPoster ? [detailData.bannerPoster] : [];
          bannerPoster = imgUrlsToFiles(bannerPosterUrls);
          const bannerVideoUrls = detailData.bannerVideo ? [detailData.bannerVideo] : [];
          bannerVideo = imgUrlsToFiles(bannerVideoUrls);
          const bannerImgsUrls = detailData.bannerImgs ? detailData.bannerImgs : [];
          bannerImgs = imgUrlsToFiles(bannerImgsUrls);
          detailData.goodsBanner = [{
            bannerPoster: bannerPoster,
            bannerVideo: bannerVideo,
            bannerImgs: bannerImgs,
          }];
          // 视频
          const goodsVideoUrls = detailData.goodsVideo ? [detailData.goodsVideo] : [];
          detailData.goodsVideo = imgUrlsToFiles(goodsVideoUrls);
          // 长图
          const goodsIntroImgUrls = detailData.goodsIntroImg ? [detailData.goodsIntroImg] : [];
          detailData.goodsIntroImg = imgUrlsToFiles(goodsIntroImgUrls);
        } else {
          MyAlert({ errorMsg: res.data.message });
        }
      }
    } catch (err) {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }
    console.log('---detailData---', detailData);
    return detailData;
  };

  /**
   * 类别数据
   */
  const requestCategoryData = () => {
    let list = [];    
    api.goodsCategoryList().then((res) => {
      if (res) {
        if (0 === res.data.code) {
          if (res.data.data.length > 0) {
            for (let i in res.data.data) {
              list.push({
                label: res.data.data[i].name,
                value: res.data.data[i].id,
              });
            }
            setCategoryData(list || []);
          }
        } else {
          MyAlert({ errorMsg: res.data.message });
        }
      }
    }).catch((err) => {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    })
  };

  /**
   * form.validateFields数据准备
   */
  const saveAndCreateEvent = (type) => {
    setLoading(true);
    form.validateFields().then((values) => {
      console.log('处理前：', values);
      // 预览图
      const goodsImgFiles = values.goodsImg ? values.goodsImg : [];
      values.goodsImg = filesToImgUrls(goodsImgFiles)[0] || '';
      // 轮播图（视频、封面、图片）
      let bannerPoster = '';
      let bannerVideo = '';
      let bannerImgs = [];
      values.goodsBanner.forEach((item) => {
        const bannerPosterFiles = item.bannerPoster ? item.bannerPoster : [];
        bannerPoster = filesToImgUrls(bannerPosterFiles)[0] || '';
        const bannerVideoFiles = item.bannerVideo ? item.bannerVideo : [];
        bannerVideo = filesToImgUrls(bannerVideoFiles)[0] || '';
        const bannerImgFiles = item.bannerImgs ? item.bannerImgs : [];
        bannerImgs = filesToImgUrls(bannerImgFiles) || [];
      });
      values.bannerPoster = bannerPoster;
      values.bannerVideo = bannerVideo;
      values.bannerImgs = bannerImgs;
      values.goodsBanner = [];
      // 视频
      const goodsVideoFiles = values.goodsVideo ? values.goodsVideo : [];
      values.goodsVideo = filesToImgUrls(goodsVideoFiles)[0] || '';
      // 长图
      const goodsIntroFiles = values.goodsIntroImg ? values.goodsIntroImg : [];
      values.goodsIntroImg = filesToImgUrls(goodsIntroFiles)[0] || '';
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

  /**
   * 新增
   */
  const createHandler = (values) => {
    console.log('处理后，创建：', values);    
    api.goodsCreate({
      ...values,
    }).then((res) => {
      if (res) {
        setLoading(false);
        if (0 === res.data.code) {
          onHide();
          updateList();
          message.success('创建成功!', 3);
        } else {
          MyAlert({ errorMsg: res.data.message });
        }
      }
    }).catch((err) => {
      setLoading(false)
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    })
  };

  /**
   * 保存
   */
  const saveHandler = (values) => {
    console.log('处理后，保存：', values);
    api.goodsSave({
      ...values,
    }).then((res) => {
      if (res) {
        setLoading(false);
        if (0 === res.data.code) {
          onHide();
          updateList();
          message.success('保存成功!', 3);
        } else {
          MyAlert({ errorMsg: res.data.message });
        }
      }
    }).catch((err) => {
      setLoading(false);
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  /**
   * Form布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <React.Fragment>
      <Drawer 
        title={eventId ? '商品信息' : '新增商品'} 
        footer={
          <div className="create-event-btn">
            {
              eventId ? (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('save') }}>保存</Button>
              ) : (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('create')}}>新增商品</Button>
              )
            }
            <Button onClick={onHide}>取消</Button>
          </div>
        } 
        width={720} 
        visible={show} 
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
          request={eventId ? requestDetailData : null}
        >
          <ProFormRadio.Group
            name="goodsType"
            label="商品类型"
            rules={[{ required: true, message: '请选择商品类型' }]}
            initialValue="1"
            options={[
              {
                label: '实物',
                value: '1',
              },
              {
                label: '虚拟商品',
                value: '2',
              },
            ]}
          />
          <ProFormSelect
            options={categoryData}
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
            fieldProps={{ listType: 'picture-card' }}
            title="上传图片"
          />
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
                  }}
                  title="上传视频"
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
                  }}
                  title="上传图片"
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
              }}
              title="上传图片"
            />
          </ProFormList>
          <ProFormUploadButton
            name="goodsVideo"
            label="商品视频"
            extra="只能上传mp4文件，最好不要超过100KB"
            rules={[{ required: false, message: '请上传商品视频' }]}
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
            }}
            title="上传视频"
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
            }}
            title="上传图片"
          />
        </ProForm>
      </Drawer>
    </React.Fragment>
  );
}
