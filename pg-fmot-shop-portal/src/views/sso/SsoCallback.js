import React, { Component } from 'react';
import { Spin, Result } from 'antd';
import * as api from '../../api/api';
import { setToken } from '../../api/api';
import RoutePath from '../../config/RoutePath';
import Util from '../../utils/util';

class SsoCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      errorMsg: '',
    };
  }

  async componentDidMount() {
    const self = this;
    let queryCode = self.getAllParams();
    console.log('callback')
    console.log(queryCode);
    if (queryCode) {
      if (queryCode.error) {
        self.setState({
          errorMsg: `服务错误!`,
          loadingShow: false,
        });
      } else if (queryCode.code) {
        localStorage.clear();
        try {
          const url = Util.encodeBaseStr(RoutePath.SSOCallbackUrl)
          const res = await api.ssoLogin({ 
            code: queryCode.code,
            redirectUri: url
          });
          if (res) {
            self.setState({ loadingShow: false });
            const respData = res.data || {};
            if (0 === respData.code) {
              setToken(respData.data.token);
              localStorage.setItem('token', respData.data.token);
              localStorage.setItem('userName', respData.data.userName || '');
              localStorage.setItem('roleName', respData.data.roleName || '');
              self.props.history.push('/internalAccount');
            } else {
              self.setState({
                errorMsg: respData.message,
              });
            }
          }
        } catch (err) {
          self.setState({
            errorMsg: `网络请求失败, 请重试!`,
          });
        }
      } else {
        self.setState({
          loadingShow: false,
          errorMsg: `Code 获取失败!`,
        });
      }
    } else {
      self.setState({
        errorMsg: `Code 获取失败, 请重试!`,
        loadingShow: false,
      });
    }
  }

  getAllParams = () => {
    let href = window.location.href;
    let query = href.substring(href.indexOf('?') + 1);
    let vars = query.split('&');
    let obj = {};
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      // 将参数名和参数值分别作为对象的属性名和属性值
      obj[pair[0]] = pair[1];
    }
    return obj;
  };

  render() {
    return (
      <div style={{ marginTop: '60px' }}>
        {
          this.state.loadingShow ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <div>登录中...</div>
            </div>
          ) : (
            <>
              {
              !this.state.loadingShow && (
                <Result title={this.state.errorMsg}/>
              )
              }
            </>
          )
        }
      </div>
    );
  }
}

export default SsoCallback;
