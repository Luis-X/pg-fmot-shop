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
  Spin,
  Tooltip,
  notification,
  Button
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import {
  ProFormCheckbox,
  ProFormSelect
} from '@ant-design/pro-components';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import zhCN from 'antd/es/locale/zh_CN';
import { Line } from '@ant-design/charts';
import Dict from '../../config/Dict';
import Util from '../../utils/util';

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
          dataIndex: 'name',
          key: 'name',
          align: 'center',
        },
        {
          id: '1',
          title: '浏览人数',
          width: 50,
          dataIndex: 'productDetailPageCountByUser',
          key: 'productDetailPageCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_PAGE_BEGIN_TIME') ),
        },
        {
          id: '2',
          title: '平均页面停留时长',
          width: 50,
          dataIndex: 'productDetailPageAvgDuring',
          key: 'productDetailPageAvgDuring',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_PAGE_DURING') ),
        },
        {
          id: '3',
          title: '轮播图视频平均播放时长',
          width: 50,
          dataIndex: 'productCarouselVideoAvgDuring',
          key: 'productCarouselVideoAvgDuring',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_CAROUSEL_VIDEO_DURING') ),
        },
        {
          id: '4',
          title: '轮播图视频播放人数',
          width: 50,
          dataIndex: 'productCarouselVideoCountByUser',
          key: 'productCarouselVideoCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_CAROUSEL_VIDEO_BEGIN_TIME') ),
        },
        {
          id: '5',
          title: '轮播图视频完播人数',
          width: 50,
          dataIndex: 'productCarouselVideoFinishCountByUser',
          key: 'productCarouselVideoFinishCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_CAROUSEL_VIDEO_FINISH_TIME') ),
        },
        {
          id: '6',
          title: '商品详情视频平均播放时长',
          width: 50,
          dataIndex: 'productDetailVideoAvgDuring',
          key: 'productDetailVideoAvgDuring',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_VIDEO_DURING') ),
        },
        {
          id: '7',
          title: '商品详情视频播放人数',
          width: 50,
          dataIndex: 'productDetailVideoCountByUser',
          key: 'productDetailVideoCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_VIDEO_BEGIN_TIME') ),
        },
        {
          id: '8',
          title: '商品详情视频完播人数',
          width: 50,
          dataIndex: 'productDetailVideoFinishCountByUser',
          key: 'productDetailVideoFinishCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_VIDEO_FINISH_TIME') ),
        },
        {
          id: '9',
          title: '购买人数',
          width: 50,
          dataIndex: 'orderCheckPageCountByUser',
          key: 'orderCheckPageCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_CHECK_PAGE') ),
        },
        {
          id: '10',
          title: '添加购物车人数',
          width: 50,
          dataIndex: 'productAddCartCountByUser',
          key: 'productAddCartCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_ADD_CART') ),
        },
        {
          id: '11',
          title: '点击确认兑换人数',
          width: 50,
          dataIndex: 'orderConfirmExchangeCountByUser',
          key: 'orderConfirmExchangeCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_CONFIRM_EXCHANGE') ),
        },
        {
          id: '12',
          title: '兑换成功人数',
          width: 50,
          dataIndex: 'orderExchangeSuccessCountByUser',
          key: 'orderExchangeSuccessCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_EXCHANGE_SUCCESS') ),
        },
        {
          id: '13',
          title: '兑换失败人数',
          width: 50,
          dataIndex: 'orderExchangeFailedCountByUser',
          key: 'orderExchangeFailedCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_EXCHANGE_FAILED') ),
        },
        {
          id: '14',
          title: '取消人数',
          width: 50,
          dataIndex: 'orderCancelCountByUser',
          key: 'orderCancelCountByUser',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_CANCEL') ),
        },
      ],
      timesColumns: [
        {
          id: '0',
          title: '商品名称',
          width: 50,
          dataIndex: 'name',
          key: 'name',
          align: 'center',
        },
        {
          id: '1',
          title: '浏览次数',
          width: 50,
          dataIndex: 'productDetailPageCount',
          key: 'productDetailPageCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_PAGE_BEGIN_TIME') ),
        },
        {
          id: '2',
          title: '平均页面停留时长',
          width: 50,
          dataIndex: 'productDetailPageAvgDuring',
          key: 'productDetailPageAvgDuring',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_PAGE_DURING') ),
        },
        {
          id: '3',
          title: '轮播图视频平均播放时长',
          width: 50,
          dataIndex: 'productCarouselVideoAvgDuring',
          key: 'productCarouselVideoAvgDuring',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_CAROUSEL_VIDEO_DURING') ),
        },
        {
          id: '4',
          title: '轮播图视频播放次数',
          width: 50,
          dataIndex: 'productCarouselVideoCount',
          key: 'productCarouselVideoCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_CAROUSEL_VIDEO_BEGIN_TIME') ),
        },
        {
          id: '5',
          title: '轮播图视频完播次数',
          width: 50,
          dataIndex: 'productCarouselVideoFinishCount',
          key: 'productCarouselVideoFinishCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_CAROUSEL_VIDEO_FINISH_TIME') ),
        },
        {
          id: '6',
          title: '商品详情视频平均播放时长',
          width: 50,
          dataIndex: 'productDetailVideoAvgDuring',
          key: 'productDetailVideoAvgDuring',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_VIDEO_DURING') ),
        },
        {
          id: '7',
          title: '商品详情视频播放次数',
          width: 50,
          dataIndex: 'productDetailVideoCount',
          key: 'productDetailVideoCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_VIDEO_BEGIN_TIME') ),
        },
        {
          id: '8',
          title: '商品详情视频完播次数',
          width: 50,
          dataIndex: 'productDetailVideoFinishCount',
          key: 'productDetailVideoFinishCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_DETAIL_VIDEO_FINISH_TIME') ),
        },
        {
          id: '9',
          title: '购买次数',
          width: 50,
          dataIndex: 'orderCheckPageCount',
          key: 'orderCheckPageCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_CHECK_PAGE') ),
        },
        {
          id: '10',
          title: '添加购物车次数',
          width: 50,
          dataIndex: 'productAddCartCount',
          key: 'productAddCartCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'PRODUCT_ADD_CART') ),
        },
        {
          id: '11',
          title: '点击确认兑换次数',
          width: 50,
          dataIndex: 'orderConfirmExchangeCount',
          key: 'orderConfirmExchangeCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_CONFIRM_EXCHANGE') ),
        },
        {
          id: '12',
          title: '兑换成功次数',
          width: 50,
          dataIndex: 'orderExchangeSuccessCount',
          key: 'orderExchangeSuccessCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_EXCHANGE_SUCCESS') ),
        },
        {
          id: '13',
          title: '兑换失败次数',
          width: 50,
          dataIndex: 'orderExchangeFailedCount',
          key: 'orderExchangeFailedCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_EXCHANGE_FAILED') ),
        },
        {
          id: '14',
          title: '取消次数',
          width: 50,
          dataIndex: 'orderCancelCount',
          key: 'orderCancelCount',
          align: 'center',
          render: (text, record) => ( this.listTableItemView(text, record, 'ORDER_CANCEL') ),
        },
      ],
      goodsSearchList: [],

      data: [],
      loadingShow: false,
      activityId: '',
      queryData: {},
      tabIndex: 0, // 0: 人数 1: 次数 2: 图表

      pageNo: 0,
      pageSize: 10,
      totalNum: 10,
    };
  }

  componentDidMount() {
    const self = this;
    const match = this.props.match || {};
    const params = match.params || {};
    const id = params.id || '';
    self.setState({ 
      activityId: id,
     });
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
    const { pageNo, pageSize, activityId } = self.state;
    self.setState({ loadingShow: true });
    api.trackPeopleList({
      activityId: activityId,
      type: 'BY_USER',
      page: pageNo,
      size: pageSize,
    }).then((res) => {
      self.setState({ loadingShow: false });
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          self.setState({
            data: respData.data || [],
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
    const { pageNo, pageSize, activityId } = self.state;
    self.setState({ loadingShow: true });
    api.trackTimesList({
      activityId: activityId,
      type: 'ALL',
      page: pageNo,
      size: pageSize,
    }).then((res) => {
      self.setState({ loadingShow: false });
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          self.setState({
            data: respData.data || [],
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
    const { queryData, activityId } = self.state;
    self.setState({ loadingShow: true });
    // 时间处理
    if (queryData && queryData.date) {
      queryData.beginDate = Util.dateFormatter(queryData.date[0]);
      queryData.endDate = Util.dateFormatter(queryData.date[1]);
      delete queryData.date;
    }
    api.trackChart({
      activityId: activityId,
      ...queryData,
    }).then((res) => {
      self.setState({ loadingShow: false });
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          self.setState({
            data: respData.data || [],
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

  // 导出数据明细（Excel）
  clickListItem = (record, userActionType) => {
    const self = this;
    const productId = record.id || '';
    self.requestExportFile(productId, userActionType);
  }

  // 1.获取导出文件，任务id
  requestExportFile = (productId, userActionType) => {
    console.log('导出文件')
    const self = this;
    const { activityId } = self.state;
    self.setState({ loadingShow: true });
    api.trackExport({
      userActionType: userActionType,
      activityId: activityId,
      productId: productId
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

  listTableItemView = (text, record, userActionType) => {
    return (
      <Tooltip title="数据明细">
        <span className="event-setting" onClick={() => { this.clickListItem(record, userActionType); }}>{text}</span>
      </Tooltip>
    )    
  }

  // 图表
  lineChartView = () => {
    const dataList = this.state.data;
    let data = [];
    let list = [];
    let keyList = [
      'point_3',
      'point_6',
      'point_9',
      'point_12',
      'point_15',
      'point_18',
      'point_21',
      'point_24',
      'point_27',
      'point_30',
      'point_33',
      'point_36',
      'point_39',
      'point_42',
      'point_45',
      'point_48',
      'point_51',
      'point_54',
      'point_57',
      'point_60',
    ];
    dataList.forEach((item, index) => {
      const chartMap = item || {};
      let type = '';
      if (item.user_action_type === 2) {
        type = '轮播图视频观看人数';
      } else if (item.user_action_type === 3) {
        type = '商品详情视频观看人数';
      }
      keyList.forEach((key, jndex) => {
        const pointIem = {};
        const secondValue = (jndex + 1) * 3;
        pointIem.type = type;
        pointIem.second = secondValue.toString();
        pointIem.value = chartMap[key];
        list.push(pointIem);
      })
    })
    data = list;
    console.log(data)

    const config = {
      data,
      height: 500,
      xField: 'second',
      yField: 'value',
      xAxis: {
        title: {
          position: 'end',
          text: '观看时长(S)',
          style: {
            fontSize: 12,
          },
        },
      },
      yAxis: {
        title: {
          position: 'end',
          text: '观看人数(%)',
          style: {
            fontSize: 12,
          },
        },
        min: 0,
        max: 100,
        tickInterval: 10,
        tickCount: 10,
      },
      legend: {
        layout: 'horizontal',
        position: 'bottom',
      },
      seriesField: 'type',
      color: ['#1979C9', '#FAA219'],
      smooth: true,
      // point: {
      //   shapeField: 'square',
      //   sizeField: 1,
      // },
      interaction: {
        tooltip: {
          marker: false,
        },
      },
      style: {
        lineWidth: 1,
      },
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
                  <Form.Item>{getFieldDecorator('productId',{})(
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
        const respData = res.data || {};
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
        <div className='list-title-wrap'>
          <Button className='list-title' type="text" icon={<ArrowLeftOutlined />} onClick={() => this.clickBackBtn()}>返回</Button>
        </div>        
        <Divider style={{ margin: '3px 0' }} />
        <Tabs onChange={this.tabOnChange} items={tabItems}></Tabs>
      </HomeLayout>
    );
  }
}

export default createForm()(TrackDetail);
