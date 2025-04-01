import React, { Component } from 'react';
import { createForm } from 'rc-form';
import {
  Divider,
  Table,
  message,
  Pagination,
  Form,  
  Row,
  Col,
  ConfigProvider,
  DatePicker,
  Tabs,
  Input,
  Spin
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import zhCN from 'antd/es/locale/zh_CN';
import { Line } from '@ant-design/charts';

const { RangePicker } = DatePicker;

class TrackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loadingShow: false,
      eventID: '',
      queryData: null,
      tabIndex: 0, // 0: 人数 1: 次数 2: 图表

      pageNo: 0,
      pageSize: 10,
      totalNum: 10,
    };
  }

  async componentDidMount() {
    const self = this;
    self.tabOnChange('tab-1');
  }

  tabOnChange = (value) => {
    const self = this;
    let tabIndex = 0;
    if (value === 'tab-1') {
      tabIndex = 0;
    } else if (value === 'tab-2') {
      tabIndex = 1;
    } else if (value === 'tab-3') {
      tabIndex = 2;
    }

    self.setState(
      {
        tabIndex,
        pageNo: 0,
        data: [],
        totalNum: 10,
        queryData: null,
      },
      () => {
        console.log(self.state.tabIndex);
        if (tabIndex === 0) {
          self.requestPeopleListData();
        } else if (tabIndex === 1) {
          self.requestTimesListData();
        } else if (tabIndex === 2) {
          self.requestChartData();
        } else {
          console.log('error tab');
        }
      }
    );
  };

  /**
   * 返回
   */
  clickBackBtn = () => {
    window.history.back();
  };

  /**
   * 渲染列表
   */
  onFinish = () => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        self.setState(
          {
            queryData: values,
          },
          () => {
            self.clickSearchChart();
          }
        );
      }
    });
  };

  /**
   * 人数
   */
  requestPeopleListData = () => {
    const self = this;
    const { pageNo, pageSize, queryData } = self.state;
    self.setState({ loadingShow: true });
    api
      .trackPeopleList({
        ...queryData,
        page: pageNo,
        size: pageSize,
      })
      .then((res) => {
        self.setState({ loadingShow: false });
        if (res) {
          const respData = res.data;
          if (0 === respData.code) {
            self.setState({
              data: respData.data.content,
              totalNum: respData.data.totalElements,
            });
          } else {
            MyAlert({ errorMsg: respData.message });
          }
        }
      })
      .catch((err) => {
        self.setState({ loadingShow: false });
        message.error(err ? err : '网络请求失败, 请重试!', 2);
      });
  };

  peoplePageOnChange(pageNo, pageSize) {
    const self = this;
    self.setState(
      {
        pageNo,
        pageSize,
        totalNum: self.state.totalNum,
      },
      () => {
        self.requestPeopleListData();
      }
    );
  }

  /**
   * 次数
   */
  requestTimesListData = () => {
    const self = this;
    const { pageNo, pageSize, queryData } = self.state;
    self.setState({ loadingShow: true });
    api
      .trackTimesList({
        ...queryData,
        page: pageNo,
        size: pageSize,
      })
      .then((res) => {
        self.setState({ loadingShow: false });
        if (res) {
          const respData = res.data;
          if (0 === respData.code) {
            self.setState({
              data: respData.data.content,
              totalNum: respData.data.totalElements,
            });
          } else {
            MyAlert({ errorMsg: respData.message });
          }
        }
      })
      .catch((err) => {
        self.setState({ loadingShow: false });
        message.error(err ? err : '网络请求失败, 请重试!', 2);
      });
  };

  timesPageOnChange(pageNo, pageSize) {
    const self = this;
    self.setState(
      {
        pageNo,
        pageSize,
        totalNum: self.state.totalNum,
      },
      () => {
        self.requestTimesListData();
      }
    );
  }

  /**
   * 图表
   */
  clickSearchChart = () => {
    const self = this;
    self.setState(
      {
        tabIndex: 2,
        data: [],
      },
      () => {
        self.requestChartData();
      }
    );
  };

  requestChartData = () => {
    const self = this;
    const { queryData } = self.state;

    self.setState({ loadingShow: true });
    api
      .trackChart({
        ...queryData,
      })
      .then((res) => {
        self.setState({ loadingShow: false });
        if (res) {
          const respData = res.data;
          if (0 === respData.code) {
            self.setState({
              data: respData.data.content,
            });
          } else {
            MyAlert({ errorMsg: respData.message });
          }
        }
      })
      .catch((err) => {
        self.setState({ loadingShow: false });
        message.error(err ? err : '网络请求失败, 请重试!', 2);
      });
  };

  // 人数列表
  peopleTableView = () => {
    const peopleColumns = [
      {
        title: '商品名称',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '浏览人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '平均页面停留时长',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '轮播图视频平均播放时长',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '轮播图视频播放人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '轮播图视频完播人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品详情视频平均播放时长',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品详情视频播放人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品详情视频完播人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '购买人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '添加购物车人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '点击确认兑换人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '兑换成功人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '兑换失败人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '取消人数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
    ];
    return (
      <div className="common-list">
        <div className="item2">
          <Table
            size="middle"
            loading={this.state.loadingShow}
            pagination={false}
            rowKey="id"
            columns={peopleColumns}
            dataSource={this.state.data}
            rowClassName={(record, idx) => {
              if (idx % 2 === 1) return 'bg-row';
            }}
          />
          {this.state.data.length > 0 && (
            <Pagination
              style={{ paddingTop: '25px' }}
              // scroll={{ x: 1366}}
              pageSize={this.state.pageSize}
              current={this.state.pageNo + 1}
              total={this.state.totalNum}
              onChange={(pageNo, pageSize) =>
                this.peoplePageOnChange(pageNo - 1, pageSize)
              }
            />
          )}
        </div>
      </div>
    );
  };

  // 次数数列表
  timesTableView = () => {
    const timesColumns = [
      {
        title: '商品名称',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '浏览次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '平均页面停留时长',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '轮播图视频平均播放时长',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '轮播图视频播放次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '轮播图视频完播次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品详情视频平均播放时长',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品详情视频播放次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品详情视频完播次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '购买次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '添加购物车次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '点击确认兑换次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '兑换成功次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '兑换失败次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '取消次数',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
    ];
    return (
      <div className="common-list">
        <div className="item2">
          <Table
            size="middle"
            loading={this.state.loadingShow}
            pagination={false}
            rowKey="id"
            columns={timesColumns}
            dataSource={this.state.data}
            rowClassName={(record, idx) => {
              if (idx % 2 === 1) return 'bg-row';
            }}
          />
          {this.state.data.length > 0 && (
            <Pagination
              style={{ paddingTop: '25px' }}
              // scroll={{ x: 1366}}
              pageSize={this.state.pageSize}
              current={this.state.pageNo + 1}
              total={this.state.totalNum}
              onChange={(pageNo, pageSize) =>
                this.timesPageOnChange(pageNo - 1, pageSize)
              }
            />
          )}
        </div>
      </div>
    );
  };

  // 图表
  lineChartView = () => {
    const data = this.state.data;
    const config = {
      data,
      height: 500,
      xField: 'duration',
      xAxis: {
        title: {
          position: 'end',
          // autoRotate: false,
          offset: 50,
          text: '观看时长(S)',
          style: {
            fontSize: 16,
          },
        },
      },
      yField: 'people',
      yAxis: {
        title: {
          position: 'end',
          // autoRotate: false,
          offset: 50,
          text: '观看人数(%)',
          style: {
            fontSize: 16,
          },
        },
        min: 0,
        max: 100,
        tickInterval: 10,
      },
      // smooth: true,
      seriesField: 'type',
      color: ['#1979C9', '#FAA219'],
    };

    const {
      form: { resetFields, getFieldDecorator },
    } = this.props;

    return (
      <div className="common-list">
        <div className="item1">
          <Form className="user_search" onFinish={() => {
            this.onFinish();
          }}>
          <div className="flex1">
            <Row gutter={24}>
              <Col span={8}>
                <ConfigProvider locale={zhCN}>
                  <Form.Item>
                    {
                      getFieldDecorator(
                        'date',
                        {}
                      )(
                        <RangePicker style={{ width: '100%' }} placeholder={['请选择查询时间段', '请选择查询时间段']} />
                      )
                    }
                  </Form.Item>
                </ConfigProvider>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {
                    getFieldDecorator(
                      'searchValue',
                      {}
                    )(
                      <Input placeholder="请输入商品编号" maxLength={50} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <div className="btn-width">
                <button className="current-btn" onClick={() => {
                  this.clickSearchChart();
                }}>
                  <SearchOutlined />
                  <span>查询</span>
                </button>
                <button className="current-btn bg-gray" onClick={() => {
                  resetFields();
                  this.clickSearchChart();
                }}>
                  <ReloadOutlined />
                  <span>重置</span>
                </button>
              </div>
            </Row>
          </div>
        </Form>
      </div>
      <div className="item2">
        <p className="track-chart-title">商品视频观看时长统计</p>
        {
          this.state.loadingShow ? (
            <div className="track-chart-loading">
              <Spin />
            </div>
          ) : (
            <Line {...config} />
          )
        }
      </div>
    </div>
  );
};

  render() {    
    const tabItems = [
      {
        key: 'tab-1',
        label: '人数',
        children: (
          this.peopleTableView()
        )
      },
      {
        key: 'tab-2',
        label: '次数',
        children: (
          this.timesTableView()
        )
      },
      {
        key: 'tab-3',
        label: '图表',
        children: (
          this.lineChartView()
        )
      },
    ];
    return (
      <HomeLayout>
        <button className="current-btn" onClick={() => {
          this.clickBackBtn();
        }}>
          <LeftOutlined />
          <span>返回</span>
        </button>
        <p className="list-title">数据详情</p>
        <Divider style={{ margin: '3px 0' }} />
        <Tabs onChange={this.tabOnChange} items={tabItems}></Tabs>
      </HomeLayout>
    );
  }
}

export default createForm()(TrackDetail);
