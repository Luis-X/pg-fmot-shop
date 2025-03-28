import React, { Component } from 'react';
import { Result, Button } from 'antd';

class ResultCodePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      code: '',
    };
  }

  async componentDidMount() {
    let code = this.props.match.params.code || '';
    this.setState({ code });
  }

  render() {
    const { code } = this.state;
    return (
      <>
        <Result
          status="500"
          title={code ? code : ''}
          subTitle="抱歉, 出错了"
          extra={
            <Button type="primary" onClick={() => { this.props.history.go(-1)}}>{' '}返回</Button>
          }
        />
      </>
    );
  }
}

export default ResultCodePage;
