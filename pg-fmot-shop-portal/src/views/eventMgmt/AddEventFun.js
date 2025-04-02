import React, { useState, useEffect } from 'react';
import { Drawer, Form, message, Button, ConfigProvider, Row, Col} from 'antd';
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
import moment from 'moment';
import Dict from '../../config/Dict';
import { ImgUrlsToFiles, FilesToImgUrls } from '../../utils/util';

export function AddEventFun({
  eventId,
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
  const requestOrgCodeListData = () => {
    api.orgCodeList().then((res) => {
      if (res) {
        const respData = res.data;
        if (0 === respData.code) {
          let list = [];
          respData.data.forEach((item) => {
            list.push({
              label: item.name,
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
  const requestDetailData = async () => {
    let detailData = {};
    
    try {
      const res = await api.eventDetail(eventId);
      if (res) {
        const respData = res.data;
        if (0 === respData.code) {
            detailData = respData.data;
            
            // 轮播图
            let bannerList = detailData.activityBanner || [];
            let newBannerList = [];
            bannerList.forEach((item) => {
              const imgUrls = item.bannerImg ? [item.bannerImg] : [];
              let newItem = {
                bannerImg: ImgUrlsToFiles(imgUrls),
                bannerLink: item.bannerLink,
              }
              newBannerList.push(newItem);
            });
            detailData.activityBanner = newBannerList;

            // 商品列表
            let goodsList = detailData.goodsList || [];
            let newGoodsList = [];
            goodsList.forEach((item) => {
              newGoodsList.push(item);
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
      if (values.startTime) {
        let startTime = moment(new Date(values.startTime)).format('YYYY-MM-DD HH:mm:ss')
        values.startTime = startTime;
      }      
      // 结束时间
      if (values.endTime) {
        let endTime = moment(new Date(values.endTime)).format('YYYY-MM-DD HH:mm:ss')
        values.endTime = endTime;
      }      

      // 轮播图
      let bannerList = values.activityBanner || [];      
      if (bannerList.length <= 0) {
        message.error('请上传首页轮播图！', 2);
        setLoading(false);
        return;
      }
      let newBannerList = [];
      bannerList.forEach((item) => {
        const imgFiles = item.bannerImg ? item.bannerImg : [];
        const imgUrl = FilesToImgUrls(imgFiles)[0] || '';
        let newItem = {
          bannerImg: imgUrl,
          bannerLink: item.bannerLink,
        }
        newBannerList.push(newItem);
      });
      values.activityBanner = newBannerList;

      // 商品列表
      let goodsList = goodsListData || [];      
      if (goodsList.length <= 0) {
        message.error('请添加活动商品！', 2);
        setLoading(false);
        return;
      }
      values.goodsList = goodsList;
      
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
        const respData = res.data;
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
    api.eventSave({
      ...values,
    }).then((res) => {
      if (res) {
        setLoading(false);
        const respData = res.data;
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

  /**
   * Form布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  // 商品列表
  const [selectedId, setSelectedId] = useState(null);
  const [goodsSearchList, setGoodsSearchList] = useState([]);
  const [goodsListData, setGoodsListData] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState([]);

  const columns = [
    {
      title: '商品编码',
      dataIndex: 'goodsCode',
      readonly: true,
      width: '15%',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      readonly: true,
      width: '30%',
    },
    {
      title: '原价',
      dataIndex: 'goodsPrice',
      readonly: true,
      width: '15%',
    },
    {
      title: '活动价',
      dataIndex: 'goodsActivityPrice',
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
  const requestGoodsSearchListData = async (searchText) => {
    let list = [];
    try {
      const res = await api.goodsSearchList({
        searchText: searchText,
      });
      if (res) {
        const respData = res.data;
        if (0 === respData.code) {
          console.log('---goodsList---', respData.data);
          let dataList = respData.data || []
          if (dataList.length > 0) {
            list = goodsSelectOptions(dataList);
            setGoodsSearchList(dataList);
          }
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
      let newItem = {
        label: item.goodsName,
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
    console.log(`saved ${rowKey}`, data, row);
    await waitTime(1000);
  }

  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  return (
    <React.Fragment>
      <Drawer 
        title={eventId ? '编辑活动' : '创建活动'} 
        footer={
          <div className="create-event-btn">
            {
              eventId ? (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('save') }}>保存</Button>
              ) : (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('create')}}>创建活动</Button>
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
          request={eventId ? requestDetailData : null}
        >
          <ProFormRadio.Group
            name="activityType"
            label="活动类型"
            rules={[{ required: true, message: '请选择活动类型' }]}
            options={activityTypeList}
          />
          <ProFormText
            name="activityName"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
            placeholder="请输入活动名称"
          />
          <ProFormSelect
            options={orgCodeList}
            name="orgCode"
            label="机构代码"
            rules={[{ required: true, message: '请选择机构代码' }]}
            placeholder="请选择机构代码"
          />
          <ConfigProvider locale={zhCN}>
            <ProFormDateTimePicker 
            showTime={true}
            format='YYYY-MM-DD HH:mm:ss'
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择活动开始时间' }]}
            placeholder={'请选择活动开始时间'}
            />
          </ConfigProvider>
          <ConfigProvider locale={zhCN}>
            <ProFormDateTimePicker 
            showTime={true}
            format='YYYY-MM-DD HH:mm:ss'
            name="endTime"
            label="结束时间"
            rules={[{ required: true, message: '请选择活动结束时间' }]}
            placeholder={'请选择活动结束时间'}
            />
          </ConfigProvider>          
          <ProFormCheckbox.Group
            name="deliveryType"
            label="发货方式"
            rules={[{ required: true, message: '请选择发货方式' }]}
            options={deliveryTypeList}
          />
          <ProFormTextArea
            name="informNote"
            label="知情同意条款"
            rules={[{ required: true, message: '请输入知情同意弹框内展示的文本内容' }]}
            placeholder={'请输入知情同意弹框内展示的文本内容'}
          />
          <ProFormTextArea
            name="serviceNote"
            label="联系客服"
            rules={[{ required: true, message: '请输入联系客服页面内展示的文本内容' }]}
            placeholder={'请输入联系客服页面内展示的文本内容'}
          />
          <ProFormTextArea
            name="activityDesc"
            label="领取说明"
            rules={[{ required: true, message: '请输入活动领取说明展示的文本内容' }]}
            placeholder={'请输入活动领取说明展示的文本内容'}
          />
          <ProFormList
            name="activityBanner"
            label="首页轮播图"             
            creatorButtonProps={{
              creatorButtonText: '新增图片',
            }}
            copyIconProps={false}
            rules={[{ required: true, message: '请上传首页轮播图' }]}
          >
            <ProFormGroup key="group" min={1}>
              <div className='banner-edit-wrap'>
              <ProFormUploadButton
                name="bannerImg"
                rules={[{ required: true, message: '请上传图片' }]}
                max={1}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                }}
                title="上传文件"
                extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：100x100"
              />
              <ProFormText
                width={'xl'}
                name="bannerLink"
                rules={[{ required: true, message: '请填写点击跳转URL' }]}
                placeholder={'请填写点击跳转URL'}
              />
              </div>
             
            </ProFormGroup>
          </ProFormList>
          <ProFormDigit
            name="goodsLimitCount"
            label="商品限购数量"
            rules={[{ required: true, message: '请输入商品限购数量' }]}
            placeholder="请输入商品限购数量"
            min={1}
            max={100000}
            fieldProps={{ precision: 0 }}
          />
          <div className='goods-edit-wrap'>
            <ProFormSelect
              showSearch
              showArrow={false}
              allowClear
              labelInValue
              debounceTime={500}
              label="活动商品"
              request={requestGoodsSearchListData}
              rules={[{ required: true, message: '请输入商品编号' }]}
              placeholder="请输入商品编号"
              onChange={(id) => { goodsAddWithId(id); }}
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
      </Drawer>
    </React.Fragment>
  );
}
