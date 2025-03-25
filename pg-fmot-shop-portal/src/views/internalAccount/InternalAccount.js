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
  notification,
  ConfigProvider,
  DatePicker,
} from 'antd';
import {
  ImportOutlined,
  SearchOutlined,
  ReloadOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert, { ConfirmAlert } from '../../components/MyAlert';
import { ImportStore } from './ImportStore';
import en_GB from 'antd/es/locale/en_GB';
import Dict from '../../config/Dict';

const { Option } = Select;
const { RangePicker } = DatePicker;

class InternalAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loadingShow: false,
      importVisible: false,
      queryData: null,

      pageNo: 0,
      pageSize: 10,
      totalNum: 10,
    };
  }

  componentDidMount() {
    const self = this;
    self.requestListData();
  }

  /**
   * 列表数据请求
   */
  requestListData = () => {
    const self = this;
    const { pageNo, pageSize, queryData } = this.state;
    self.setState({ loadingShow: true });

    api.storeList({
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
   * 导入内部账号
   */
  clickImportAccount = () => {
    const self = this;
    self.setState({ importVisible: true });
  }

  /**
   * 下载导入内部账号模版
   */
  clickImportAccountTemplate = () => {
    const self = this;
    notification['success']({
      message: '下载成功！',
      description: '',
    });
  }

  /**
   * 积分充值
   */
  clickImportPoints = () => {
    const self = this;
    self.setState({ importVisible: true });
  }

  /**
   * 下载积分充值模版
   */
  clickImportPointsTemplate = () => {
    const self = this;
    notification['success']({
      message: '下载成功！',
      description: '',
    });
  }

  /**
   * 查询
   */
  clickSearchBtn = () => {
    const self = this;
    self.setState({ 
      pageNo: 0, 
    }, () => {
      // self.requestListData()
    });
  };

  /**
   * 正常
   */
  clickAccountEnable = (record) => {
    this.requestAccountOperation(record.status, record.id);
  }

  /**
   * 锁定
   */
  clickAccountDisable = (record) => {
    this.requestAccountOperation(record.status, record.id);
  }

  /**
   * 账号操作
   */
  requestAccountOperation = (status, id) => {
    const self = this;
    ConfirmAlert({
      title: '温馨提示',
      errorMsg: `您确定修改登录权限为 ${'NORMAL' === status ? '锁定' : '正常'} 吗?`,
      callbackOK: () => {
        // api.storeChangeStatus({
        //   id: id,
        //   status: 'NORMAL' === status ? 'DISABLE' : 'NORMAL',
        // }).then((res) => {
        //   if (res) {
        //     if (0 === res.data.code) {
        //       self.requestListData();
        //     } else {
        //       MyAlert({ errorMsg: res.data.message });
        //     }
        //   }
        // });
      },
      callbackCancel: () => {},
    });
  };

  render() {
    const {
      form: { resetFields, getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'id',
        width: 80,
        key: 'id',
        align: 'center',
      },
      {
        title: '绑定时间',
        dataIndex: 'id',
        width: 80,
        key: 'id',
        align: 'center',
      },
      {
        title: '邮箱账号',
        dataIndex: 'id',
        width: 80,
        key: 'id',
        align: 'center',
      },
      {
        title: 'Openid',
        dataIndex: 'id',
        width: 80,
        key: 'id',
        align: 'center',
      },
      {
        title: '可用积分',
        dataIndex: 'id',
        width: 80,
        key: 'id',
        align: 'center',
      },
      {
        title: '绑定状态',
        dataIndex: 'status',
        width: 80,
        key: 'status',
        ellipsis: true,
        align: 'center',
        render: (text) => (
          <>
            <Tag color={'DISABLE' === text ? 'red' : 'green'}>
              {Dict.getValue('internalAccountStatus', text, '')}
            </Tag>
          </>
        ),
      },
      {
        title: '登录权限',
        width: 100,
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
        align: 'center',
        render: (text, record) => (
          <div>
            {
              'NORMAL' === text ? (
                <div onClick={() => { this.clickAccountEnable(record); }}>
                  <StopOutlined className="cursor-p" style={{ color: 'red' }} title="Deactivate" />
                  <span>正常</span>
                </div>                
              ) : (
                <div onClick={() => { this.clickAccountDisable(record); }} >
                  <CheckCircleOutlined className="cursor-p" style={{ color: '#1890ff' }} title="Activate" />
                  <span>锁定</span>
                </div>
              )
            }
          </div>
        ),
      },
    ];

    return (
      <HomeLayout>

        <ImportStore
          show={this.state.importVisible}
          onHide={() => {
            this.setState({ importVisible: false });
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

        <p className="list-title">内部账号管理</p>
        <Divider style={{ margin: '3px 0' }} />
        <div className="common-list">
          <div className="item1">
            <Form className="user_search" onFinish={() => { this.onFinish(); }}>
              <div className="flex1">
                <Row gutter={24}>
                  <Col span={8}>
                    <ConfigProvider locale={en_GB}>
                      <Form.Item>{getFieldDecorator('date',{})(
                        <RangePicker style={{ width: '100%' }} placeholder={['请选择查询时间段', '请选择查询时间段']} />
                      )}
                      </Form.Item>
                    </ConfigProvider>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('searchValue',{})(
                      <Input placeholder="请输入邮箱账号" />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('shopMarketId',{})(
                      <Select placeholder="请选择绑定状态" style={{ width: '100%' }}>
                        <Option value="BIND">已绑定</Option>
                        <Option value="UNBIND">未绑定</Option>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('shopAreaId',{})(
                      <Select placeholder="请选择登录权限" style={{ width: '100%' }}>
                        <Option value="ENABLE">正常</Option>
                        <Option value="DISABLE">锁定</Option>
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
              <button className="current-btn" onClick={() => { this.clickImportAccount(); }}>
                <ImportOutlined />
                <span>导入内部账号</span>
              </button>
              <button className="current-btn" onClick={() => { this.clickImportAccountTemplate(); }}>
                <span>下载导入账号模版</span>
              </button>
              <button className="current-btn" onClick={() => { this.clickImportPoints(); }}>
                <ImportOutlined />
                <span>积分充值</span>
              </button>
              <button className="current-btn" onClick={() => { this.clickImportPointsTemplate(); }}>
                <span>下载积分充值模版</span>
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

export default createForm()(InternalAccount);
