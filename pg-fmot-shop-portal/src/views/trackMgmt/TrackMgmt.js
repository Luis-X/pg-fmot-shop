import React, { Component } from 'react';
import { createForm } from 'rc-form';
import {
  Divider,
  Table,
  message,
  Pagination,
  Select,
  Form,
  Input,
  Row,
  Col,
  Tooltip,
  ConfigProvider,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import moment from 'moment';
import zhCN from 'antd/es/locale/zh_CN';
import Dict from '../../config/Dict';
import Util from '../../utils/util';
import RoutePath from '../../config/RoutePath';

const { Option } = Select;
const { RangePicker } = DatePicker;

class TrackMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgCodeList: [],
      activityTypeList: [],

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
    self.configActivityTypeList();
    self.requestListData();
    self.requestOrgCodeListData();
  }

  // 活动类型
  configActivityTypeList = () => {
    const self = this;
    const list = Dict.getOptionsList('activityType');
    self.setState({
      activityTypeList: list,
    })
  }

  // 机构代码
  requestOrgCodeListData = () => {
    const self = this;
    api.orgCodeList().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          const orgCodeDataList = respData.data || [];
          self.setState({
            orgCodeList: orgCodeDataList,
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
    api.trackList({
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

  // 查看明细
  clickItemDetail = (record) => {
    const { id } = record;
    Util.navigationToPath(RoutePath.TrackDetail, id);
  }

  // 查询
  clickSearchBtn = () => {
    const self = this;
    self.setState({ 
      pageNo: 0, 
    }, () => {
      
    });
  };

  render() {
    const { orgCodeList, activityTypeList } = this.state;
    const {
      form: { resetFields, getFieldDecorator }
    } = this.props;
    const columns = [
      {
        title: '活动ID',
        width: 100,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '活动名称',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 100,
        key: 'createDate',
        align: 'center',
        render: (text) => (
          <>{text ? moment(text).format('YYYY.MM.DD HH:mm:ss') : '--'}</>
        ),
      },      
      {
        title: '活动时间',
        dataIndex: 'activityDate',
        width: 100,
        key: 'activityDate',
        align: 'center',
        render: (text, record) => (
          <div className='activity-time-wrap'>
            {<span>{record.beginDate ? moment(record.beginDate).format('YYYY.MM.DD HH:mm:ss') : '--'}</span>}
            {/* <span style={{ fontWeight: 'bold' }}>-</span> */}
            {<span>{record.endDate ? moment(record.endDate).format('YYYY.MM.DD HH:mm:ss') : '--'}</span>}
          </div>
        ),
      },      
      {
        title: '机构代码',
        dataIndex: 'institutionCode',
        width: 50,
        key: 'institutionCode',
        align: 'center',
      },
      {
        title: '活动类型',
        dataIndex: 'activityType',
        width: 50,
        key: 'activityType',
        align: 'center',
         render: (text) => (
          <>{Dict.getValue('activityType', text, '')}</>
        ),
      },
      {
        title: '浏览人数',
        dataIndex: 'totalUser',
        width: 50,
        key: 'totalUser',
        align: 'center',
      },
      {
        title: '浏览次数',
        dataIndex: 'totalCount',
        width: 50,
        key: 'totalCount',
        align: 'center',
      },
      {
        title: '操作',
        width: 100,
        dataIndex: 'operation',
        key: 'operation',
        ellipsis: true,
        align: 'center',
        render: (text, record) => (
          <Tooltip title="查看明细">
            <span className="event-setting" onClick={() => { this.clickItemDetail(record); }}>查看明细</span>
          </Tooltip>
        ),
      },
    ];
    return (
      <HomeLayout>
        <p className="list-title">数据统计</p>
        <Divider style={{ margin: '3px 0' }} />
        <div className="common-list">
          <div className="item1">
            <Form className="user_search" onFinish={() => { this.onFinish(); }}>
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
                    <Form.Item>{getFieldDecorator('activityType',{})(
                      <Select placeholder="请选择活动类型" style={{ width: '100%' }} options={activityTypeList}>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
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
              columns={columns}
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
          </div>
        </div>
      </HomeLayout>
    );
  }
}

export default createForm()(TrackMgmt);
