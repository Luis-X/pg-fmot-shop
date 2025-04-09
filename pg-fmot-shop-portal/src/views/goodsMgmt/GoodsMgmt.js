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
      goodsTypeList: [],
      goodsCategoryList: [],

      data: [],
      loadingShow: false,
      queryData: null,
      pageNo: 0,
      pageSize: 10,
      totalNum: 10,

      isShow: false,
      goodsID: '',
    };
  }

  async componentDidMount() {
    const self = this;    
    self.requestListData();
    self.requestGoodsCategoryListtData();
    self.configGooodsTypeList();
  }

  // 商品类型
  configGooodsTypeList = () => {
    const self = this;
    const list = Dict.getOptionsList('goodsType');
    self.setState({
      goodsTypeList: list,
    })
  }

  // 商品类别
  requestGoodsCategoryListtData = () => {
    const self = this;
    api.goodsCategoryList().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          self.setState({
            goodsCategoryList: respData.data,
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
    api.goodsList({
      ...queryData,
      page: pageNo,
      size: pageSize,
    }).then((res) => {
      self.setState({ loadingShow: false });
      if (res) {
        const respData = res.data || {};
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

  // 查看详情
  clickItemDetail = (record) => {
    const self = this;
    self.setState({
      isShow: true,
      goodsID: record.id
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

  // 新增商品
  clickCreateGoods = () => {
    const self = this;
    self.setState({
      isShow: true,
      goodsID: ''
    });
  }

  render() {
    const { goodsTypeList, goodsCategoryList } = this.state;
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
          this.state.isShow ? (
            <AddGoodsFun
              goodsId={this.state.goodsID}
              show={this.state.isShow}
              onHide={() => {
                this.setState({ isShow: false });
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
                    <Form.Item>{getFieldDecorator('goodsId',{})(
                      <Input placeholder="请输入商品编码" />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('goodsName',{})(
                      <Input placeholder="请输入商品名称" />
                    )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('goodsCategory',{})(
                      <Select placeholder="请选择商品类别" style={{ width: '100%' }}>                      
                        {
                          goodsCategoryList.length > 0 && goodsCategoryList.map((item, index) => (
                            <Option key={index} value={item.id}>{item.name}</Option>
                          ))
                        }
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>                  
                  <Col span={8}>
                    <Form.Item>{getFieldDecorator('goodsType',{})(
                      <Select placeholder="请选择商品类型" style={{ width: '100%' }} options={goodsTypeList}>
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
