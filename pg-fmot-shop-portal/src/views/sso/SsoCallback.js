import React, { Component } from 'react';
import { Spin, Result } from 'antd';
import * as api from '../../api/api';
import { setToken } from '../../api/api';

class SsoCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      errorMsg: '',
    };
  }

  async componentDidMount() {
    let queryCode = this.getAllParams();
    if (queryCode) {
      if (queryCode.error) {
        this.setState({
          errorMsg: `server_error!`,
          loadingShow: false,
        });
      } else if (queryCode.code) {
        localStorage.clear();
        try {
          const res = await api.SsoLogin({ code: queryCode.code });
          if (res) {
            this.setState({ loadingShow: false });
            if (0 === res.data.code) {
              setToken(res.data.data.token);
              localStorage.setItem('token', res.data.data.token);
              localStorage.setItem('userName', res.data.data.userName);
              localStorage.setItem('roleName', res.data.data.roleName);
              localStorage.setItem(
                'loginInfo',
                JSON.stringify(res.data.data.menu)
              );
              const menuData = res.data.data.menu;
              if (menuData.length > 0) {
                if (menuData[0].subMenus) {
                  this.props.history.push(menuData[0].subMenus[0].path);
                } else {
                  this.props.history.push(menuData[0].path);
                }
              } else {
                this.setState({
                  errorMsg: `The management account has no configuration menu！`, //该管理账号还没有配置菜单
                });
              }
            } else {
              this.setState({
                errorMsg: res.data.message,
              });
            }
          }
        } catch (err) {
          this.setState({
            errorMsg: `Network request failed, please try again later!`,
          });
        }
      } else {
        this.setState({
          loadingShow: false,
          errorMsg: `Code not obtained!`,
        });
      }
    } else {
      this.setState({
        errorMsg: `Code not obtained!, please try again later!`,
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
        {this.state.loadingShow ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <div>Logging in...</div>
          </div>
        ) : (
          <>
            {!this.state.loadingShow && <Result title={this.state.errorMsg} />}
          </>
        )}
      </div>
    );
  }
}

export default SsoCallback;
