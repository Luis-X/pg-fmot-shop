import React, {Component} from "react";
import {createForm} from 'rc-form';
import {Table, message, Form, Input, Row, Col, Pagination} from 'antd';
import {EditOutlined, SmileOutlined} from '@ant-design/icons';
// import RoutePath from '../../config/RoutePath';
import HomeLayout from "../../common/LayoutStyle";
import * as api from "../../api/api";
import MyAlert, {ConfirmAlert} from "../../components/MyAlert";
import {ChangePassword} from "./ChangePassword";

class ShopConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blackListData: [],
            visible: false,
            pageNo: 0,
            pageSize: 10,
            totalNum: 10,
        };
    }

    componentDidMount() {
        this.blackList();
    }

    blackList = () => {
        const {pageNo, pageSize} = this.state;
        api.blackList({
            "page": pageNo,
            "size": pageSize,
        }).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    this.setState({
                        blackListData: res.data.data.content,
                        totalNum: res.data.data.totalElements
                    })
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            message.error(err ? err : 'link failure！', 2);
        })
    }

    removeBlack = (id) => {
        ConfirmAlert({
            title: "Tips",
            errorMsg: `Are you sure to remove this user from the blacklist?`,//你是否确认将该用户移除黑名单?
            callbackOK: () => {
                api.removeBlack({
                    id
                }).then((res) => {
                    if (res) {
                        if (0 === res.data.code) {
                            this.blackList();
                        } else {
                            MyAlert({errorMsg: res.data.message});
                        }
                    }
                })
            },
            callbackCancel: () => {
            }
        });
    }

    submitPassword = () => {
        this.props.form.validateFields((err, values) => {
            if (!err && values.configValue) {
                ConfirmAlert({
                    title: "Tips",
                    errorMsg: `Are you sure you want to change the store password?`,
                    callbackOK: () => {
                        api.changePassword({...values}).then((res) => {
                            if (res) {
                                if (0 === res.data.code) {
                                    message.success('Successfully!', 3);
                                } else {
                                    MyAlert({errorMsg: res.data.message});
                                }
                            }
                        })

                    },
                    callbackCancel: () => {
                    }
                });
            } else {
                message.info(' Please provide the new store password!', 3);
            }
        })
    }

    pageOnChange(pageNo, pageSize) {
        this.setState({
            pageNo,
            pageSize,
            totalNum: this.state.totalNum
        }, () => {
            this.blackList()
        });
    }

    render() {
        const {form: {resetFields, getFieldDecorator}} = this.props;
        const {blackListData} = this.state;
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 120,
                key: 'name',
                ellipsis: true,
                align: 'center',
                render: (text, record) => (
                    <div>
                        {record.name}
                        {'LEADER' === record.type && <span style={{color: 'orange'}}> (StoreOwner)</span>}
                    </div>
                ),
            },
            {
                title: 'WeChat OpenID',
                dataIndex: 'openid',
                width: 120,
                key: 'openid',
                ellipsis: true,
                align: 'center'
            },
            {
                title: 'Setting',
                width: 120,
                dataIndex: 'status',
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text, record) => (
                    <div>
                        <SmileOutlined className="cursor-p link" title="Remove Blacklist" onClick={() => {
                            this.removeBlack(record.id)
                        }}/>
                    </div>
                ),
            }
        ];

        return (
            <HomeLayout>
                {/*<p className="list-title">Change Store Password</p>*/}
                {/*<Row gutter={24} className="flex-r">*/}
                {/*    <Col span={8}>*/}
                {/*        <Form.Item>*/}
                {/*            {*/}
                {/*                getFieldDecorator('configValue', {})(*/}
                {/*                    <Input placeholder="Please provide the new store password"*/}
                {/*                    />*/}
                {/*                )*/}
                {/*            }*/}
                {/*        </Form.Item>*/}
                {/*    </Col>*/}
                {/*    <Col span={8}>*/}
                {/*        <Form.Item>*/}
                {/*            <button className='current-btn'*/}
                {/*                    onClick={() => {*/}
                {/*                        this.submitPassword()*/}
                {/*                    }}*/}
                {/*            >*/}
                {/*                <span>Submit</span>*/}
                {/*            </button>*/}
                {/*            <button className='current-btn bg-gray'*/}
                {/*                // onClick={() => this.props.history.push(RoutePath.StoreList)}*/}
                {/*                    onClick={() => resetFields()}*/}
                {/*            >*/}
                {/*                <span>Cancel</span>*/}
                {/*            </button>*/}
                {/*        </Form.Item>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {this.state.visible ?
                    <ChangePassword show={this.state.visible}
                                    onHide={() => {
                                        this.setState({visible: false})
                                    }}
                    /> : null
                }
                <Row gutter={5} style={{marginBottom: "15px"}}>
                    <button className='current-btn'
                            onClick={() => {
                                this.setState({visible: true})
                            }}
                    >
                        <EditOutlined/>
                        <span>Change Store Password</span>
                    </button>
                </Row>
                <p className="list-title">Blacklist Setting</p>
                <Row gutter={16}>
                    <Col span={24}>
                        <Table size="middle"
                               pagination={false}
                               rowKey="id"
                               columns={columns}
                               dataSource={blackListData}
                               rowClassName={(record, idx) => {
                                   if (idx % 2 === 1)
                                       return 'bg-row';
                               }}
                        />
                    </Col>
                </Row>
                {
                    this.state.blackListData.length > 0 &&
                    <Pagination style={{paddingTop: "25px"}}
                                pageSize={this.state.pageSize}
                                current={this.state.pageNo + 1}
                                total={this.state.totalNum}
                                onChange={(pageNo, pageSize) => this.pageOnChange(
                                    pageNo - 1, pageSize
                                )}
                    />
                }
            </HomeLayout>
        )
    }
}

export default createForm()(ShopConfig);
