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
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

class OrderMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      orgCodeList: [],
      selectOrgCodeList: [],
      payStatusData: [
        {
          id: 'PAID',
          name: 'Paid',
        },
        {
          id: 'UNPAID',
          name: 'Unpaid',
        },
      ],
      loadingShow: false,
      reportQueryData: null,

      pageNo: 0,
      pageSize: 10,
      totalNum: 10,
    };
  }

  async componentDidMount() {
    const self = this;
    self.requestListData();
    self.requestOrgCodeListData();
  }

  /**
   * 列表数据请求
   */
  requestListData = () => {
    const self = this;
    const { pageNo, pageSize, reportQueryData } = self.state;
    self.setState({ loadingShow: true });
    if (reportQueryData && reportQueryData.date) {
      reportQueryData.beginDate = moment(
        new Date(reportQueryData.date[0])
      ).format('YYYY-MM-DD');
      reportQueryData.endDate = moment(
        new Date(reportQueryData.date[1])
      ).format('YYYY-MM-DD');
      delete reportQueryData.date;
    }
    api
      .orderList({
        ...reportQueryData,
        page: pageNo,
        size: pageSize,
      })
      .then((res) => {
        self.setState({ loadingShow: false });
        if (res) {
          if (0 === res.data.code) {
            self.setState({
              data: res.data.data.content,
              totalNum: res.data.data.totalElements,
            });
          } else {
            MyAlert({ errorMsg: res.data.message });
          }
        }
      })
      .catch((err) => {
        self.setState({ loadingShow: false });
        message.error(err ? err : '网络请求失败, 请重试!', 2);
      });
  };

  // 机构代码
  requestOrgCodeListData = () => {
    const self = this;
    api
      .orgCodeList()
      .then((res) => {
        if (res) {
          if (0 === res.data.code) {
            self.setState({
              orgCodeList: res.data.data,
            });
          } else {
            MyAlert({ errorMsg: res.data.message });
          }
        }
      })
      .catch((err) => {
        self.setState({ loadingShow: false });
        message.error(err ? err : '网络请求失败, 请重试!', 2);
      });
  };

  // 选择机构代码
  selectOrgCode = (value) => {
    const self = this;
    let { orgCodeList } = self.state;
    let list = [];
    for (const key in orgCodeList) {
      if (orgCodeList[key].id === value) {
        list = orgCodeList[key].shopAreas;
        break;
      }
    }
    self.setState({
      selectOrgCodeList: list || [],
    });
  };

  /**
   * 翻页OnChange
   */
  pageOnChange(pageNo, pageSize) {
    const self = this;
    self.setState(
      {
        pageNo,
        pageSize,
        totalNum: self.state.totalNum,
      },
      () => {
        self.requestListData();
      }
    );
  }

  /**
   * 渲染列表
   */
  onFinish = () => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        self.setState({ reportQueryData: values }, () => {
          self.requestListData();
        });
      }
    });
  };

  /**
   * 导出
   */
  exportAll = () => {
    const self = this;
    const { pageNo, pageSize } = this.state;
    self.setState({ loadingShow: true });

    self.props.form.validateFields((err, values) => {
      if (values.date) {
        values.beginDate = moment(new Date(values.date[0])).format('YYYY-MM-DD');
        values.endDate = moment(new Date(values.date[1])).format('YYYY-MM-DD');
      }

      return new Promise(() => {
        const fileName = 'FMOT Redemption Report';
        const exportUrl = URL.orderListExport;
        axios({
          url: exportUrl,
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            Pragma: 'no-cache',
            Authorization: localStorage.getItem('token') || '',
          },
          data: {
            ...values,
            page: pageNo,
            size: pageSize,
          },
          responseType: 'blob',
        }).then((res) => {
          self.setState({ loadingShow: false });
          if (res.status === 200) {
            const blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel;charset=utf-8',
            });
            const objectUrl = URL.createObjectURL(blob);
            const elink = document.createElement('a');
            elink.download = `${fileName}.xlsx`;
            elink.style.display = 'none';
            elink.href = objectUrl;
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);

            notification['success']({
              message: 'File exported successfully！',
              description: 'Open Excel to view export details.',
            });
          }
        }).catch((err) => {
          self.setState({ loadingShow: false });
          message.error(err ? err : '网络请求失败, 请重试!', 2);
        });
      });
    });
  };

  render() {
    const { orgCodeList } = this.state;
    const {
      form: { resetFields, getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '下单时间',
        dataIndex: 'createTime',
        width: 100,
        key: 'createTime',
        align: 'center',
        render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '订单编号',
        dataIndex: 'orderNO',
        width: 100,
        key: 'orderNO',
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
        dataIndex: 'orgCode',
        width: 100,
        key: 'orgCode',
        align: 'center',
      },
      {
        title: '用户账号',
        dataIndex: 'accountId',
        width: 100,
        key: 'accountId',
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
        dataIndex: 'goodsList',
        width: 100,
        key: 'goodsList',
        align: 'center',
        render: (text, record) => {
          // const findItem = text.find((item) => item.id === text);
          const goodsListView = (
            <div className="goods-list-wrap">
              {record.goodsList.map((item, index) => (
                <span key={index}>{`${item.goodsName} x${item.goodsNum}`}</span>
              ))}
            </div>
          );
          return goodsListView;
        },
      },
      {
        title: '商品数量',
        dataIndex: 'goodsCount',
        width: 80,
        key: 'goodsCount',
        align: 'center',
      },
      {
        title: '合计积分',
        dataIndex: 'totalPoints',
        width: 80,
        key: 'totalPoints',
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
            <Form
              className="user_search"
              onFinish={() => {
                this.onFinish();
              }}
              style={{ alignItems: 'baseline' }}
            >
              <div className="flex1">
                <Row gutter={24}>
                  <Col span={8}>
                    <ConfigProvider locale={zhCN}>
                      <Form.Item>
                        {getFieldDecorator(
                          'date',
                          {}
                        )(
                          <RangePicker
                            style={{ width: '100%' }}
                            placeholder={[
                              '请选择查询时间段',
                              '请选择查询时间段',
                            ]}
                          />
                        )}
                      </Form.Item>
                    </ConfigProvider>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'shopNameOrId',
                        {}
                      )(<Input placeholder="请输入活动名称" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'janRainId',
                        {}
                      )(<Input placeholder="请输入活动ID" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: 10 }}>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'shopMarketId',
                        {}
                      )(
                        <Select
                          placeholder="请选择机构代码"
                          onSelect={this.selectOrgCode}
                        >
                          {orgCodeList.length > 0 &&
                            orgCodeList.map((item, index) => (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'eventNameOrEventId',
                        {}
                      )(<Input placeholder="请输入用户账号" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'soldToStoreNo',
                        {}
                      )(<Input placeholder="请输入商品编号" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: 10 }}>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'soldToStoreNo',
                        {}
                      )(<Input placeholder="请输入商品名称" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'payStatus',
                        {}
                      )(
                        <Select
                          placeholder="请选择发货类型"
                          style={{ width: '100%' }}
                        >
                          <Option value="PICKUP">自提</Option>
                          <Option value="EXPRESS">邮寄</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator(
                        'shopAreaId',
                        {}
                      )(
                        <Select
                          placeholder="请选订单状态"
                          style={{ width: '100%' }}
                        >
                          <Option value="SUCCESS">交易成功</Option>
                          <Option value="CANCEL">已取消</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: 10 }}>
                  <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <div className="btn-width">
                      <button
                        className="current-btn"
                        onClick={() => {
                          this.setState({ pageNo: 0 });
                        }}
                      >
                        <SearchOutlined />
                        <span>查询</span>
                      </button>
                      <button
                        className="current-btn"
                        onClick={() => {
                          this.setState(
                            {
                              pageNo: 0,
                              // pageSize: 10,
                            },
                            () => {
                              this.exportAll();
                            }
                          );
                        }}
                      >
                        <ExportOutlined />
                        <span>导出 Excel</span>
                      </button>
                      <button
                        className="current-btn bg-gray"
                        onClick={() => {
                          this.setState(
                            {
                              pageNo: 0,
                              pageSize: 10,
                              selectOrgCodeList: [],
                            },
                            () => {
                              resetFields();
                            }
                          );
                        }}
                      >
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
              rowKey="couponCode"
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
