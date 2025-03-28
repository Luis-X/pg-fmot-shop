import React, { Component } from 'react';
import { Result } from 'antd';
import RoutePath from '../../config/RoutePath';
import { LoginOutlined } from '@ant-design/icons';

class ResultWarning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      code: '',
    };
  }

  async componentDidMount() {
    let query = this.props.location.pathname || '';
    let index = query.lastIndexOf('result/');
    let code = query.substring(index + 7, query.length);
    this.setState({ code });
  }

  render() {
    const { code } = this.state;
    return (
      <>
        <Result
          status="warning"
          title={
            '2' === code ? "您还没有登录" : '您还没有权限'
          }
          subTitle={
            '2' === code ? '重新登录请点击下方按钮': '请联系管理员'
          }
          extra={
            '2' === code ? (
              <button className="current-btn" onClick={() => {window.location.href = RoutePath.SsoUrlJump;}}>
                <LoginOutlined />
                <span>登录</span>
              </button>
            ) : (
              ''
            )
          }
        />
      </>
    );
  }
}

export default ResultWarning;
