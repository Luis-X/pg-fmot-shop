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
// import ReactECharts from 'echarts-for-react';

const { RangePicker } = DatePicker;

class TrackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loadingShow: false,
      eventID: '',
      queryData: null,
      tabIndex: 0, // 0: 人数 1: 次数

      pageNo: 0,
      pageSize: 10,
      totalNum: 10,
    };
  }

  async componentDidMount() {
    const self = this;
    self.requestListData();
  }

  /**
   * 列表数据请求
   */
  requestListData = () => {
    const self = this;
    const { pageNo, pageSize, queryData } = self.state;
    self.setState({ loadingShow: true });
    api.eventList({
      ...queryData,
      page: pageNo,
      size: pageSize,
    }).then((res) => {
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
    }).catch((err) => {
      self.setState({ loadingShow: false });
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  /**
   * 翻页OnChange
   */
  pageOnChange(pageNo, pageSize) {
    const self = this;
    self.setState({
      pageNo,
      pageSize,
      totalNum: self.state.totalNum,
    }, () => {
      self.requestListData();
    });
  }

   /**
   * 渲染列表
   */
   onFinish = () => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        self.setState({ queryData: values }, () => {
          self.requestListData();
        });
      }
    });
  };

  /**
   * 人数
   */
  clickSearchPeople = () => {
    const self = this;
    self.setState({
      tabIndex: 0,
      pageNo: 0,
      queryFlg: true,
    }, () => {
      // self.requestListData()
    });
  };

  /**
   * 次数
   */
  clickSearchTimes = () => {
    const self = this;
    self.setState({
      tabIndex: 1,
      pageNo: 0,
      queryFlg: true,
    }, () => {
      // self.requestListData()
    });
  };

  /**
   * 返回
   */
  clickBackBtn = () => {
    window.history.back();
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
      <>
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
              this.pageOnChange(pageNo - 1, pageSize)
            }
          />
        )}
      </>
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
      <>
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
              this.pageOnChange(pageNo - 1, pageSize)
            }
          />
        )}
      </>
    );
  };

  // 图表
  lineChartView = () => {
    // const options = {
    //   grid: { top: 8, right: 8, bottom: 24, left: 36 },
    //   xAxis: {
    //     type: 'category',
    //     // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //   },
    //   yAxis: {
    //     type: 'value',
    //   },
    //   series: [
    //     {
    //       data: [820, 932, 901, 934, 1290, 1330, 1320],
    //       type: 'line',
    //       smooth: true,
    //     },
    //     {
    //       data: [10, 932, 901, 934, 1290, 1330, 1320],
    //       type: 'line',
    //       smooth: true,
    //     },
    //   ],
    //   tooltip: {
    //     trigger: 'axis',
    //   },
    // };
  
    // return <ReactECharts option={options} />;
  };

  /**
   * 查询
   */
  clickSearchBtn = () => {
    const self = this;
    self.setState({ 
      pageNo: 0, 
      queryFlg: true 
    }, () => {
      // self.requestListData()
    });
  };

  render() {
    const {
      form: { resetFields, getFieldDecorator }
    } = this.props;
    return (
      <HomeLayout>
        <button
          className="current-btn"
          onClick={() => {
            this.clickBackBtn();
          }}
        >
          <LeftOutlined />
          <span>返回</span>
        </button>
        <p className="list-title">数据详情</p>
        <Divider style={{ margin: '3px 0' }} />
          <Tabs>
            <Tabs.TabPane tab="人数" key="item-1">
              <div className="common-list">          
                <div className="item2">
                  {this.peopleTableView()}
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="次数" key="item-2">
              <div className="common-list">          
                <div className="item2">
                  {this.timesTableView()}
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="图表" key="item-3">
              <div className="common-list">  
                <div className="item1">
                  <Form className="user_search" onFinish={() => { this.onFinish(); }}>
                    <div className="flex1">
                      <Row gutter={24}>
                        <Col span={8}>
                          <ConfigProvider locale={zhCN}>
                            <Form.Item>{getFieldDecorator('date',{})(
                              <RangePicker style={{ width: '100%' }} placeholder={['请选择查询时间段', '请选择查询时间段']} />
                            )}
                            </Form.Item>
                          </ConfigProvider>
                        </Col>
                        <Col span={8}>
                          <Form.Item>{getFieldDecorator('searchValue',{})(
                            <Input placeholder="请输入商品编号" maxLength={50} />
                          )}
                          </Form.Item>
                        </Col>
                      </Row>                        
                      <Row gutter={24}>
                        <div className="btn-width">
                          <button className="current-btn" onClick={() => { this.clickSearchBtn(); }}>
                            <SearchOutlined />
                            <span>查询</span>
                          </button>
                          <button className="current-btn bg-gray" onClick={() => {
                            this.setState({ 
                              pageNo: 0, 
                              pageSize: 10 
                            }, () => {
                              resetFields();
                              // this.requestListData()
                            });
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
                  {this.lineChartView()}
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>          
      </HomeLayout>
    );
  }
}

export default createForm()(TrackDetail);
