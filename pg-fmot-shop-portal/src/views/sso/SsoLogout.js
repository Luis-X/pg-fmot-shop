import React, { Component } from 'react';
import { Result } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import Util from '../../utils/util';

class SsoLogout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const iframe = document.getElementById('myIframe');
    iframe.style = 'display:none';
  }

  render() {
    return (
      <>
        <iframe id="myIframe"/>
        <div className="sso_callback">
          <Result
            status="success"
            title="您已成功退出本次登录！"
            subTitle="重新登录请点击下方按钮。"
            extra={
              <button className="current-btn" onClick={() => {
                Util.navigationToSSOLogin();
              }}>
                <LoginOutlined />
                <span>重新登录</span>
              </button>
            }
          />
        </div>
      </>
    );
  }
}

export default SsoLogout;
