import React, { Component } from 'react';
import { Col, Menu, message, Row } from 'antd';
import { withRouter } from 'react-router';
import head from '../assets/images/head.png';
import RoutePath from '../config/RoutePath';
import * as api from '../api/api';
import MyAlert from '../components/MyAlert';

const { SubMenu } = Menu;

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getParam(name) {
    var search = this.props.location.search;
    if (search === '') {
      return null;
    }

    var query = search.substring(1);
    var list = query.split('&');
    var item = [];
    for (var i = 0; i < list.length; i++) {
      item = list[i].split('=');
      if (item[0] === name) {
        return item[1];
      }
    }
    return null;
  }

  // 退出登录
  logout() {
    // localStorage.clear();
    // window.location.href = RoutePath.SsoLogout;
    api.logout({}).then((res) => {
      if (res) {
        if (0 === res.data.code) {
          localStorage.clear();
          window.location.href = RoutePath.SsoLogout;
        } else {
          MyAlert({ errorMsg: res.data.message });
        }
      }
    }).catch((err) => {
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  }

  componentDidMount() {
    
  }

  // 重新构造菜单
  restructMenu(data, role) {
    return data.map((cv) => {
      if (cv.role.indexOf(role) < 0) {
        return null;
      }
      if (cv.childs == null) {
        return (
          <Menu.Item key={cv.key} onClick={cv.onClick}>
            {cv.txt}
          </Menu.Item>
        );
      } else {
        return (
          <SubMenu key={cv.key} title={cv.txt}>
            {this.restructMenu(cv.childs, role)}
          </SubMenu>
        );
      }
    });
  }

  // 获取最后一个/后面的字符串
  lastIndexKey(params) {
    let index = params.lastIndexOf('/');
    return params.substring(index + 1, params.length);
  }

  render() {
    let exist = localStorage.getItem('token');
    const userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : 'admin';
    const roleName = localStorage.getItem('roleName') ? localStorage.getItem('roleName') : 'admin';
    let role = -1; //未登录
    if (exist) {
      //已经登录
      role = 0;
    }

    let onLogin = -1; //未登录
    let longin = 0; //登录
    // let roleAdmin = 1; //管理用户
    let allRoles = [onLogin, longin]; //所有用户

    let dataLeft = [
      {
        key: 'home',
        role: allRoles,
        // onClick: () => this.props.history.push('/home'),
        txt: 'FMOT Management Portal',
        childs: null,
      },
    ];

    let dataRight = [
      {
        key: 'login',
        role: [onLogin],
        onClick: () => this.props.history.push(RoutePath.Index),
        txt: '请登录',
        childs: null,
      },
      {
        key: 'userinfo',
        role: [longin],
        onClick: null,
        // txt: userName,
        txt: (
          <div style={{ marginLeft: '-15px' }}>
            {userName}
            <span style={{ marginLeft: '3px', color: 'orange', fontSize: '14px' }}>({roleName})</span>
          </div>
        ),
        childs: [
          {
            key: 'quitsystem',
            role: [longin],
            onClick: () => this.logout(),
            txt: '退出系统',
            childs: null,
          },
        ],
      },
    ];

    return (
      <div>
        <div>
          <Row>
            <Col span={20}>
              <Menu mode="horizontal" style={{ background: '#0071c0', lineHeight: '60px', paddingLeft: '10px', fontWeight: '600', fontSize: '19px', color: '#fff' }}>
                {this.restructMenu(dataLeft, 0)}
              </Menu>
            </Col>
            <Col span={4}>
              <Menu mode="horizontal" style={{ lineHeight: '60px', background: '#0071c0', color: '#fff' }}>
                <Menu.Item key="log" style={{ border: '0px', paddingRight: '0px', color: '#fff' }} onClick={() => {}}>
                  <img alt="" style={{ width: '28px' }} src={head} />
                </Menu.Item>
                {this.restructMenu(dataRight, role)}
              </Menu>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(TopBar);
