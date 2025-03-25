/**
 * Created by mp on 2022/7/26.
 */

import React, {Component} from 'react';
import {createForm} from 'rc-form';
import {Table, message, Pagination, Form, Input, Row, Col, Divider} from 'antd';
import {PlusSquareOutlined, SearchOutlined, ReloadOutlined, QrcodeOutlined} from '@ant-design/icons';
import HomeLayout from "../../common/LayoutStyle";
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";
import {AddLineup} from "./AddLineup";
import QRCodeDetail from "./QRCodeDetail";

class Lineup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingShow: false,
            visible: false,
            qrCodeVisible: false,
            pageNo: 0,
            pageSize: 10,
            totalNum: 10,
            lineupQueryData: null,
            lineupId: '',
            QRCodeData: [],
            fileName: ''
        };
    }

    async componentDidMount() {
        this.lineupList()
    }

    lineupList = () => {
        const {pageNo, pageSize, lineupQueryData} = this.state;
        this.setState({loadingShow: true})

        api.lineupList({
            ...lineupQueryData,
            "page": pageNo,
            "size": pageSize
        }).then((res) => {
            this.setState({loadingShow: false})
            if (res) {
                if (0 === res.data.code) {
                    this.setState({
                        data: res.data.data.content,
                        totalNum: res.data.data.totalElements
                    })
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            this.setState({loadingShow: false})
            message.error(err ? err : 'link failure！', 2);
        })
    }

    pageOnChange(pageNo, pageSize) {
        this.setState({
            pageNo,
            pageSize,
            totalNum: this.state.totalNum
        }, () => {
            this.lineupList()
        });
    }

    // jurisdiction = (status, id) => {
    //     ConfirmAlert({
    //         title: "提示",
    //         errorMsg: `你是否确认修改当前Lineup对应二维码的状态为${'NORMAL' === status ? "【禁用】" : "【启用】"}状态?`,
    //         callbackOK: () => {
    //             api.lineupChangeStatus({
    //                 "id": id,
    //                 "status": 'NORMAL' === status ? 'DISABLE' : 'NORMAL'
    //             }).then((res) => {
    //                 if (res) {
    //                     if (0 === res.data.code) {
    //                         this.lineupList()
    //                     } else {
    //                         MyAlert({errorMsg: res.data.message});
    //                     }
    //                 }
    //             })
    //         },
    //         callbackCancel: () => {
    //         }
    //     });
    // }

    onFinish = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({lineupQueryData: values}, () => {
                    this.lineupList()
                })
            }
        });
    }

    // updateQRCodeData = () => {
    //     let id = this.state.lineupId
    //     this.QRCodeHistory(id)
    // }

    // QRCodeHistory = (id) => {
    //     api.QRCodeHistory({
    //         "lineupId": id
    //     }).then((res) => {
    //         if (res) {
    //             if (0 === res.data.code) {
    //                 this.setState({
    //                     QRCodeData: res.data.data
    //                 }, () => {
    //                     this.setState({
    //                         qrCodeVisible: true,
    //                         lineupId: id
    //                     })
    //                 })
    //             } else {
    //                 MyAlert({errorMsg: res.data.message});
    //             }
    //         }
    //     }).catch((err) => {
    //         message.error(err ? err : 'link failure！', 2);
    //     })
    // }

    render() {
        const {form: {resetFields, getFieldDecorator}} = this.props
        const columns = [
            {
                title: 'Lineup ID',
                dataIndex: 'id',
                width: 150,
                key: 'id',
                ellipsis: true,
                align: 'center'
            },
            {
                title: 'Lineup Name',
                dataIndex: 'name',
                width: 150,
                key: 'name',
                ellipsis: true,
                align: 'center'
            },
            // {
            //     title: 'Sales Status',
            //     dataIndex: 'status',
            //     width: 120,
            //     key: 'status',
            //     ellipsis: true,
            //     align: 'center',
            //     render: (text) =>
            //         <Tag color={'DISABLE'===text ? 'gray' : ''}>
            //             {text}
            //         </Tag>
            // },
            {
                title: 'Setting',
                width: 120,
                dataIndex: 'status',
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text, record) => (
                    <div style={{cursor: 'pointer'}} onClick={() => {
                        // this.QRCodeHistory(record.id)
                        this.setState({
                            fileName: record.name,
                            lineupId: record.id,
                            qrCodeVisible: true
                        })
                    }}>
                        <QrcodeOutlined className="offset-r15 link" title="Batch QR Code Creation"/>
                        {/*{'NORMAL' === text ?*/}
                        {/*    <StopOutlined style={{color: "red"}} title="Deactivate" onClick={() => {this.jurisdiction(text, record.id)}} /> :*/}
                        {/*    <CheckCircleOutlined style={{color: "#1890ff"}} title="Activate" onClick={() => {this.jurisdiction(text, record.id)}} />*/}
                        {/*}*/}
                    </div>
                ),
            }
        ];
        return (
            <HomeLayout>
                {this.state.visible ?
                    <AddLineup show={this.state.visible}
                               onHide={() => {
                                   this.setState({visible: false})
                               }}
                               updateList={() => {
                                   resetFields();
                                   this.setState({
                                       pageNo: 0,
                                   }, () => {
                                       this.lineupList()
                                   })
                               }}
                    /> : null
                }
                {this.state.qrCodeVisible ?
                    <QRCodeDetail fileName={this.state.fileName}
                                  QRCodeData={this.state.QRCodeData}
                                  show={this.state.qrCodeVisible}
                                  lineupId={this.state.lineupId}
                        // updateQRCodeData={this.updateQRCodeData}
                                  onHide={() => {
                                      this.setState({qrCodeVisible: false})
                                  }}
                    /> : null
                }

                <p className="list-title">Lineup</p>
                <Divider style={{margin: '3px 0'}}/>
                <div className="common-list">
                    <div className="item1">
                        <Form className="user_search" onFinish={this.onFinish}>
                            <div className="flex1">
                                <Row gutter={24}>
                                    <Col span={10}>
                                        <Form.Item>
                                            {
                                                getFieldDecorator('searchKey', {})(
                                                    <Input placeholder="Please input Lineup Name or Lineup ID"
                                                    />
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className="btn-width" style={{width: "315px"}}>
                                <button className='current-btn'
                                        onClick={() => {
                                            this.setState({pageNo: 0})
                                        }}
                                >
                                    <SearchOutlined/>
                                    <span>Query</span>
                                </button>
                                <button className='current-btn bg-gray'
                                        onClick={() => this.setState({
                                            pageNo: 0,
                                            pageSize: 10,
                                        }, () => {
                                            resetFields();
                                        })}
                                >
                                    <ReloadOutlined/>
                                    <span>Reset</span>
                                </button>
                            </div>
                        </Form>
                    </div>
                    <div className="item2">
                        <Row gutter={5} style={{marginBottom: "15px"}}>
                            <button className='current-btn'
                                    onClick={() => {
                                        this.setState({visible: true})
                                    }}
                            >
                                <PlusSquareOutlined/>
                                <span>Add Lineup</span>
                            </button>
                        </Row>
                        <Table size="middle"
                               loading={this.state.loadingShow}
                               pagination={false}
                               rowKey="id"
                               columns={columns}
                               dataSource={this.state.data}
                               rowClassName={(record, idx) => {
                                   if (idx % 2 === 1)
                                       return 'bg-row';
                               }}
                        />
                        {
                            this.state.data.length > 0 &&
                            <Pagination style={{paddingTop: "25px"}}
                                        pageSize={this.state.pageSize}
                                        current={this.state.pageNo + 1}
                                        total={this.state.totalNum}
                                        onChange={(pageNo, pageSize) => this.pageOnChange(
                                            pageNo - 1, pageSize
                                        )}
                            />
                        }
                    </div>
                </div>
            </HomeLayout>
        )
    }
}

export default createForm()(Lineup);
