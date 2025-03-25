/**
 * Created by mp on 2022/9/6.
 */

import React, {Component} from 'react';
import {Result} from "antd";
import RoutePath from "../../config/RoutePath";
import {LoginOutlined} from "@ant-design/icons";

class ResultWarning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            code: ''
        };
    }

    async componentDidMount() {
        let query = this.props.location.pathname || '';
        let index = query.lastIndexOf("result/");
        let code = query.substring(index + 7, query.length);
        this.setState({code})
    }

    render() {
        const {code} = this.state
        return (
            <>
                <Result status="warning"
                        title={'2' === code ? 'You haven\'t signed in yet.' : 'You do not have permission to access.'}
                        subTitle={'2' === code ? "Please click the button below to log in." : 'Please contact the administrator.'}
                        extra={
                            '2' === code ?
                                <button className='current-btn'
                                        onClick={() => {
                                            window.location.href = RoutePath.SsoUrlJump
                                        }}
                                >
                                    <LoginOutlined/>
                                    <span>log in</span>
                                </button> : ''
                        }
                />
            </>
        )
    }
}

export default ResultWarning;
