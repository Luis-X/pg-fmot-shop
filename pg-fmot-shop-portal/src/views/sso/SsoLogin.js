import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RoutePath from '../../config/RoutePath';

class SsoLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {    
    // FIXME: 为了调试，先注释sso登录
    const id = uuidv4();
    window.location.href = RoutePath.Callback + `?code=${id}`;
    // window.location.href = RoutePath.SsoUrlJump;
  }

  render() {
    return (
      <>
      </>
    );
  }
}

export default SsoLogin;
