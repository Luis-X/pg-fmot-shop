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
  Spin
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import {
  ProFormCheckbox,
  ProFormSelect
} from '@ant-design/pro-components';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import moment from 'moment';
import zhCN from 'antd/es/locale/zh_CN';
import { Line } from '@ant-design/charts';
import Dict from '../../config/Dict';

const { RangePicker } = DatePicker;

class TrackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackTypeList: [],
      peopleColumns: [
        {
          id: '0',
          title: '商品名称',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '1',
          title: '浏览人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '2',
          title: '平均页面停留时长',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '3',
          title: '轮播图视频平均播放时长',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '4',
          title: '轮播图视频播放人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '5',
          title: '轮播图视频完播人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '6',
          title: '商品详情视频平均播放时长',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '7',
          title: '商品详情视频播放人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '8',
          title: '商品详情视频完播人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '9',
          title: '购买人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '10',
          title: '添加购物车人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '11',
          title: '点击确认兑换人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '12',
          title: '兑换成功人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '13',
          title: '兑换失败人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '14',
          title: '取消人数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
      ],
      timesColumns: [
        {
          id: '0',
          title: '商品名称',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '1',
          title: '浏览次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '2',
          title: '平均页面停留时长',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '3',
          title: '轮播图视频平均播放时长',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '4',
          title: '轮播图视频播放次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '5',
          title: '轮播图视频完播次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '6',
          title: '商品详情视频平均播放时长',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '7',
          title: '商品详情视频播放次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '8',
          title: '商品详情视频完播次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '9',
          title: '购买次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '10',
          title: '添加购物车次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '11',
          title: '点击确认兑换次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '12',
          title: '兑换成功次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '13',
          title: '兑换失败次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          id: '14',
          title: '取消次数',
          width: 50,
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
      ],
      goodsSearchList: [],

      data: [],
      loadingShow: false,
      eventID: '',
      queryData: {},
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

  // 返回
  clickBackBtn = () => {
    window.history.back();
  };

  // 商品类型
  configTrackTypeList = (type) => {
    const self = this;
    const list = Dict.getOptionsList(type);
    self.setState({
      trackTypeList: list,
    })
  }

  // tab切换 1: 人数 2: 次数 3: 图表
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

    self.props.form.resetFields();
    self.setState({
      tabIndex,
      pageNo: 0,
      data: [],
      totalNum: 10,
      queryData: {},
    },() => {
      self.requestDataHandler();
    });
  };

  requestDataHandler = () => {
    const self = this;
    const { tabIndex } = self.state;
    if (tabIndex === 0) {
      self.configTrackTypeList('trackPeopleType');
      self.requestPeopleListData();
    } else if (tabIndex === 1) {
      self.configTrackTypeList('trackTimesType');
      self.requestTimesListData();
    } else if (tabIndex === 2) {
      self.requestChartData();
    } else {
      console.log('error tab');
    }
  }

  // 人数
  requestPeopleListData = () => {
    console.log('人数')
    const self = this;
    const { pageNo, pageSize, queryData } = self.state;
    self.setState({ loadingShow: true });
    api.trackPeopleList({
      ...queryData,
      page: pageNo,
      size: pageSize,
    }).then((res) => {
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
    }).catch((err) => {
      self.setState({ loadingShow: false });
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  // 次数
  requestTimesListData = () => {
    console.log('次数')
    const self = this;
    const { pageNo, pageSize, queryData } = self.state;
    self.setState({ loadingShow: true });
    api.trackTimesList({
      ...queryData,
      page: pageNo,
      size: pageSize,
    }).then((res) => {
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
    }).catch((err) => {
      self.setState({ loadingShow: false });
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  // 图表
  requestChartData = () => {
    console.log('图表')
    const self = this;
    const { queryData } = self.state;
    self.setState({ loadingShow: true });
    // 时间处理
    if (queryData && queryData.date) {
      queryData.beginDate = moment(new Date(queryData.date[0])).format('YYYY-MM-DD HH:mm:ss');
      queryData.endDate = moment(new Date(queryData.date[1])).format('YYYY-MM-DD HH:mm:ss');
      delete queryData.date;
    }
    api.trackChart({
      ...queryData,
    }).then((res) => {
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
    }).catch((err) => {
      self.setState({ loadingShow: false });
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  // 渲染列表
  onFinishHandler = () => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        self.setState({
          queryData: values,
        },() => {
          self.requestDataHandler();
        });
      }
    });
  };

  // 翻页 OnChange
  pageOnChangeHandler(pageNo, pageSize) {
    const self = this;
    self.setState({
      pageNo,
      pageSize,
      totalNum: self.state.totalNum,
    },() => {
      self.requestDataHandler();
    });
  }

  // 查询
  clickSearchBtn = () => {
    const self = this;
    self.setState({
      pageNo: 0,
    }, () => {
      self.requestDataHandler();
    });
  };

  // 过滤
  filterColumns = (columnList) => {
    const self = this;
    const { queryData } = self.state;

    // 处理显示项
    let trackTypeList = [];
    if (queryData && queryData.trackTypeList && queryData.trackTypeList.length > 0) {
      trackTypeList = queryData.trackTypeList;
    }

    if (trackTypeList.length <= 0) {
      return columnList;
    }

    // 筛选项
    let newColumnList = [];
    columnList.forEach((item, index) => {
      if (item.id === '0') {
        newColumnList.push(item);       
      } else {
        trackTypeList.forEach((id, jndex) => {
          if (id === item.id) {
            newColumnList.push(item);
          }
        })    
      }       
    })
    
    return newColumnList;
  }

  // 列表
  listTableView = (columns) => {
    const { trackTypeList } = this.state;
    const {
      form: { resetFields, getFieldDecorator }
    } = this.props;

    return (
      <div className="common-list">
        <div className="item1">
          <Form className="user_search" onFinish={() => { this.onFinishHandler(); }}>
            <div className="flex1">
              <Row gutter={24}>
                <Form.Item>{getFieldDecorator('trackTypeList',{})(
                  <ProFormCheckbox.Group options={trackTypeList} />
                )}
                </Form.Item>                
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
          <Table
            size="middle"
            loading={this.state.loadingShow}
            pagination={false}
            rowKey="id"
            columns={
              this.filterColumns(columns)
            }
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
                this.pageOnChangeHandler(pageNo - 1, pageSize)
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
        // min: 0,
        // max: 60,
        // tickInterval: 3,
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
          <Form className="user_search" onFinish={() => { this.onFinishHandler(); }}>
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
                <Form.Item>{getFieldDecorator('goodsId',{})(
                  <ProFormSelect
                    showSearch
                    showArrow={false}
                    allowClear
                    labelInValue
                    debounceTime={500}
                    label="活动商品"
                    request={this.requestGoodsSearchListData}
                    rules={[{ required: true, message: '请输入商品编号' }]}
                    placeholder="请输入商品编号"
                  />
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

  // 商品搜索列表
  requestGoodsSearchListData = async (searchText) => {
    const self = this
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
            list = self.goodsSelectOptions(dataList);
            self.setState({
              goodsSearchList: dataList,
            })
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
  goodsSelectOptions = (list) => {
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

  render() {    
    const { peopleColumns, timesColumns } = this.state;
    const tabItems = [
      {
        key: 'tab-1',
        label: '人数',
        children: (
          this.listTableView(peopleColumns)
        )
      },
      {
        key: 'tab-2',
        label: '次数',
        children: (
          this.listTableView(timesColumns)
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
        <Divider style={{ margin: '3px 0' }} />
        <Tabs onChange={this.tabOnChange} items={tabItems}></Tabs>
      </HomeLayout>
    );
  }
}

export default createForm()(TrackDetail);
