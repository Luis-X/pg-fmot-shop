import React, { Component } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import RoutePath from '../../config/RoutePath';
import Util from '../../utils/util';

class SsoLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {    
    // FIXME: 为了调试，先注释sso登录
    // const id = uuidv4();
    Util.navigationToUrl(RoutePath.SSOLoginUrl);
  }

  render() {
    return (
      <>
      </>
    );
  }
}

export default SsoLogin;
