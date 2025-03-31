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
  notification,
  Tooltip,
  ConfigProvider,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import moment from 'moment';
import { AddEventFun } from './AddEventFun';
import zhCN from 'antd/es/locale/zh_CN';
import Dict from '../../config/Dict';

const { Option } = Select;
const { RangePicker } = DatePicker;

class EventMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loadingShow: false,
      visible: false,
      eventID: '',
      queryData: null,

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
    },() => {
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
   * 查看详情
   */
  clickItemDetail = (record) => {
    const self = this;
    self.setState({
      visible: true,
      eventID: record.id,
    });
  }

   /**
   * 复制活动
   */
   clickItemCopy = (record) => {
    const id = record.id;
    console.log(id)
    const self = this;
    self.setState({ loadingShow: true });
    api.eventCopy({
      id: id,
    }).then((res) => {
      self.setState({ loadingShow: false });
      if (res) {
        if (0 === res.data.code) {
          notification['success']({
            message: '复制活动成功！'
          });
          self.requestListData();
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

  /**
   * 创建活动
   */
  clickCreateEvent = () => {
    const self = this;
    self.setState({
      visible: true,
      eventID: '',
    });
  }

  render() {
    const {
      form: { resetFields, getFieldDecorator }
    } = this.props;
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100,
        key: 'createTime',
        align: 'center',
        render: (text) => (
          <>{text ? moment(text).format('YYYY.MM.DD HH:mm:ss') : '--'}</>
        ),
      },
      {
        title: '活动ID',
        width: 50,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '活动时间',
        dataIndex: 'activityTime',
        width: 100,
        key: 'activityTime',
        align: 'center',
        render: (text, record) => (
          <div className='activity-time-wrap'>
            {<span>{record.startTime ? moment(record.startTime).format('YYYY.MM.DD HH:mm:ss') : '--'}</span>}
            {/* <span style={{ fontWeight: 'bold' }}>-</span> */}
            {<span>{record.endTime ? moment(record.endTime).format('YYYY.MM.DD HH:mm:ss') : '--'}</span>}
          </div>
        ),
      },
      {
        title: '活动名称',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '活动类型',
        dataIndex: 'type',
        width: 50,
        key: 'type',
        align: 'center',
        render: (text) => (
          <>{Dict.getValue('activityType', text, '')}</>
        ),
      },
      {
        title: '活动状态',
        dataIndex: 'status',
        width: 50,
        key: 'status',
        align: 'center',
        render: (text) => (
          <>{Dict.getValue('activityStatus', text, '')}</>
        ),
      },
      {
        title: '活动入口链接',
        dataIndex: 'link',
        width: 100,
        key: 'link',
        align: 'center',
      },
      {
        title: '机构代码',
        dataIndex: 'orgCode',
        width: 50,
        key: 'orgCode',
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
          <>
            <Tooltip title="查看详情">
              <span className="event-setting" onClick={() => { this.clickItemDetail(record); }}>查看详情</span>
            </Tooltip>
            <Tooltip title="复制活动">
              <span className="event-setting" onClick={() => { this.clickItemCopy(record); }}>复制活动</span>
            </Tooltip>
          </>
        ),
      },
    ];
    return (
      <HomeLayout>
        {
          this.state.visible ? (
            <AddEventFun
              eventId={this.state.eventID}
              show={this.state.visible}
              onHide={() => {
                this.setState({ visible: false });
              }}
              updateList={() => {
                resetFields();
                this.setState(
                  {
                    pageNo: 0,
                  },
                  () => this.requestListData()
                );
              }}
            />
          ) : null
        }
        <p className="list-title">活动管理</p>
        <Divider style={{ margin: '3px 0' }} />
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
                      <Input placeholder="请输入活动名称" maxLength={50} />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('searchID',{})(
                      <Input placeholder="请输入活动ID" maxLength={50} />
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('activityType',{})(
                      <Select placeholder="请选择活动类型" style={{ width: '100%' }}>
                        <Option value="1">内部活动</Option>
                        <Option value="2">外部活动</Option>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('status',{})(
                      <Select placeholder="请选择活动状态" style={{ width: '100%' }}>
                        <Option value="1">未开始</Option>
                        <Option value="2">进行中</Option>
                        <Option value="3">已结束</Option>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('activityCode',{})(
                      <Select placeholder="请选择机构代码" style={{ width: '100%' }}>
                        <Option value="1">100</Option>
                        <Option value="2">200</Option>
                        <Option value={null}>全部</Option>
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
            <Row gutter={5} style={{ marginBottom: '15px' }}>
              <button className="current-btn" onClick={() => { this.clickCreateEvent(); }}>                  
                <PlusSquareOutlined />
                <span>创建活动</span>
              </button>
            </Row>
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

export default createForm()(EventMgmt);
