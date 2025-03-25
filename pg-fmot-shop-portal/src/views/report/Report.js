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
import en_GB from 'antd/es/locale/en_GB';
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      marketData: [],
      shopAreasData: [],
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
      visible: false,
      reportQueryData: null,

      pageNo: 0,
      pageSize: 10,
      totalNum: 10,
    };
  }

  async componentDidMount() {
    this.reportList();
    this.marketList();
  }

  reportList = () => {
    const { pageNo, pageSize, reportQueryData } = this.state;
    this.setState({ loadingShow: true });
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
      .reportList({
        ...reportQueryData,
        page: pageNo,
        size: pageSize,
      })
      .then((res) => {
        this.setState({ loadingShow: false });
        if (res) {
          if (0 === res.data.code) {
            this.setState({
              data: res.data.data.content,
              totalNum: res.data.data.totalElements,
            });
          } else {
            MyAlert({ errorMsg: res.data.message });
          }
        }
      })
      .catch((err) => {
        this.setState({ loadingShow: false });
        message.error(err ? err : 'link failure！', 2);
      });
  };

  marketList = () => {
    api
      .marketData()
      .then((res) => {
        if (res) {
          if (0 === res.data.code) {
            this.setState({
              marketData: res.data.data,
            });
          } else {
            MyAlert({ errorMsg: res.data.message });
          }
        }
      })
      .catch((err) => {
        this.setState({ loadingShow: false });
        message.error(err ? err : 'link failure！', 2);
      });
  };

  selectMarket = (value) => {
    let { marketData } = this.state;
    let shopAreasData = [];
    for (const key in marketData) {
      if (marketData[key].id === value) {
        shopAreasData = marketData[key].shopAreas;
        break;
      }
    }
    this.setState({
      shopAreasData: shopAreasData || [],
    });
  };

  pageOnChange(pageNo, pageSize) {
    this.setState(
      {
        pageNo,
        pageSize,
        totalNum: this.state.totalNum,
      },
      () => {
        this.reportList();
      }
    );
  }

  /**
   * 导出
   */
  exportAll = () => {
    const _this = this;
    const { pageNo, pageSize } = this.state;
    _this.setState({ loadingShow: true });

    this.props.form.validateFields((err, values) => {
      if (values.date) {
        values.beginDate = moment(new Date(values.date[0])).format(
          'YYYY-MM-DD'
        );
        values.endDate = moment(new Date(values.date[1])).format('YYYY-MM-DD');
      }

      return new Promise(() => {
        const fileName = 'FMOT Redemption Report';
        axios({
          url: '/api/admin/couponWriteLog/export',
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
        })
          .then((res) => {
            _this.setState({ loadingShow: false });
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
          })
          .catch(function () {
            _this.setState({ loadingShow: false });
            message.error('link failure！', 2);
          });
      });
    });
  };

  onFinish = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ reportQueryData: values }, () => {
          this.reportList();
        });
      }
    });
  };

  render() {
    const { marketData, shopAreasData, payStatusData } = this.state;
    const {
      form: { resetFields, getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '下单时间',
        dataIndex: 'createDate',
        width: 80,
        key: 'createDate',
        // ellipsis: true,
        align: 'center',
        render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '订单编号',
        dataIndex: 'couponCode',
        width: 80,
        key: 'couponCode',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '活动ID',
        dataIndex: 'eventName',
        width: 80,
        key: 'eventName',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '活动名称',
        dataIndex: 'writeOffQuantity',
        width: 80,
        key: 'writeOffQuantity',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '机构代码',
        dataIndex: 'shopId',
        width: 80,
        key: 'shopId',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '用户账号',
        dataIndex: 'shopMarketName',
        width: 80,
        key: 'shopMarketName',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '发货类型',
        dataIndex: 'shopAreaName',
        width: 80,
        key: 'shopAreaName',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '订单状态',
        dataIndex: 'soldToStoreNo',
        width: 80,
        key: 'soldToStoreNo',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '兑换商品',
        dataIndex: 'janRainId',
        width: 80,
        key: 'janRainId',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '商品数量',
        dataIndex: 'janRainId',
        width: 80,
        key: 'janRainId',
        // ellipsis: true,
        align: 'center',
      },
      {
        title: '合计积分',
        dataIndex: 'payStatus',
        width: 80,
        key: 'payStatus',
        ellipsis: true,
        align: 'center',
        render: (text) => {
          const findItem = payStatusData.find((item) => item.id === text);
          return <>{findItem.name}</>;
        },
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
                    <ConfigProvider locale={en_GB}>
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
                          onSelect={this.selectMarket}
                        >
                          {marketData.length > 0 &&
                            marketData.map((item, index) => (
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
                          // onChange={this.selectShopAreas}
                        >
                          {payStatusData &&
                            payStatusData.map((areaItem, index) => (
                              <Option key={index} value={areaItem.id}>
                                {areaItem.name}
                              </Option>
                            ))}
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
                          placeholder="请选择订单状态"
                          // onChange={this.selectShopAreas}
                        >
                          {shopAreasData &&
                            shopAreasData.map((areaItem, index) => (
                              <Option key={index} value={areaItem.id}>
                                {areaItem.name}
                              </Option>
                            ))}
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
                        onClick={() =>
                          this.setState(
                            {
                              pageNo: 0,
                              pageSize: 10,
                              shopAreasData: [],
                            },
                            () => {
                              resetFields();
                            }
                          )
                        }
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

export default createForm()(Report);
