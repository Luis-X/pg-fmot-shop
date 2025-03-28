import React, { Component } from 'react';
import { Layout } from 'antd';
import HomeMenu from '../common/menu/HomeMenu';
import TopBar from './TopBar';

let { Content } = Layout;

class LayoutStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout>
        <TopBar />
        <Layout style={{ background: '#eef2f5', paddingTop: 2, paddingLeft: 0, paddingRight: 0, paddingBottom: 10,}}>
          <HomeMenu />
          <Content style={{ background: '#ffffff', padding: 20, boxShadow: '0 0 10px 0 rgb(0 0 0 / 15%)',}}>{this.props.children}</Content>
        </Layout>
      </Layout>
    );
  }
}

export default LayoutStyle;
