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
  Tag,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';
import { AddGoodsFun } from './AddGoodsFun';
import Dict from '../../config/Dict';

const { Option } = Select;

class GoodsMgmt extends Component {
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

    const res = {
      data: {
        code: 0,
        data: {
          content: [
            {
              id: '8888888',
              name: '商品1',
              price: '2000',
              category: '1',
              type: '1',              
            }
          ],
          totalElements: 2,
          message: 'success',
        }
      }
    };

    // api.eventList({
    //   ...queryData,
    //   page: pageNo,
    //   size: pageSize,
    // }).then((res) => {
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
    // }).catch((err) => {
    //   self.setState({ loadingShow: false });
    //   message.error(err ? err : '网络请求失败, 请重试!', 2);
    // });
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
      eventID: record.id
    });
  }

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
   * 新增商品
   */
  clickCreateGoods = () => {
    const self = this;
    self.setState({
      visible: true,
      eventID: ''
    });
  }

  render() {
    const {
      form: { resetFields, getFieldDecorator }
    } = this.props;
    const columns = [
      {
        title: '商品编码',
        width: 100,
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品名称',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '价格',
        width: 100,
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '所属类别',
        dataIndex: 'category',
        width: 100,
        key: 'category',
        align: 'center',
        render: (text) => (
          <>
            {Dict.getValue('goodsCategory', text, '')}
          </>
        ),
      },
      {
        title: '商品类型',
        dataIndex: 'type',
        width: 100,
        key: 'type',
        align: 'center',
        render: (text) => (
          <>
            {Dict.getValue('goodsType', text, '')}
          </>
        ),
      },
      {
        title: '操作',
        width: 100,
        dataIndex: 'operation',
        key: 'operation',
        ellipsis: true,
        align: 'center',
        render: (text, record) => (
          <Tooltip title="查看详情">
            <span className="event-setting" onClick={() => { this.clickItemDetail(record); }}>查看详情</span>
          </Tooltip>
        ),
      },
    ];
    return (
      <HomeLayout>
        {
          this.state.visible ? (
            <AddGoodsFun
              eventId={this.state.eventID}
              show={this.state.visible}
              onHide={() => {
                this.setState({ visible: false });
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
          ) : null
        }
        <p className="list-title">商品管理</p>
        <Divider style={{ margin: '3px 0' }} />
        <div className="common-list">
          <div className="item1">
            <Form className="user_search" onFinish={() => { this.onFinish(); }}>
              <div className="flex1">
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('searchValue',{})(
                      <Input placeholder="请输入商品编码" maxLength={50} />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('searchID',{})(
                      <Input placeholder="请输入商品名称" maxLength={50} />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('activityType',{})(
                      <Select placeholder="请选择商品类别" style={{ width: '100%' }}>
                        <Option value="INTERNAL">洗发护理</Option>
                        <Option value="EXTERNAL">女性护理</Option>
                        <Option value="EXTERNAL">口腔护理</Option>
                        <Option value="EXTERNAL">护肤</Option>
                        <Option value="EXTERNAL">新品测试</Option>
                        <Option value="EXTERNAL">个人护理</Option>
                        <Option value="EXTERNAL">织物及家居护理</Option>
                        <Option value="EXTERNAL">婴儿护理</Option>
                        <Option value="EXTERNAL">Grooming</Option>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>                  
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('status',{})(
                      <Select placeholder="请选择商品类型" style={{ width: '100%' }}>
                        <Option value="START">实物</Option>
                        <Option value="ING">虚拟商品</Option>
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
              <button className="current-btn" onClick={() => { this.clickCreateGoods(); }}>                  
                <PlusSquareOutlined />
                <span>新增商品</span>
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

export default createForm()(GoodsMgmt);
