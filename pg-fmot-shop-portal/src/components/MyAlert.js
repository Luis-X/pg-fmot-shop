//import React, {Component} from "react";
import {Modal} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {confirm} = Modal;

export default function MyAlert({title = 'Access error', errorMsg = '', buttonText = 'Back', callback = () => {}})
{
    Modal.error({
        title: title,
        content: (
            <div>
                <p>{errorMsg}</p>
            </div>
        ),
        okText: buttonText,
        onOk: () => {
            callback()
        },
    });
}

//确认框Modal
export function ConfirmAlert({title = 'Please confirm', errorMsg = '', callbackOK, callbackCancel}) {
    confirm({
        title: title,
        icon: <ExclamationCircleOutlined/>,
        content: errorMsg,
        // okType: 'danger',
        cancelText: 'Cancel',
        okText: 'Submit',
        onOk: () => {
            callbackOK()
        },
        onCancel: () => {
            callbackCancel()
        },
    });
}
