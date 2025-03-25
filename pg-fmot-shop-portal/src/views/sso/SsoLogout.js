/**
 * Description: 登出内嵌的iframe
 **/
import React, {Component} from "react";
import { Result} from 'antd';
import RoutePath from "../../config/RoutePath";
import {LoginOutlined} from '@ant-design/icons';

class SsoLogout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // errorMsg: ""
        };
    }

    async componentDidMount() {
        const iframe = document.getElementById('myIframe');
        iframe.style = "display:none";
    }

    render() {
        return (
            <>
                <iframe id="myIframe"
                        // src={RoutePath.SsoLogout}
                />
                <div className='sso_callback'>
                    <Result status="success"
                            title='您已成功退出本次登录！'
                            subTitle="重新登录请点击下方按钮。"
                            extra={
                                // <Button type="primary"
                                //         key="login"
                                //     // disabled={-5 === dataCode}
                                //         onClick={() => {
                                //             window.location.href = RoutePath.SsoUrlJump
                                //         }}>
                                //     重新登录
                                // </Button>
                                <button className='current-btn'
                                        onClick={() => {
                                            window.location.href = RoutePath.SsoUrlJump
                                        }}
                                >
                                    <LoginOutlined/>
                                    <span>重新登录</span>
                                </button>
                            }
                    />
                </div>
            </>
        )
    }
}

export default SsoLogout;
