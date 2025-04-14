import React, { Component } from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';
import {
  Table,
  message,
  Pagination,
  Form,
  Input,
  Row,
  Col,
  Divider,
  DatePicker,
  Select,
  ConfigProvider,
  notification,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import zhCN from 'antd/es/locale/zh_CN';
import Dict from '../../config/Dict';
// import axios from 'axios';
import Util from '../../utils/util';

const { Option } = Select;
const { RangePicker } = DatePicker;

class OrderMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgCodeList: [],
      deliveryTypeList: [],
      orderStatusList: [],

      data: [],
      loadingShow: false,
      queryData: null,
      pageNo: 0,
      pageSize: 10,
      totalNum: 10,
    };
  }

  componentDidMount() {
    const self = this;
    self.requestListData();
    self.requestOrgCodeListData();
    self.configDeliveryTypeList();
    self.configOrderStatusList();
  }

  // 发货方式
  configDeliveryTypeList = () => {
    const self = this;
    const list = Dict.getOptionsList('deliveryType');
    self.setState({
      deliveryTypeList: list,
    })
  }

  // 订单状态
  configOrderStatusList = () => {
    const self = this;
    const list = Dict.getOptionsList('orderStatus');
    self.setState({
      orderStatusList: list,
    })
  }

  // 机构代码
  requestOrgCodeListData = () => {
    const self = this;
    api.orgCodeList().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          self.setState({
            orgCodeList: respData.data,
          });
        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  // 列表数据
  requestListData = () => {
    const self = this;
    const { pageNo, pageSize, queryData } = self.state;
    self.setState({ loadingShow: true });
    // 时间处理
    if (queryData && queryData.date) {
      queryData.beginDate = Util.dateFormatter(queryData.date[0]);
      queryData.endDate = Util.dateFormatter(queryData.date[1]);
      delete queryData.date;
    }
    api.orderList({
      ...queryData,
      page: pageNo,
      size: pageSize,
    }).then((res) => {
      self.setState({ loadingShow: false });
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          self.setState({
            data: respData.data.content || [],
            totalNum: respData.data.totalElements,
          });
        } else {
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      self.setState({ loadingShow: false });
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  // 翻页OnChange
  pageOnChange(pageNo, pageSize) {
    const self = this;
    self.setState({
      pageNo,
      pageSize,
      totalNum: self.state.totalNum,
    },() => {
      self.requestListData();
    });
  }

  // 渲染列表
  onFinish = () => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        self.setState({ 
          queryData: values
        }, () => {
          self.requestListData();
        });
      }
    });
  };

  // 导出
  exportAll = () => {
    const self = this;
    self.setState({ loadingShow: true });
    self.props.form.validateFields((err, values) => {
      if (!err) {
        self.setState({ 
          queryData: values 
        }, () => {
          self.requestExportFile();
        });
      }      
    });
  };

  // 1.获取导出文件，任务id
  requestExportFile = () => {
    console.log('导出文件')
    const self = this;
    const { pageNo, pageSize, queryData } = self.state;
    self.setState({ loadingShow: true });
    // 时间处理
    if (queryData && queryData.date) {
      queryData.beginDate = Util.dateFormatter(queryData.date[0]);
      queryData.endDate = Util.dateFormatter(queryData.date[1]);
      delete queryData.date;
    }
    api.orderListExport({
      ...queryData,
      page: pageNo,
      size: pageSize,
    }).then((res) => {      
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          console.log('导出文件，成功', respData)
          const exportData = respData.data || {};
          const taskId = exportData.id || '';
          self.requestExportFileResult(taskId);
        } else {
          console.log('导出文件，错误')
          self.setState({ loadingShow: false });
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      console.log('导出文件，失败')
      self.setState({ loadingShow: false });
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  }

  // 2.轮询查询导出结果
  requestExportFileResult = (taskId) => {
    console.log('查询导出结果', taskId)
    const self = this;    
    api.asyncTaskDetail({
      id: taskId,
    }).then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          console.log('查询导出结果', respData)
          const resultData = respData.data || {};
          self.handleExportResult(resultData, taskId);
        } else {
          console.log('查询导出结果，错误')
          self.setState({ loadingShow: false });
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      console.log('查询导出结果，失败')
      self.setState({ loadingShow: false });
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }) 
  }

  // 3.处理查询结果
  handleExportResult = (data, taskId) => {
    const self = this
    const status = data.status || '';
    const isSuccess = data.result;
    const resultTxt = data.resultTxt;
    const resultTxtList = Util.safeParseJsonArray(resultTxt);

    if (status === 'INIT') {
      console.log('查询导出结果，初始化')
      setTimeout(() => {
        self.requestExportFileResult(taskId);
      }, 1000);
    } else if (status === 'DOING') {            
      console.log('查询导出结果，进行中')
      setTimeout(() => {
        self.requestExportFileResult(taskId);
      }, 1000);
    } else if (status === 'DONE') {
      console.log('查询导出结果，完成')
      const downloadFileId = data.downloadFileId || '';      
      if (isSuccess) {
        console.log('查询导出结果，成功')
        self.downloadExportFile(downloadFileId);
      } else {
        console.log(resultTxtList)
        console.log('查询导出结果，失败')    
      }
    } else {
      console.log('查询导出结果，未知')
    }
  }

  // 4.下载导出文件
  downloadExportFile = (url) => {
    console.log('下载导出文件', url)
    const self = this;
    if (!url) {
      self.setState({ loadingShow: false });
      MyAlert({ errorMsg: '文件导出失败, 请重试!' });
      return;
    }
    const objectUrl = url;
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = objectUrl;
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href);
    document.body.removeChild(elink);
    // 导出成功
    self.setState({ loadingShow: false });
    notification['success']({
      message: '文件导出成功！',
      description: '请打开Excel文件进行查看！',
    });
  }


  render() {
    const { orgCodeList, deliveryTypeList, orderStatusList } = this.state;
    const {
      form: { resetFields, getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '下单时间',
        dataIndex: 'createDate',
        width: 100,
        key: 'createDate',
        align: 'center',
        render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '订单编号',
        dataIndex: 'orderCode',
        width: 100,
        key: 'orderCode',
        align: 'center',
      },
      {
        title: '活动ID',
        dataIndex: 'activityId',
        width: 100,
        key: 'activityId',
        align: 'center',
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        width: 100,
        key: 'activityName',
        align: 'center',
      },
      {
        title: '机构代码',
        dataIndex: 'institutionCode',
        width: 100,
        key: 'institutionCode',
        align: 'center',
      },
      {
        title: '用户账号',
        dataIndex: 'pointAccount',
        width: 100,
        key: 'pointAccount',
        align: 'center',
      },
      {
        title: '发货类型',
        dataIndex: 'deliveryType',
        width: 100,
        key: 'deliveryType',
        align: 'center',
        render: (text) => <>{Dict.getValue('deliveryType', text, '')}</>,
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        width: 100,
        key: 'orderStatus',
        align: 'center',
        render: (text) => <>{Dict.getValue('orderStatus', text, '')}</>,
      },
      {
        title: '兑换商品',
        dataIndex: 'orderItems',
        width: 100,
        key: 'orderItems',
        align: 'center',
        render: (text, record) => {
          const goodsListView = (
            <div className="goods-list-wrap">
              {
                record.orderItems && record.orderItems.length > 0 && record.orderItems.map((item, index) => (
                  <span key={index}>{`${item.code} ${item.name}x${item.quantity} ${item.price}积分`}</span>
                ))
              }
            </div>
          );
          return goodsListView;
        },
      },
      {
        title: '商品数量',
        dataIndex: 'totalCount',
        width: 80,
        key: 'totalCount',
        align: 'center',
      },
      {
        title: '合计积分',
        dataIndex: 'totalAmount',
        width: 80,
        key: 'totalAmount',
        ellipsis: true,
        align: 'center',
      },
    ];
    return (
      <HomeLayout>
        <p className="list-title">订单管理</p>
        <Divider style={{ margin: '3px 0' }} />
        <div className="common-list">
          <div className="item1">
            <Form className="user_search" onFinish={() => { this.onFinish(); }} style={{ alignItems: 'baseline' }}>
              <div className="flex1">
                <Row gutter={24}>
                  <Col span={8}>
                    <ConfigProvider locale={zhCN}>
                      <Form.Item>{getFieldDecorator('date',{})(
                        <RangePicker
                        showTime={true}
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ width: '100%' }} 
                        placeholder={['请选择查询时间段', '请选择查询时间段']} />
                      )}
                      </Form.Item>
                    </ConfigProvider>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('activityName',{})(
                      <Input placeholder="请输入活动名称" />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('activityId',{})(
                      <Input placeholder="请输入活动ID" />
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('institutionId',{})(
                      <Select placeholder="请选择机构代码" style={{ width: '100%' }}>
                        {
                          orgCodeList && orgCodeList.length > 0 && orgCodeList.map((item, index) => (
                            <Option key={index} value={item.id}>{item.code}</Option>
                          ))
                        }
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('pointAccount',{})(
                      <Input placeholder="请输入用户账号" />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('productCode',{})(
                      <Input placeholder="请输入商品编号" />
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('productName',{})(
                      <Input placeholder="请输入商品名称" />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('deliveryType',{})(
                      <Select placeholder="请选择发货类型" style={{ width: '100%' }} options={deliveryTypeList}>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('orderStatus',{})(
                      <Select placeholder="请选订单状态" style={{ width: '100%' }} options={orderStatusList}>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24} style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className="btn-width">
                      <button className="current-btn" onClick={() => {
                        this.setState({ pageNo: 0 });
                      }}>
                        <SearchOutlined />
                        <span>查询</span>
                      </button>
                      <button className="current-btn" onClick={() => {
                        this.setState({
                          pageNo: 0,
                          // pageSize: 10,
                        }, () => {
                          this.exportAll();
                        });
                      }}>
                        <ExportOutlined />
                        <span>导出 Excel</span>
                      </button>
                      <button className="current-btn bg-gray" onClick={() => {
                        this.setState({
                          pageNo: 0,
                          pageSize: 10,
                        }, () => {
                          resetFields();
                        });
                      }}>
                        <ReloadOutlined />
                        <span>重置</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </div>
          <div className="item2">
            <Table
              size="middle"
              loading={this.state.loadingShow}
              pagination={false}
              rowKey="id"
              columns={columns}
              dataSource={this.state.data}
              rowClassName={(record, idx) => {
                if (idx % 2 === 1) return 'bg-row';
              }}
            />
            {this.state.data.length > 0 && (
              <Pagination
                style={{ paddingTop: '25px' }}
                pageSize={this.state.pageSize}
                current={this.state.pageNo + 1}
                total={this.state.totalNum}
                onChange={(pageNo, pageSize) =>
                  this.pageOnChange(pageNo - 1, pageSize)
                }
              />
            )}
          </div>
        </div>
      </HomeLayout>
    );
  }
}

export default createForm()(OrderMgmt);
