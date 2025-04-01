import React, { useState } from 'react';
import { Drawer, Modal, Form, Input, message, Button } from 'antd';
import * as api from '../api/api';
import MyAlert from './MyAlert';
// import * as XLSX from 'xlsx'
import { LoadingOutlined } from '@ant-design/icons';
import $ from 'jquery';
// import axios from "axios";
import { DownloadTemplateFile } from '../utils/util';

export function ImportDataPicker({ show, type, onHide, updateList }) { // type【account: 导入账号 points: 导入积分】
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [firmLoading, setFirmLoading] = useState(false); // 导入数据成功loading
  const [form] = Form.useForm();

  /**
   * 导入excel的函数
   * @param {*} file
   */
  const importForAdmin = (file) => {
    setFirmLoading(true);
    let formData = new FormData();
    formData.append('file', file);
    api.internalAccountImport(formData).then((res) => {
      if (res) {
        const respData = res.data;
        if (0 === respData.code) {
          setFirmLoading(false);
          document.getElementById('file').value = '';
          setFileData(null);
          setFileName('');
          updateList();
          if (respData.data.length > 0) {
            let resultTxt = respData.data;
            Modal.error({
              width: 610,
              title: '导入数据错误',
              content: (
                <div className="import-error">
                  {resultTxt.map((value) => (
                    <div>
                      <span className="number">Line：</span>
                      {value.lineNumber},
                      <span className="email">Shop name：</span>
                      {value.shopName},
                      <span className="reason">Error message：</span>
                      {value.errorMessage}.
                    </div>
                  ))}
                </div>
              ),
              okText: 'Back',
              onOk: () => {},
            });
          } else {
            setFirmLoading(false);
            Modal.success({
              title: '提示',
              content: '文件导入成功！',
              onOk: () => {
                setFileData(null);
                setFileName('');
                onHide();
              },
            });
          }
        } else {
          setFileData(null);
          setFileName('');
          setFirmLoading(false);
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      setFirmLoading(false);
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    });
  };

  /**
   * 提交
   */
  const importFile = () => {
    if (!$('#uploadForm')[0] || !fileData) {
      message.error('请选择1个文件并上传！');
    } else {
      let fileDom = document.querySelector('input[type=file]');
      let file = fileDom.files[0];
      importForAdmin(file);
    }
  };

  /**
   * 下载
   */
  const pointImportTemplateUrl = () => {
    DownloadTemplateFile(type)
  };

  /**
   * 选择文件
   */
  const uploadImg = () => {
    setFileName('');
    setFileData(null);
    // 获取得到file 对象
    let fileDom = document.querySelector('input[type=file]');
    let file = fileDom.files[0];
    if (!file) {
      message.error(`您尚未选择文件!`);
      return;
    }
    let type = file.name.split('.').pop().toLowerCase(); //获取文件类型
    if (type !== 'xls' && type !== 'xlsx') {
      let dx = document.getElementById('file');
      dx.value = '';
      message.error('文件类型错误！');
      return;
    }
    if (file.size > 5242880) {
      message.error('文件太大，需要等待一段时间！');
    }
    setFileName(file.name);
    // 创建url
    let imgUrl = window.URL.createObjectURL(file);
    setFileData(imgUrl);
  };

  const showTitle = () => {
    if (type === 101) {
      return '导入内部账号';
    } else if (type === 102) {
      return '内部账号 积分充值';
    } else if (type === 201) {
      return '导入外部账号';
    } else if (type === 202) {
      return '外部账号 积分充值';
    }  else {
      return '';
    }
  }

  return (
    <React.Fragment>
      <Form form={form} layout="vertical">
        <Drawer
          title={showTitle()}
          width={700}
          open={show}
          // maskClosable={false}
          onClose={() => {
            setFileData(null);
            setFileName('');
            onHide();
          }}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div className="create-event-btn">
              <Button type="primary" loading={firmLoading} onClick={() => { importFile(); }}>导入</Button>
              <Button onClick={onHide}>取消</Button>
            </div>
          }
        >
          <h2 style={{ marginBottom: 10 }}>
            <span style={{ color: 'red' }}>* </span>
            {showTitle()}
          </h2>
          <h4 style={{ marginBottom: 10 }}>
            提示: 请按照模版上传.xlsx文件
            <span className="event-setting" style={{ textDecoration: 'underline' }} onClick={() => pointImportTemplateUrl()}> 点击下载模版</span>
          </h4>
          <div className="upload-btn">
            <>
              <Input disabled={true} value={fileName} placeholder="请选择要导入的文件" style={{ width: '70%', color: 'rgba(0, 0, 0, 0.8)' }} />
              <form className="form" id="uploadForm" encType="multipart/form-data">
                {
                  firmLoading ? (
                    <p><LoadingOutlined /> 导入中...</p>
                  ) : (
                    '选择文件'
                  )
                }
                <input id="file" disabled={firmLoading} type="file" name="file" accept=".xls,.xlsx" onChange={uploadImg} />
              </form>
            </>
          </div>
        </Drawer>
      </Form>
    </React.Fragment>
  );
}
