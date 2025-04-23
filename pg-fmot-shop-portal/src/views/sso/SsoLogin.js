import React, { Component } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import Util from '../../utils/util';

class SsoLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // const id = uuidv4();
    Util.navigationToSSOLogin();
  }

  render() {
    return (
      <>
      </>
    );
  }
}

export default SsoLogin;
