/**
 * Created by mp on 2022/9/14.
 */

import React, {Component} from 'react';
import {Result, Button} from "antd";
// import RoutePath from "../../config/RoutePath";
// import {LoginOutlined} from "@ant-design/icons";

class ResultCodePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            code: ''
        };
    }

    async componentDidMount() {
        let code = this.props.match.params.code || '';
        this.setState({code})
    }


    render() {
        const {code} = this.state
        return (
            <>
                <Result
                    status='500'
                    title={code?code:''}
                    subTitle="Sorry, something went wrong."
                    extra={<Button type="primary" onClick={()=>{
                        this.props.history.go(-1)
                    }}> go back</Button>}
                />
            </>
        )
    }
}

export default ResultCodePage;
