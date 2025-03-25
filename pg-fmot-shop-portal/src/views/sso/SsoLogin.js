import React, {Component} from "react";
// import {Form, Input, Button, Modal, message} from 'antd';
import {v4 as uuidv4} from "uuid"
import RoutePath from '../../config/RoutePath';

class SsoLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const id = uuidv4();
        window.location.href = RoutePath.SsoUrlJump + `&state=${id}`;
        // window.open(RoutePath.SsoUrlJump + `&state=${id}`, '_self')
    }

    // ordinary = () => {
    //     this.props.history.push(RoutePath.Login)
    // }

    // ssoLogin = () => {
    //     const id = uuidv4();
    //     window.location.href = RoutePath.SsoUrlJump + `&state=${id}`;
    // }

    render() {
        return (
            <>
                {/*<div style={{marginTop:'200px',display: 'flex',justifyContent: 'center'}}>*/}
                {/*    <button style={{width: '180px'}} className='current-btn' onClick={() => {*/}
                {/*        this.ssoLogin()*/}
                {/*    }}>*/}
                {/*        SSO登录*/}
                {/*    </button>*/}
                {/*    <button style={{width: '180px'}} className='current-btn' onClick={() => {*/}
                {/*        this.ordinary()*/}
                {/*    }}>*/}
                {/*        普通登录*/}
                {/*    </button>*/}
                {/*</div>*/}
            </>
        )
    }
}

export default SsoLogin;
