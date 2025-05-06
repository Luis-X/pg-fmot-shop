import React, { useState, useEffect } from 'react';
import { Drawer, Form, message, Button, ConfigProvider, Row, Col, Upload, Modal } from 'antd';
import {
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormUploadButton,
  ProFormCheckbox,
  EditableProTable
} from '@ant-design/pro-components';
import '@ant-design/pro-components/dist/components.css';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import zhCN from 'antd/es/locale/zh_CN';
import Dict from '../../config/Dict';
import Util from '../../utils/util';

export function AddEventFun({
  activityId,
  show,
  onHide,
  updateList,
}) {
  const [activityTypeList, setActivityTypeList] = useState([]);
  const [deliveryTypeList, setDeliveryTypeList] = useState([]);
  const [orgCodeList, setOrgCodeList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      await requestOrgCodeListData();
      configActivityTypeList();
      configDeliveryTypeList();
    }
    fetchData();
  }, []);

  // 活动类型
  const configActivityTypeList = () => {
    const list = Dict.getOptionsList('activityType');
    setActivityTypeList(list);
  }

  // 发货方式
  const configDeliveryTypeList = () => {
    const list = Dict.getOptionsList('deliveryType');
    setDeliveryTypeList(list);
  }

  // 机构代码
  const requestOrgCodeListData = async () => {
    api.orgCodeList().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          const orgCodeDataList = respData.data || [];
          let list = [];
          orgCodeDataList.forEach((item) => {
            list.push({
              label: item.code,
              value: item.id,
            });
          })
          setOrgCodeList(list);
        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  // 详情数据
  const [oldBannerList, setOldBannerList] = useState([]);
  const requestDetailData = async () => {
    let detailData = {};
    
    try {
      const res = await api.eventDetail({
        id: activityId,
      });
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
            detailData = respData.data;
            
            // 轮播图
            let bannerList = detailData.activityCarouselImages || [];
            setOldBannerList(bannerList);            
            let newBannerList = [];
            bannerList.forEach((item) => {
              const imgUrls = item.imageUrl ? [item.imageUrl] : [];
              let newItem = {
                imageUrl: Util.imgUrlsToFiles(imgUrls),
                url: item.url,
              }
              newBannerList.push(newItem);
            });
            detailData.activityCarouselImages = newBannerList;

            // 发货方式
            // SELF_PICKUP: '自提', POST: '邮寄', BOTH: '自提和邮寄',
            let deliveryType = detailData.deliveryType;
            let deliveryTypeQuery = [];
            if (deliveryType) {
              if ('BOTH' === deliveryType) {
                deliveryTypeQuery = ['SELF_PICKUP', 'POST'];
              } else {
                deliveryTypeQuery = [deliveryType];
              }             
            }
            detailData.deliveryType = deliveryTypeQuery

            // 商品列表
            let goodsList = detailData.activityProducts || [];
            let newGoodsList = [];
            goodsList.forEach((item) => {
              let goodsObj = item.product;
              // 商品活动Id
              goodsObj.act_product_id = item.id;
              // 商品活动价
              if (item.discountPrice) {
                goodsObj.discountPrice = item.discountPrice;
              }
              newGoodsList.push(goodsObj);
            });
            setGoodsListData(newGoodsList);

        } else {
            MyAlert({errorMsg: respData.message});
        }
      }
    } catch (err) {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }
    console.log('---detailData---', detailData);
    return detailData;
  };

  // 创建、保存
  const saveAndCreateEvent = (type) => {
    setLoading(true);
    form.validateFields().then((values) => {
      console.log('处理前：', values);
      // 开始时间
      if (values.beginDate) {
        let startTime = Util.dateFormatter(values.beginDate)
        values.beginDate = startTime;
      }      
      // 截止时间
      if (values.endDate) {
        let endTime = Util.dateFormatter(values.endDate)
        values.endDate = endTime;
      }      

      // 发货方式
      // SELF_PICKUP: '自提', POST: '邮寄', BOTH: '自提和邮寄',
      let deliveryTypeQuery = '';
      let deliveryType = values.deliveryType.join(',');
      if (deliveryType) {
        if (deliveryType.includes('SELF_PICKUP') && deliveryType.includes('POST')) {
          deliveryTypeQuery = 'BOTH';
        } else {
          deliveryTypeQuery = deliveryType;
        }
      }
      values.deliveryType = deliveryTypeQuery

      // 轮播图
      let bannerList = values.activityCarouselImages || [];      
      if (bannerList.length <= 0) {
        message.error('请上传轮播图！', 2);
        setLoading(false);
        return;
      }
      let newBannerList = [];
      bannerList.forEach((item) => {
        const imgFiles = item.imageUrl || [];
        const imgUrl = Util.filesToImgUrls(imgFiles)[0] || '';
        let newItem = {
          imageUrl: imgUrl,
          url: item.url,
        }
        newBannerList.push(newItem);
      });
      values.activityCarouselImages = newBannerList;

      // 商品列表
      let goodsList = goodsListData || [];  
      let activityProductsQuery = [];    
      if (goodsList.length <= 0) {
        message.error('请添加活动商品！', 2);
        setLoading(false);
        return;
      }
      goodsList.forEach((item) => {
        const itemObj = {
          productId: item.id,
        }
        if (item.act_product_id) {
          itemObj.id = item.act_product_id;
        }
        if (item.discountPrice) {
          itemObj.discountPrice = item.discountPrice;
        }
        activityProductsQuery.push(itemObj);
      })
      values.activityProducts = activityProductsQuery;
      
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
    api.eventCreate({
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
  // activityCarouselImages 修改需要携带id参数（后端要求）
  const saveHandler = (values) => {
    console.log('处理后，保存：', values);
    const params = {
      id: activityId,
      ...values,
    }

    // 轮播图 id 
    let bannerList = params.activityCarouselImages || [];
    bannerList.forEach((item, index) => {
      const oldItem = oldBannerList[index] || {};
      const id = oldItem.id || '';
      if (id) {
        item.id = oldItem.id;
      }
    })
    console.log('处理id后，保存：', params);

    api.eventSave(params).then((res) => {
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

  // 商品列表
  const [selectedId, setSelectedId] = useState(null);
  const [goodsSearchList, setGoodsSearchList] = useState([]);
  const [goodsListData, setGoodsListData] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState([]);

  const columns = [
    {
      title: '商品编码',
      dataIndex: 'code',
      readonly: true,
      width: '15%',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      readonly: true,
      width: '30%',
    },
    {
      title: '原价',
      dataIndex: 'price',
      readonly: true,
      width: '15%',
    },
    {
      title: '活动价',
      dataIndex: 'discountPrice',
      editable: true,
      formItemProps: {
        rules: [
          {
            pattern: /^\d+(\.\d{1})?$/,
            message: '最多保留一位小数',
          },
        ],
      },
      width: '20%',
    },
    {
      title: '操作',
      valueType: 'option',
      width: '20%',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => { goodsEditWithId(record.id, action) }}>编辑</a>,
        <a key="delete" onClick={() => { goodsDeleteWithId(record.id) }}>删除</a>,
      ],
    },
  ];

  // 商品搜索列表
  const requestGoodsSearchListData = async (searchData) => {
    console.log('商品搜索列表', searchData)
    const searchText = searchData.keyWords || ''
    let list = [];
    try {
      const res = await api.goodsSearchList({
        code: searchText,
        page: 0,
        size: 100,
      });
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          const data = respData.data || {};
          const dataList = data.content || []
          list = goodsSelectOptions(dataList);
          setGoodsSearchList(dataList);
        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    } catch (err) {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }
    return list;
  }
  
  // 商品选项
  const goodsSelectOptions = (list) => {
    let newList = [];
    list.forEach((item) => {
      const optionName = `${item.code} ${item.name}`
      let newItem = {
        label: optionName,
        value: item.id,
      }
      newList.push(newItem);
    })
    return newList;
  }

  useEffect(() => {
    if (selectedId) {
      // 新增商品
      const newGoodsList = [...goodsListData];
      let canAdd = true;
      goodsListData.forEach((item) => {
        if (item.id === selectedId) {
          canAdd = false;
          return;
        }
      });

      if (!canAdd) {
        message.error('该商品已存在!', 2);
        setSelectedId(null);
        return;
      }

      goodsSearchList.forEach((item) => {
        if (item.id === selectedId) {
          newGoodsList.push(item);
        }
      });
      console.log('selected goods', newGoodsList);
      
      setGoodsListData(newGoodsList);
      setSelectedId(null);
    }
  }, [goodsListData, goodsSearchList, selectedId]);
  
  // 添加商品
  const goodsAddWithId = (id) => {
    console.log(`selected ${id}`);
    setSelectedId(id);
  };

  // 删除商品
  const goodsDeleteWithId = (id) => {
    console.log(`deleted ${id}`);
    const newGoodsList = goodsListData.filter((item) => item.id !== id);
    setGoodsListData(newGoodsList);
  }

  // 编辑商品
  const goodsEditWithId = (id, action) => {
    console.log(`edited ${id}`);
    action.startEditable(id)
  }

  // 保存商品
  const goodsSaveWithData = async (rowKey, data, row) => {
    console.log(`编辑商品： ${rowKey}`, data, row);
    await waitTime(300);
  }

  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  // 上传图片
  const beforeUpload = async (file) => {
    const isAllowImg = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isAllowImg) {
      message.error('图片格式不是JPG/JPEG/PNG/GIF!');
      return Upload.LIST_IGNORE
    }
    // const isAllowSize = file.size / 1024 <= 100;
    // if (!isAllowSize) {
    //   message.error('文件需要小于100KB!');
    //   return Upload.LIST_IGNORE
    // }
    await requestSignData();
    return true
  };

  // 1.上传图片签名
  const [signData, setSignData] = useState({})
  const requestSignData = async () => {   
    console.log('获取签名')
    await api.uploadFileSignPublic().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          console.log('获取签名，成功', respData)
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
    console.log('上传信息', info);
    const { status } = info.file;
    if (status === 'uploading') {
      console.log('上传中', info);
      setLoading(true);
      return;
    }
    // 上传
    if (status === 'done') {
      setLoading(false);
      const resp = info.file.response;
      console.log('上传结束', resp);
      const fileId = resp.fileId 
      const url = resp.url
      // 公有图片
      if (url) {
        console.log('上传成功-公有', url);
        info.file.url = url;
        return;
      }
      // 私有图片 
      if (fileId) {     
        console.log('上传成功-私有', fileId);  
        console.log('通过fileId获取url', fileId);          
        const fileUrlResp = await api.uploadFileGetUrl([fileId]);
        const respData = fileUrlResp.data || {};
        if (0 === respData.code) {
          console.log('获取url成功', respData);
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

  // 预览图片
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const handleCancel = () => {
    setPreviewImage('');
    setPreviewOpen(false);
  }
  const handlePreview = (file) => {
    const url = file.url || ''
    setPreviewImage(url);
    setPreviewOpen(true);
  };
  
  /**
  * Form布局
  */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const bannerItemView = () => {
    return (
      <ProFormGroup key="group" min={1}>
        <div className='banner-edit-wrap'>
          <ProFormUploadButton
            name="imageUrl"
            rules={[{ required: true, message: '请上传图片' }]}
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              beforeUpload: beforeUpload,
              data: signData.params,
              onChange: handleImgChange,
              onPreview: handlePreview
            }}
            title="上传文件"
            extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：100x100"
            action={signData.url}                  
          />
          <ProFormText
            width={'xl'}
            name="url"
            rules={[{ required: false, message: '请填写点击跳转URL' }]}
            placeholder={'请填写点击跳转URL'}
          />
        </div>             
      </ProFormGroup>   
    )
  }

  return (
    <React.Fragment>
      <Drawer 
        title={activityId ? '编辑活动' : '创建活动'} 
        footer={
          <div className="create-event-btn">
            {
              activityId ? (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('save') }}>保存</Button>
              ) : (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('create')}}>创建活动</Button>
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
          request={activityId ? requestDetailData : null}
        >
          <ProFormRadio.Group
            name="activityType"
            label="活动类型"
            rules={[{ required: true, message: '请选择活动类型' }]}
            options={activityTypeList}
          />
          <ProFormText
            name="name"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
            placeholder="请输入活动名称"
          />
          <ProFormSelect
            options={orgCodeList}
            name="institutionId"
            label="机构代码"
            rules={[{ required: true, message: '请选择机构代码' }]}
            placeholder="请选择机构代码"
          />
          <ConfigProvider locale={zhCN}>
            <ProFormDateTimePicker 
            showTime={true}
            format='YYYY-MM-DD HH:mm:ss'
            name="beginDate"
            label="开始时间"
            rules={[{ required: true, message: '请选择活动开始时间' }]}
            placeholder={'请选择活动开始时间'}
            />
          </ConfigProvider>
          <ConfigProvider locale={zhCN}>
            <ProFormDateTimePicker 
            showTime={true}
            format='YYYY-MM-DD HH:mm:ss'
            name="endDate"
            label="截止时间"
            rules={[{ required: true, message: '请选择活动截止时间' }]}
            placeholder={'请选择活动截止时间'}
            />
          </ConfigProvider>          
          <ProFormCheckbox.Group
            name="deliveryType"
            label="发货方式"
            rules={[{ required: true, message: '请选择发货方式' }]}
            options={deliveryTypeList}
          />
          <ProFormTextArea
            name="informedConsentForm"
            label="知情同意条款"
            rules={[{ required: true, message: '请输入知情同意弹框内展示的文本内容' }]}
            placeholder={'请输入知情同意弹框内展示的文本内容'}
          />
          <ProFormTextArea
            name="contactCustomerServiceInfo"
            label="联系客服"
            rules={[{ required: true, message: '请输入联系客服页面内展示的文本内容' }]}
            placeholder={'请输入联系客服页面内展示的文本内容'}
          />
          <ProFormTextArea
            name="collectionInstructions"
            label="领取说明"
            rules={[{ required: true, message: '请输入活动领取说明展示的文本内容' }]}
            placeholder={'请输入活动领取说明展示的文本内容'}
          />
          {
            activityId ? (
              <ProFormList
                required={true}
                name="activityCarouselImages"
                label="首页轮播图"             
                creatorButtonProps={{
                  creatorButtonText: '新增图片',
                }}
                copyIconProps={false}
                rules={[{ required: true, message: '请上传首页轮播图' }]}
              >
                {bannerItemView()}
              </ProFormList>
            ) : (
              <ProFormList
                required={true}
                name="activityCarouselImages"
                label="首页轮播图"             
                creatorButtonProps={{
                  creatorButtonText: '新增图片',
                }}
                copyIconProps={false}
                rules={[{ required: true, message: '请上传首页轮播图' }]}
                initialValue={[
                  {
                    imageUrl: [],
                    url: '',
                  },
                ]}
              >
                {bannerItemView()}
              </ProFormList>
            )
          }                    
          <ProFormDigit
            name="maxQuantity"
            label="商品限购数量"
            rules={[{ required: true, message: '请输入商品限购数量' }]}
            placeholder="请输入商品限购数量"
            min={1}
            max={100000}
            fieldProps={{ precision: 0 }}
          />
          <div className='goods-edit-wrap'>
            {/* FIXME: 修改为输入框和按钮分开 */}
            <ProFormSelect              
              required={true}
              showSearch
              debounceTime={500}
              label="活动商品"
              request={requestGoodsSearchListData}
              rules={[{ required: true, message: '请输入商品编号' }]}
              placeholder="请输入商品编号"
              // onChange={(id) => { goodsAddWithId(id); }}
              fieldProps={{
                // labelInValue: true,
                showArrow: false,                
                filterOption: false,        
                onSelect: (id) => { goodsAddWithId(id); }                
              }}
            />
            <Row>
              <Col span={4}></Col>
              <Col span={20}>
                <EditableProTable
                  rowKey="id"
                  recordCreatorProps={false}
                  loading={false}
                  columns={columns}
                  value={goodsListData}
                  onChange={setGoodsListData}
                  editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                      await goodsSaveWithData(rowKey, data, row);                  
                    },
                    onChange: setEditableRowKeys,
                  }}
                />
              </Col>
            </Row>            
          </div>         
        </ProForm>
        <Modal open={previewOpen} title={null} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} width={500} height={500} />
        </Modal>
      </Drawer>
    </React.Fragment>
  );
}
