import React, {Component} from "react";
import {Form, Input, Modal, message} from 'antd';
// import RoutePath from '../config/RoutePath';
import * as api from '../api/api';
import {setToken} from '../api/api';
import {createForm} from 'rc-form';
import {connect} from 'react-redux';
import UserInfo from '../actions/UserInfo'
// import RoutePath from '../config/RoutePath';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Modal.destroyAll()//销毁所有弹窗
        this.forceUpdate();
    }

    onFinish = (values) => {
        // this.props.saveUserInfoToStore(values);
        // values.password = md5(values.password)
        sessionStorage.clear();
        // localStorage.removeItem("token");
        api.userLogin({...values}).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    setToken(res.data.data.token);
                    localStorage.setItem("token", res.data.data.token);
                    localStorage.setItem("loginInfo", JSON.stringify(res.data.data.menu));
                    localStorage.setItem("userName", values.userName);
                    // localStorage.setItem("roleName", res.data.data.roleName);
                    const menuD = res.data.data.menu;
                    if (menuD.length > 0) {
                        if (menuD[0].subMenus) {
                            this.props.history.push(menuD[0].subMenus[0].path)
                        } else {
                            this.props.history.push(menuD[0].path)
                        }
                    } else {
                        this.setState({
                            errorMsg: `The management account has no configuration menu！`,//该管理账号还没有配置菜单
                        })
                    }
                } else {
                    Modal.warning({
                        title: 'Tips',
                        content: res.data.message,
                    });
                }
            }
        }).catch((err) => {
            message.error(err ? err : 'link failure！', 3);
        })
    };

    render() {
        return (
            <div className='login_bg'>
                <div className='login-form'>
                    <h2>FMOT Management Portal</h2>
                    <Form className='form-wrap'
                          onFinish={(event) => this.onFinish(event)}>
                        <p className="login_title">Please Login</p>
                        <Form.Item name="userName"
                                   rules={[
                                       {
                                           required: true,
                                           //validateStatus: 'error',
                                           message: 'Please enter username!',
                                       },
                                   ]}>
                            <Input size="large"
                                   style={{width: '380px', borderRadius: '25px'}}
                                   prefix={<UserOutlined/>}
                                   placeholder="username"
                            />
                        </Form.Item>
                        <Form.Item name="password"
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Please enter password!',
                                       },
                                   ]}
                        >
                            <Input.Password size="large"
                                            style={{width: '380px', borderRadius: '25px'}}
                                            prefix={<LockOutlined/>}
                                            placeholder="password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <button style={{width: '380px'}} className='current-btn'>
                                Login
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

// export default createForm()(Login);
// export default Login;
function mapDispatchToProps(dispatch) {
    return {
        saveUserInfoToStore: (data) => dispatch({
            type: UserInfo.SAVE_USER_INFO, //CON.SAVE_USER_INFO
            data: data,
        }),
    }
}

export default connect(null, mapDispatchToProps)(createForm()(Login));
