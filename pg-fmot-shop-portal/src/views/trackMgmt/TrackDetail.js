import React, { Component } from 'react';
import { createForm } from 'rc-form';
import {
  Divider,
  Table,
  message,
  Pagination,
  Form,
  Row,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import HomeLayout from '../../common/LayoutStyle';
import * as api from '../../api/api';
import MyAlert from '../../components/MyAlert';

class TrackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loadingShow: false,
      eventID: '',
      eventStatus: '',
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

    const res = {
      data: {
        code: 0,
        data: {
          content: [
            {
              id: 1,
              name: '商品1',
              count: 100,
              times: 100,
            },
          ]
        }
      }
    }

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
   * 人数
   */
  clickSearchPeople = () => {
    const self = this;
    self.setState({ 
      tabIndex: 0,
      pageNo: 0, 
      queryFlg: true 
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
      queryFlg: true 
    }, () => {
      // self.requestListData()
    });
  };

  /**
   * 返回
   */
  clickBackBtn = () => {
    window.history.back()
  }

  render() {
    const { tabIndex } = this.state;
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
      <HomeLayout>
        <button className="current-btn" onClick={() => { this.clickBackBtn(); }}>
          <LeftOutlined />
          <span>返回</span>
        </button>
        {/* <p className="list-title">数据详情</p> */}        
        <Divider style={{ margin: '3px 0' }} />
        <div className="common-list">
          <div className="item1">
            <Form className="user_search" onFinish={() => { this.onFinish(); }}>
              <div className="flex1">
                <Row gutter={24}>
                <div>
                  <button className={tabIndex === 0 ? "current-btn" : "current-border-btn"} onClick={() => { this.clickSearchPeople(); }}>
                    <span>人数</span>
                  </button>
                  <button className={tabIndex === 1 ? "current-btn" : "current-border-btn"} onClick={() => { this.clickSearchTimes(); }}>
                    <span>次数</span>
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
              columns={tabIndex === 0 ? peopleColumns : timesColumns}
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

export default createForm()(TrackDetail);
