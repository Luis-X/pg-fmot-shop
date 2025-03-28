import React, { useState, useEffect } from 'react';
import { Drawer, Form, message, Button, ConfigProvider } from 'antd';
import {
  ProCard,
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

export function AddEventFun({
  eventId,
  show,
  onHide,
  updateList,
}) {
  const [orgCodeData, setOrgCodeData] = useState([]);
  const [goodsListData, setGoodsListData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      await requestOrgCodeData();
      await requestGoodsListData();
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
      const res = await api.eventDetail(eventId);
      if (res) {
        if (0 === res.data.code) {
            detailData = res.data.data;
            // 轮播图
            let bannerList = [];
            detailData.activityBanner.forEach((item) => {
              const imgUrls = item.bannerImg ? [item.bannerImg] : [];
              let newItem = {
                bannerImg: imgUrlsToFiles(imgUrls),
                bannerLink: item.bannerLink,
              }
              bannerList.push(newItem);
            });
            detailData.activityBanner = bannerList;
        } else {
            MyAlert({errorMsg: res.data.message});
        }
      }
    } catch (err) {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }
    console.log('---detailData---', detailData);
    return detailData;
  };

  /**
   * 机构代码数据
   */
  const requestOrgCodeData = () => {
    let list = [];    
    api.orgCodeList().then((res) => {
      if (res) {
        if (0 === res.data.code) {
          if (res.data.data.length > 0) {
            for (let i in res.data.data) {
              list.push({
                label: res.data.data[i].name,
                value: res.data.data[i].id,
              });
            }
            setOrgCodeData(list || []);
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
   * 商品数据
   */
  const requestGoodsListData = () => {
    let list = [];    
    api.eventGoodsList().then((res) => {
      if (res) {
        if (0 === res.data.code) {
          if (res.data.data.length > 0) {
            for (let i in res.data.data) {
              list.push({
                label: res.data.data[i].name,
                value: res.data.data[i].id,
              });
            }
            setGoodsListData(list || []);
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
      // 开始时间
      if (values.startTime) {
        let startTime = moment(new Date(values.startTime)).format('YYYY-MM-DD')
        values.startTime = startTime;
      }      
      // 结束时间
      if (values.endTime) {
        let endTime = moment(new Date(values.endTime)).format('YYYY-MM-DD')
        values.endTime = endTime;
      }      
      // 轮播图
      let bannerList = [];
      values.activityBanner.forEach((item) => {
        const imgFiles = item.bannerImg ? item.bannerImg : [];
        const imgUrl = filesToImgUrls(imgFiles)[0] || '';
        let newItem = {
          bannerImg: imgUrl,
          bannerLink: item.bannerLink,
        }
        bannerList.push(newItem);
      });
      values.activityBanner = bannerList;
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
    api.eventCreate({
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
    api.eventSave({
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

  const columns = [
    {
      title: '商品编码',
      dataIndex: 'goodsCode',
      readonly: true,
      width: '30%',
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
      width: '20%',
    },
    {
      title: '活动价',
      dataIndex: 'goodsActivityPrice',
      editable: true,
      width: '20%',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => { action?.startEditable?.(record.id) }}>编辑</a>,
        <a key="delete" onClick={() => { setDataSource(dataSource.filter((item) => item.id !== record.id)) }}>删除</a>,
      ],
    },
  ];

  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const goodsSelectChange = (value) => {
    console.log(`selected ${value}`);

    let newData = [];
    value.forEach(element => {
      newData.push({
        id: element,
        goodsCode: element,
        goodsName: '商品名称',
        goodsPrice: '100',
        goodsActivityPrice: '100',
      })
    });
    console.log(newData)
    setDataSource(newData);
  };

  return (
    <React.Fragment>
      <Drawer 
        title={eventId ? '活动信息' : '新增活动'} 
        footer={
          <div className="create-event-btn">
            {
              eventId ? (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('save') }}>保存</Button>
              ) : (
                <Button type="primary" disabled={Loading} onClick={() => { saveAndCreateEvent('create')}}>新增活动</Button>
              )
            }
            <Button onClick={onHide}>取消</Button>
          </div>
        } 
        width={920} 
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
            name="activityType"
            label="活动类型"
            rules={[{ required: true, message: '请选择活动类型' }]}
            initialValue="1"
            options={[
              {
                label: '内部活动',
                value: '1',
              },
              {
                label: '外部活动',
                value: '2',
              },
            ]}
          />
          <ProFormText
            name="activityName"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
            placeholder="请输入活动名称"
          />
          <ProFormSelect
            options={orgCodeData}
            name="orgCode"
            label="机构代码"
            rules={[{ required: true, message: '请选择机构代码' }]}
            placeholder="请选择机构代码"
          />
          <ConfigProvider locale={zhCN}>
            <ProFormDateTimePicker 
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择活动开始时间' }]}
            placeholder={'请选择活动开始时间'}
            />
          </ConfigProvider>
          <ConfigProvider locale={zhCN}>
            <ProFormDateTimePicker 
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
            initialValue={['1']}
            options={[
              {
                label: '自提',
                value: '1',
              },
              {
                label: '邮寄',
                value: '2',
              },
            ]}
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
            initialValue={[
              {
                bannerImg: [],
                bannerLink: '',
              }
            ]}
            creatorButtonProps={{
              creatorButtonText: '新增图片',
            }}
            copyIconProps={false}
            itemRender={({ listDom, action }, { record }) => {
              return (
                <ProCard bordered extra={action} title={record?.name} style={{ marginBlockEnd: 8 }}>{listDom}</ProCard>
              );
            }}
          >
            <ProFormGroup key="group" min={1}>
              <ProFormUploadButton
                name="bannerImg"
                max={1}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                }}
                title="上传文件"
                extra="只能上传jpg/jpeg/png/gif文件，建议尺寸：100x100"
              />
              <ProFormText
                name="bannerLink"
                rules={[{ required: true, message: '请填写点击跳转URL' }]}
                placeholder={'请填写点击跳转URL'}
              />
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
          <ProFormSelect
            mode="multiple"
            allowClear
            options={goodsListData}
            labelInValue
            name="activityGoods"
            label="活动商品"
            rules={[{ required: true, message: '请输入商品编号' }]}
            placeholder="请输入商品编号"
            onChange={goodsSelectChange}
          />
          <EditableProTable
            rowKey="id"
            recordCreatorProps={false}
            loading={false}
            columns={columns}
            value={dataSource}
            onChange={setDataSource}
            editable={{
              type: 'multiple',
              editableKeys,
              onSave: async (rowKey, data, row) => {
                console.log(rowKey, data, row);
                await waitTime(2000);
              },
              onChange: setEditableRowKeys,
            }}
          />
        </ProForm>
      </Drawer>
    </React.Fragment>
  );
}
