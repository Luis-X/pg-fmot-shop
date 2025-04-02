import React, { Component } from 'react';
import { createForm } from 'rc-form';
import {
  Table,
  message,
  Pagination,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Tag,
  ConfigProvider,
  DatePicker,
  Tooltip
} from 'antd';
import {
  ImportOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert, { ConfirmAlert } from '../../components/MyAlert';
import moment from 'moment';
import { ImportDataPicker } from '../../components/ImportDataPicker';
import zhCN from 'antd/es/locale/zh_CN';
import Dict from '../../config/Dict';
import Util from '../../utils/util';

// const { Option } = Select;
const { RangePicker } = DatePicker;

class InternalAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bindStatusList: [],
      loginStatusList: [],

      data: [],
      loadingShow: false,
      queryData: null,
      pageNo: 0,
      pageSize: 10,
      totalNum: 10,

      isShow: false,
      importType: 0, // 101: 导入账号 102: 积分充值
    };
  }

  componentDidMount() {
    const self = this;
    self.requestListData();
    self.configBindStatusList();
    self.configLoginStatusList();
  }

  // 绑定状态
  configBindStatusList = () => {
    const self = this;
    const list = Dict.getOptionsList('accountBindStatus');
    self.setState({
      bindStatusList: list,
    })
  }

  // 登录权限
  configLoginStatusList = () => {
    const self = this;
    const list = Dict.getOptionsList('accountLoginStatus');
    self.setState({
      loginStatusList: list,
    })
  }

  // 列表数据
  requestListData = () => {
    const self = this;
    const { pageNo, pageSize, queryData } = this.state;
    self.setState({ loadingShow: true });
    // 时间处理
    if (queryData && queryData.date) {
      queryData.beginDate = moment(new Date(queryData.date[0])).format('YYYY-MM-DD HH:mm:ss');
      queryData.endDate = moment(new Date(queryData.date[1])).format('YYYY-MM-DD HH:mm:ss');
      delete queryData.date;
    }
    api.internalAccountList({
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

  // 导入内部账号
  clickImportAccount = () => {
    const self = this;
    self.setState({ 
      isShow: true,
      importType: 101
    });
  }

  // 内部账号模版
  clickImportAccountTemplate = () => {
    Util.downloadTemplateFile(101);
  }

  // 积分充值
  clickImportPoints = () => {
    const self = this;
    self.setState({ 
      isShow: true,
      importType: 102
    });
  }

  // 积分充值模版
  clickImportPointsTemplate = () => {
    Util.downloadTemplateFile(102);
  }

  // 查询
  clickSearchBtn = () => {
    const self = this;
    self.setState({ 
      pageNo: 0, 
    }, () => {
      
    });
  };

  // 正常 -> 锁定
  clickAccountEnable = (record) => {
    this.requestAccountOperation('锁定', {
      id: record.id,
      status: 2,
    });
  }

  // 锁定 -> 正常
  clickAccountDisable = (record) => {
    this.requestAccountOperation('正常', {
      id: record.id,
      status: 1,
    });
  }

  // 账号操作
  requestAccountOperation = (statusText, params) => {
    const self = this;
    ConfirmAlert({
      title: '温馨提示',
      errorMsg: `您确定修改登录权限为 ${statusText} 吗?`,
      callbackOK: () => {
        api.internalAccountChangeStatus(
          params
        ).then((res) => {
          if (res) {
            const respData = res.data;
            if (0 === respData.code) {
              self.requestListData();
            } else {
              MyAlert({ errorMsg: respData.message });
            }
          }
        });
      },
      callbackCancel: () => {},
    });
  };

  render() {
    const { bindStatusList, loginStatusList } = this.state;
    const {
      form: { resetFields, getFieldDecorator },
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
        title: '绑定时间',
        dataIndex: 'bindTime',
        width: 100,
        key: 'bindTime',
        align: 'center',
        render: (text) => (
          <>{text ? moment(text).format('YYYY.MM.DD HH:mm:ss') : '--'}</>
        ),
      },
      {
        title: '邮箱账号',
        dataIndex: 'email',
        width: 100,
        key: 'email',
        align: 'center',
      },
      {
        title: 'Openid',
        dataIndex: 'openid',
        width: 100,
        key: 'openid',
        align: 'center',
      },
      {
        title: '可用积分',
        dataIndex: 'points',
        width: 100,
        key: 'points',
        align: 'center',
      },
      {
        title: '绑定状态',
        dataIndex: 'bindStatus',
        width: 100,
        key: 'bindStatus',
        ellipsis: true,
        align: 'center',
        render: (text) => (
          <>
            {
              text === '1' ? (
                <Tag color='green'>
                  <span>已绑定</span>
                </Tag>              
              ) : (
                <Tag color='red'>
                  <span>未绑定</span>
                </Tag>
              )
            }
          </>
        ),
      },
      {
        title: '登录权限',
        width: 100,
        dataIndex: 'loginStatus',
        key: 'loginStatus',
        ellipsis: true,
        align: 'center',
        render: (text, record) => (
          <>                        
            {
              text === '1' ? (     
                <Tooltip title="正常">
                  <span className="event-setting" onClick={() => { this.clickAccountEnable(record); }}>正常</span>
                </Tooltip>          
              ) : (
                <Tooltip title="锁定">
                  <span className="event-setting" onClick={() => { this.clickAccountDisable(record); }}>锁定</span>
                </Tooltip>
              )
            }
          </>
        ),
      },
    ];

    return (
      <HomeLayout>

        <ImportDataPicker
          show={this.state.isShow}
          type={this.state.importType}
          onHide={() => {
            this.setState({ 
              isShow: false,
              importType: 0
             });
          }}
          updateList={() => {
            resetFields();
            this.setState({
              pageNo: 0
            },() => {
              this.requestListData()
            });
          }}
        />

        <p className="list-title">内部账号管理</p>
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
                    <Form.Item>{getFieldDecorator('email',{})(
                      <Input placeholder="请输入邮箱账号" />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('bindStatus',{})(
                      <Select placeholder="请选择绑定状态" style={{ width: '100%' }} options={bindStatusList}>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('loginStatus',{})(
                      <Select placeholder="请选择登录权限" style={{ width: '100%' }} options={loginStatusList}>
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
                        pageSize: 10,
                      },() => {
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
            <Row gutter={5} style={{ marginBottom: '15px' }}>
              <div>
                <button className="current-btn" onClick={() => { this.clickImportAccount(); }}>
                  <ImportOutlined />
                  <span>导入内部账号</span>
                </button>
                <span className="event-setting" style={{ textDecoration: 'underline', marginLeft: '5px' }}  onClick={() => { this.clickImportAccountTemplate(); }}>下载导入账号模版</span>
              </div>
              <div>
                <button className="current-btn" onClick={() => { this.clickImportPoints(); }}>
                  <ImportOutlined />
                  <span>积分充值</span>
                </button>
                <span className="event-setting" style={{ textDecoration: 'underline', marginLeft: '5px' }}  onClick={() => { this.clickImportPointsTemplate(); }}>下载积分充值模版</span>
              </div>              
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

export default createForm()(InternalAccount);
