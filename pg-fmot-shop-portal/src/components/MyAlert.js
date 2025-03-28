//import React, {Component} from "react";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function MyAlert({
  title = '错误',
  errorMsg = '',
  buttonText = '返回',
  callback = () => {},
}) {
  Modal.error({
    title: title,
    content: (
      <div>
        <p>{errorMsg}</p>
      </div>
    ),
    okText: buttonText,
    onOk: () => {
      callback();
    },
  });
}

//确认框Modal
export function ConfirmAlert({
  title = '请确认',
  errorMsg = '',
  callbackOK,
  callbackCancel,
}) {
  confirm({
    title: title,
    icon: <ExclamationCircleOutlined />,
    content: errorMsg,
    // okType: 'danger',
    cancelText: '取消',
    okText: '确认',
    onOk: () => {
      callbackOK();
    },
    onCancel: () => {
      callbackCancel();
    },
  });
}
