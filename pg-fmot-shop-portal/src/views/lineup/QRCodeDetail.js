import React from "react";
import {createForm} from 'rc-form';
import moment from 'moment';
import {Form, InputNumber, message, Table, Drawer, Row, Col, Button, Tag, notification} from 'antd';
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";
import Dict from "../../config/Dict";
import $ from 'jquery';
import {LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";

class QRCodeDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            qrCodeBtnShow: false, //生成 Download QR code
            lineupQrCodeShow: false, //下载 Download QR code
            inter: '',
            QRCodeData: null
        };
    }

    static defaultProps = {
        lineupId: '',
        // QRCodeData: [],
        show: false,
        onHide: null,
        updateQRCodeData: null,
    };

    async componentDidMount() {
        this.QRCodeHistory();
    }

    componentWillUnmount() {
        clearInterval(this.state.inter);
    }

    /**
     * 查询二维码下载列表记录
     */
    QRCodeHistory = () => {
        api.QRCodeHistory({
            "lineupId": this.props.lineupId
        }).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    this.setState({
                        QRCodeData: res.data.data
                    }, () => {
                        this.qrCodeListInter(res.data.data);
                    })
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            message.error(err ? err : 'link failure！', 2);
        })
    }

    /**
     * 每5秒轮训一次list接口，以保证更新DOING状态
     */
    qrCodeListInter = (qrData) => {
        const _this = this;
        let qrDoingFlg = false;
        clearInterval(_this.state.inter);
        for (let i = 0; i < qrData.length; i++) {
            if ('DOING' === qrData[i].status) {
                qrDoingFlg = true;
                break;
            } else {
                qrDoingFlg = false;
            }
        }

        if (qrDoingFlg) {
            _this.state.inter = setInterval(
                function () {
                    _this.QRCodeHistory();
                }, 5000);
        } else {
            clearInterval(_this.state.inter);
        }
    }

    /**
     * 生成二维码
     */
    onFinish = (values) => {
        this.setState({qrCodeBtnShow: true})
        api.GenerateQRCode({
            ...values,
            "lineupId": this.props.lineupId
        }).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    message.success('Added successfully!', 3);
                    // this.props.updateQRCodeData();
                    // this.qrCodeListInter();
                    this.QRCodeHistory();
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
                this.setState({qrCodeBtnShow: false});
            }
        }).catch((err) => {
            this.setState({qrCodeBtnShow: false});
            message.error(err ? err : 'link failure！', 2);
        })
    }

    /**
     * 重新生成二维码
     */
    regenerate = (lineupCodeId) => {
        api.regenerate({
            "lineupCodeId": lineupCodeId
        }).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    // this.props.updateQRCodeData()
                    this.QRCodeHistory();
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            message.error(err ? err : 'link failure！', 2);
        })
    }

    /**
     * 下载二维码回调
     */
    downLoadSuccessFun = (codeId, downloadFileName) => {
        api.downLoadCallBack({
            "lineupCodeId": codeId,
            "downloadFileName": downloadFileName
        }).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    // this.props.updateQRCodeData();
                    this.QRCodeHistory();
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            message.error(err ? err : 'link failure！', 2);
        })
    }

    /**
     * 随机文件名
     */
    guid = () => {
        let now = new Date().getTime();
        let str = `xxxxxxxx-xxxx-${now}-yxxx`
        return str.repeat(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    }

    /**
     * 下载二维码
     */
    downloadLineupQrCode = (lineupCodeId) => {
        const _this = this
        const lineupFileName = _this.props.fileName;
        let url = "/api/admin/lineup/downloadLineupQrCode"
        let params = {'lineupCodeId': lineupCodeId}
        let xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "blob";  // 返回类型blob

        xhr.onload = function () {
            if (this.status === 200) {
                let blob = this.response;
                try {
                    let jsonData = JSON.parse(blob);
                    if (jsonData.code) {
                        // 说明是普通对象数据，后台转换失败
                        MyAlert({errorMsg: 'Download failed, please regenerate'});
                    }
                } catch (err) {
                    let fileName = decodeURIComponent(lineupCodeId);   // 解析成对象失败，说明是正常的文件流
                    if (navigator.msSaveBlob == null) {
                        let a = document.createElement('a');
                        a.download = lineupFileName ? lineupFileName + `-${moment(new Date()).format('YYYYMMDDHHmmss')}` : _this.guid();
                        a.href = URL.createObjectURL(blob);
                        $("body").append(a);// 修复firefox中无法触发click
                        a.click();
                        _this.downLoadSuccessFun(lineupCodeId, lineupFileName ? lineupFileName + `-${moment(new Date()).format('YYYYMMDDHHmmss')}` + `.xlsx` : _this.guid() + `.xlsx`);
                        URL.revokeObjectURL(a.href);
                        $(a).remove();

                        notification['success']({
                            message: 'File exported successfully！',
                            description:
                                'Open Excel to view export details.',
                        });
                    } else {
                        navigator.msSaveBlob(blob, fileName);//直接保存文件
                    }
                }
            }
        };
        xhr.send(JSON.stringify(params));  // 发送ajax请求
    }

    render() {
        const {show, onHide} = this.props;
        const {qrCodeBtnShow} = this.state
        const statusColor = {
            'DOING': 'orange',
            'DONE': 'blue',
            'DOWNLOAD': 'green',
            'FAIL ': 'red',
        }
        const columns = [
            {
                title: 'Generation Time',
                dataIndex: 'createDate',
                width: 85,
                key: 'createDate',
                ellipsis: true,
                align: 'center',
                render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: 'Generation Quantity',
                dataIndex: 'quantity',
                width: 60,
                key: 'quantity',
                // ellipsis: true,
                align: 'center'
            },
            {
                title: 'Executor',
                dataIndex: 'createUserName',
                width: 80,
                key: 'createUserName',
                ellipsis: true,
                align: 'center'
            },
            {
                title: 'Status',
                dataIndex: 'status',
                width: 70,
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text) => (
                    <>
                        {
                            text ?
                                // <Tag color={statusColor[text]}>{text}</Tag>
                                <Tag color={statusColor[text]}>{Dict.getValue('qrCodeDetailType', text, '')}</Tag>
                                : '--'
                        }
                    </>
                ),
            },
            {
                title: 'File Name',
                dataIndex: 'downloadFileName',
                width: 130,
                key: 'downloadFileName',
                // ellipsis: true,
                align: 'center'
            },
            {
                title: 'Setting',
                dataIndex: 'status',
                width: 100,
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text, record) => (
                    <>
                        {  // DOING, DONE, DOWNLOAD, FAIL
                            ('DOWNLOAD' !== record.status && 'FAIL' !== record.status) &&
                            <Button disabled={'DOING' === record.status}
                                    onClick={() => {
                                        this.downloadLineupQrCode(record.id)
                                    }}>
                                Download QR code
                            </Button>
                        }
                        {
                            'FAIL' === record.status &&
                            <Button onClick={() => {
                                this.regenerate(record.id)
                            }}>
                                Regenerate
                            </Button>
                        }
                    </>
                ),
            },
        ];

        return (
            <Drawer
                title="Generate QR code"
                width={1000}
                visible={show}
                onClose={() => {
                    this.props.onHide()
                }}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <>
                        <button className='current-btn'
                                onClick={onHide}
                        >
                            <ArrowLeftOutlined />
                            <span>Back</span>
                        </button>
                    </>
                }
            >
                <h4 style={{marginBottom: 10}}><span style={{color: 'red'}}>* </span>Please input the QR Code quantity
                    to be generated</h4>
                <Form onFinish={(event) => this.onFinish(event)}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item name="quantity"
                                       rules={[
                                           {
                                               required: true,
                                               message: 'Please input the QR Code quantity to be generated',
                                           },
                                       ]}>
                                <InputNumber min={1} max={100000} precision={0} className="width100"
                                             placeholder="Please input the QR Code quantity to be generated"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <button disabled={qrCodeBtnShow}
                                        className='current-btn'
                                        onClick={() => {
                                            // this.GenerateQRCode()
                                        }}
                                >
                                    {
                                        qrCodeBtnShow ?
                                            <>
                                                <LoadingOutlined/>
                                                <span>Downloading...</span>
                                            </> :
                                            <>
                                                <span>Create QR Code</span>
                                            </>
                                    }
                                </button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <h4 style={{marginBottom: 10}}>Generation and Download Record</h4>
                <Row gutter={16}>
                    <Col span={24}>
                        <Table size="middle"
                               pagination={false}
                               rowKey="id"
                               columns={columns}
                               dataSource={this.state.QRCodeData}
                               rowClassName={(record, idx) => {
                                   if (idx % 2 === 1)
                                       return 'bg-row';
                               }}
                        />
                    </Col>
                </Row>
            </Drawer>
        )
    }
}

export default createForm()(QRCodeDetail);
