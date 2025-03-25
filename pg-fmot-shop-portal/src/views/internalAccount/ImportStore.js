import React, {useState} from 'react';
import {Drawer, Modal, Form, Input, message, Button} from 'antd';
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";
// import * as XLSX from 'xlsx'
import {LoadingOutlined} from '@ant-design/icons';
import $ from 'jquery';
// import axios from "axios";

export function ImportStore({show, onHide, updateList}) {
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
        formData.append("file", file);
        api.importForAdmin(formData).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    setFirmLoading(false);
                    document.getElementById('file').value = '';
                    setFileData(null);
                    setFileName('');
                    updateList();
                    if (res.data.data.length > 0) {
                        let resultTxt = res.data.data;
                        Modal.error({
                            width: 610,
                            title: 'Import data error',
                            content: (
                                <div className='import-error'>
                                    {
                                        resultTxt.map((value) => (
                                            <div>
                                                <span className='number'>Line：</span>{value.lineNumber},
                                                <span className='email'>Shop name：</span>{value.shopName},
                                                <span className='reason'>Error message：</span>{value.errorMessage}.
                                            </div>
                                        ))
                                    }
                                </div>
                            ),
                            okText: 'Back',
                            onOk: () => {
                            },
                        });
                    } else {
                        setFirmLoading(false)
                        Modal.success({
                            title: 'Tips',
                            content: 'Excel imported successfully！',
                            onOk: () => {
                                setFileData(null)
                                setFileName('')
                                onHide()
                            },
                        });
                    }
                } else {
                    setFileData(null);
                    setFileName('');
                    setFirmLoading(false)
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            setFirmLoading(false)
            message.error(err ? err : 'link failure！', 2);
        })
    };

    /**
     * 提交
     */
    const importFile = () => {
        if (!$('#uploadForm')[0] || !fileData) {
            message.error('Please select a file and upload it！');
        } else {
            let fileDom = document.querySelector('input[type=file]');
            let file = fileDom.files[0];
            importForAdmin(file)
        }
    }

    /**
     * 下载
     */
    const pointImportTemplateUrl = () => {
        var xhh = new XMLHttpRequest();
        xhh.open("post", '/api/get/pointImportTemplateUrl',true);
        // xhh.setRequestHeader("Authorization", localStorage.getItem('token'));
        xhh.setRequestHeader("Authorization", localStorage.getItem('token'));
        xhh.setRequestHeader("Content-Type", "application/json");
        xhh.responseType = 'blob';
        xhh.onload = function () {
            if (this.status === 200) {
                var blob = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                    // 转换完成，创建a标签用于下载
                    var a = document.createElement('a');
                    a.download = `store template.xlsx`;
                    a.href = e.target.result;
                    $("body").append(a);
                    a.click();
                    $(a).remove();
                }
            }
        };
        xhh.send();

        // return new Promise(() => {
        //     const fileName = 'Write off details'
        //     axios({
        //         url: '/api/get/pointImportTemplateUrl',
        //         method: 'post',
        //         headers: {
        //             'Content-Type': 'application/json;charset=utf-8',
        //             'X-Content-Type-Options': 'nosniff',
        //             'Pragma': 'no-cache',
        //             'Authorization': localStorage.getItem('token') || ''
        //         },
        //         // data: {
        //         // },
        //         responseType: 'blob'
        //     })
        //         .then((res) => {
        //             if (res.status === 200) {
        //                 const blob = new Blob([res.data], {
        //                     type: 'application/vnd.ms-excel;charset=utf-8'
        //                 });
        //                 const objectUrl = URL.createObjectURL(blob);
        //                 const elink = document.createElement('a');
        //                 elink.download = `${fileName}.xlsx`;
        //                 elink.style.display = 'none';
        //                 elink.href = objectUrl;
        //                 document.body.appendChild(elink);
        //                 elink.click();
        //                 URL.revokeObjectURL(elink.href); // 释放URL 对象
        //                 document.body.removeChild(elink);
        //
        //                 notification['success']({
        //                     message: 'File exported successfully！',
        //                     description:
        //                         'Open Excel to view export details.',
        //                 });
        //             }
        //         })
        //         .catch(function () {
        //             message.error('link failure！', 2);
        //         })
        // })
    }

    /**
     * 选择文件
     */
    const uploadImg = () => {
        setFileName('')
        setFileData(null)
        // 获取得到file 对象
        let fileDom = document.querySelector('input[type=file]');
        let file = fileDom.files[0];
        if (!file) {
            message.error(`You haven't selected the document yet!`);
            return;
        }
        let type = file.name.split('.').pop().toLowerCase();//获取文件类型
        if (type !== 'xls' && type !== 'xlsx') {
            let dx = document.getElementById('file');
            dx.value = '';
            message.error('Wrong file type！');
            return;
        }
        if (file.size > 5242880) {
            message.error('The file is too large and needs to wait for a while！');
        }
        setFileName(file.name);
        // 创建url
        let imgUrl = window.URL.createObjectURL(file);
        setFileData(imgUrl);
    };

    return (
        <React.Fragment>
            <Form form={form} layout="vertical">
                <Drawer
                    title="Import Store"
                    width={700}
                    visible={show}
                    // maskClosable={false}
                    onClose={() => {
                        setFileData(null)
                        setFileName('')
                        onHide()
                    }}
                    bodyStyle={{paddingBottom: 80}}
                    footer={
                        <div className='create-event-btn'>
                            <Button type='primary'
                                    loading={firmLoading}
                                    onClick={() => {
                                        importFile()
                                    }}>
                                Import
                            </Button>
                            <Button onClick={onHide}>Cancel</Button>
                        </div>
                    }
                >
                    <h2 style={{marginBottom: 10}}><span style={{color: 'red'}}>* </span>Upload Store List</h2>
                    <h4 style={{marginBottom: 10}}>
                        Tips: Please upload the .xlsx file following the template.
                        <span className='event-setting' style={{textDecoration: 'underline'}}
                              onClick={() => pointImportTemplateUrl()}>
                            Click here to download the template.
                        </span>
                    </h4>
                    <div className='upload-btn'>
                        <>
                            <Input disabled={true}
                                   value={fileName}
                                   placeholder="Please select the file to import."
                                   style={{width: "70%", color: 'rgba(0, 0, 0, 0.8)'}}
                            />
                            <form className="form" id="uploadForm" encType="multipart/form-data">
                                {
                                    firmLoading ?
                                        <p>
                                            <LoadingOutlined/> Importing...
                                        </p>
                                        : 'Select file'
                                }
                                <input id="file"
                                       disabled={firmLoading}
                                       type="file"
                                       name="file"
                                       accept=".xls,.xlsx"
                                       onChange={uploadImg}
                                />
                            </form>
                        </>
                    </div>
                </Drawer>
            </Form>
        </React.Fragment>
    );
}
