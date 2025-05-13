import React, { useState } from 'react';
import { Drawer, Modal, Form, Input, message, Button } from 'antd';
import * as api from '../api/api';
import MyAlert from './MyAlert';
// import * as XLSX from 'xlsx'
import { LoadingOutlined } from '@ant-design/icons';
import $ from 'jquery';
// import axios from "axios";
// import Util from '../utils/util';

// type: 101-内部账号 102-内部积分 201-外部账号 202-外部积分
export function ImportDataPicker({ show, type, onHide, updateList }) {
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [firmLoading, setFirmLoading] = useState(false);
  const [form] = Form.useForm();

  // 1.获取上传文件签名
  const requestSignData = (file, typeValue) => {
    // console.log('获取签名', file, typeValue)
    setFirmLoading(true);
    api.uploadFileSign().then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          // console.log('获取签名，成功', respData)
          const signData = respData.data || {};
          const signParams = signData.params || {}
          requestUploadFile(file, typeValue, signParams);
        } else {
          console.log('获取签名，错误')
          setFirmLoading(false);
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      console.log('获取签名，失败')
      setFirmLoading(false);
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    })
  };

  // 2.开始上传文件
  const requestUploadFile = (file, typeValue, signParams) => {
    // console.log('上传文件', file, typeValue, signParams)
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('subscriptionKey', signParams.subscriptionKey);
    formData.append('public', signParams.public);
    formData.append('signature', signParams.signature);
    formData.append('timestamp', signParams.timestamp);
    formData.append('userId', signParams.userId);
    api.uploadFilePost(formData).then((res) => {
      if (res) {
        const respData = res.data || {};        
        const fileId = respData.fileId || '';
        if (fileId) {  
          // console.log('上传文件，成功', fileId)
          requestImportFile(fileId, typeValue);          
        } else {
          console.log('上传文件，错误')
          setFirmLoading(false);
          MyAlert({ errorMsg: '上传文件失败，请重试!' });
        }
      }
    }).catch((err) => {
      console.log('上传文件，失败')
      setFirmLoading(false);
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    })
  }

  // 3.获取导入文件，任务id
  const requestImportFile = (fileId, typeValue) => {
    // console.log('导入文件', fileId, typeValue)
    api.internalAccountImport({
      uploadFileId: fileId,
      type: typeValue,
    }).then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          // console.log('导入文件，成功', respData)
          const importData = respData.data || {};
          const taskId = importData.id || '';
          requestImportFileResult(taskId);
        } else {
          console.log('导入文件，错误')
          setFirmLoading(false);
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      console.log('导入文件，失败')
      setFirmLoading(false);
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }) 
  }

   // 4.轮询查询导入结果
   const requestImportFileResult = (taskId) => {
    // console.log('查询导入结果', taskId)
    api.asyncTaskDetail({
      id: taskId,
    }).then((res) => {
      if (res) {
        const respData = res.data || {};
        if (0 === respData.code) {
          // console.log('查询导入结果', respData)
          const resultData = respData.data || {};
          handleImportResult(resultData, taskId);
        } else {
          console.log('查询导入结果，错误')
          setFileData(null);
          setFileName('');
          setFirmLoading(false);
          MyAlert({ errorMsg: respData.message });
        }
      }
    }).catch((err) => {
      console.log('查询导入结果，失败')
      setFirmLoading(false);
      message.error(err ? err : '网络请求失败, 请重试!', 2);
    }) 
  }

  // 5.处理查询结果
  const handleImportResult = (data, taskId) => {
    const status = data.status || '';
    const isSuccess = data.result;
    const resultTxt = data.resultTxt;
    const resultTxtList = safeParseJsonArray(resultTxt);

    if (status === 'INIT') {
      console.log('查询导入结果，初始化')
      setTimeout(() => {
        requestImportFileResult(taskId);
      }, 1000);
    } else if (status === 'DOING') {            
      console.log('查询导入结果，进行中')
      setTimeout(() => {
        requestImportFileResult(taskId);
      }, 1000);
    } else if (status === 'DONE') {
      console.log('查询导入结果，完成')
      setFirmLoading(false);
      document.getElementById('file').value = '';
      setFileData(null);
      setFileName('');
      updateList();

      if (isSuccess) {
        console.log('查询导入结果，成功')
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
      } else {
        console.log('查询导入结果，失败')       
        Modal.error({
          width: 610,
          title: '导入数据错误',
          content: (
            <div className="import-error">
              {
                resultTxtList && resultTxtList.map((value) => (
                  <div>
                    <span className="number">错误行：</span>
                    {value.left},
                    {/* <span className="email">错误值：</span> */}
                    {/* {value.middle}, */}
                    <span className="reason">错误原因：</span>
                    {value.right}.
                  </div>
                ))
              }
            </div>
          ),
          okText: '返回',
          onOk: () => {},
        });
      }
    } else {
      console.log('查询导入结果，未知')
    }
  }

  const safeParseJsonArray = (jsonString) => {
    try {
      return JSON.parse(jsonString) || [];
    } catch (error) {
      console.error('JSON 解析失败:', error);
      return [];
    }
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

      let typeValue = ''
      if (type === 101) {
        typeValue = 'IMPORT_EMPLOYEE_FOR_ADMIN';
      }
      if (type === 102) {
        typeValue = 'IMPORT_EMPLOYEE_POINT_FOR_ADMIN';
      }
      if (type === 201) {
        typeValue = 'IMPORT_CUSTOMER_FOR_ADMIN';
      }
      if (type === 202) {
        typeValue = 'IMPORT_CUSTOMER_POINT_FOR_ADMIN';
      }
      
      // importForAdmin(file, typeValue);
      requestSignData(file, typeValue)
    }
  };

  /**
   * 下载
   */
  // const pointImportTemplateUrl = () => {
  //   Util.downloadTemplateFile(type)
  // };

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
            {/* <span className="event-setting" style={{ textDecoration: 'underline' }} onClick={() => pointImportTemplateUrl()}> 点击下载模版</span> */}
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
