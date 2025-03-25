import React, {Component} from "react";
import {createForm} from 'rc-form';
import {Table, message, Pagination, Form, Input, Row, Col, Tag, Divider} from 'antd';
import {
    UsergroupAddOutlined,
    SearchOutlined,
    ReloadOutlined,
    StopOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import HomeLayout from "../../common/LayoutStyle";
import * as api from "../../api/api";
import MyAlert, {ConfirmAlert} from "../../components/MyAlert";
import {AddUser} from "./AddUser";
import Dict from "../../config/Dict";

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingShow: false,
            visible: false,
            userQueryData: null,

            pageNo: 0,
            pageSize: 10,
            totalNum: 10
        };
    }

    async componentDidMount() {
        this.userList()
    }

    jurisdiction = (status, id) => {
        ConfirmAlert({
            title: "Info",
            errorMsg: `Are you sure to modify the permission to ${'NORMAL' === status ? "Suspend" : "Normal"}?`,
            callbackOK: () => {
                api.changeStatus({
                    "adminUserId": id,
                    "status": 'NORMAL' === status ? 'LOCK' : 'NORMAL'
                }).then((res) => {
                    if (res) {
                        if (0 === res.data.code) {
                            this.userList()
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

    userList = () => {
        const {pageNo, pageSize, userQueryData} = this.state;
        this.setState({loadingShow: true});
        api.userList({
            ...userQueryData,
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
            message.error(err ? err : 'The network request failed, please try again later!', 2);
        })
    }

    pageOnChange(pageNo, pageSize) {
        this.setState({
            pageNo,
            pageSize,
            totalNum: this.state.totalNum
        }, () => {
            this.userList()
        });
    }

    onFinish = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({userQueryData: values}, () => {
                    this.userList();
                })
            }
        });
    }

    render() {
        const {form: {resetFields, getFieldDecorator}} = this.props
        const columns = [
            {
                title: 'PG Account',
                dataIndex: 'userName',
                width: 150,
                key: 'userName',
                ellipsis: true,
                align: 'center'
            },
            {
                title: 'User Status',
                dataIndex: 'status',
                width: 120,
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text) =>
                    <>
                        <Tag color={'LOCK' === text ? 'red' : 'green'}>{Dict.getValue('userLock', text, '')}</Tag>
                    </>
            },
            {
                title: 'User Role',
                dataIndex: 'roleName',
                width: 50,
                key: 'roleName',
                align: 'center',
                ellipsis: true
            },
            {
                title: 'Setting',
                width: 120,
                dataIndex: 'status',
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text, record) => (
                    <div style={{cursor: 'pointer'}}
                         onClick={() => {
                             this.jurisdiction(text, record.id)
                         }}>
                        {'NORMAL' === text ?
                            <StopOutlined style={{color: "red"}} title="Deactivate"/> :
                            <CheckCircleOutlined style={{color: "#1890ff"}} title="Activate"/>
                        }
                    </div>
                ),
            }
        ];

        return (
            <HomeLayout>
                <AddUser show={this.state.visible}
                         onHide={() => {
                             this.setState({visible: false})
                         }}
                         updateList={() => {
                             resetFields();
                             this.setState({
                                 pageNo: 0,
                             }, () => {
                                 this.userList()
                             })
                         }}
                />
                <p className="list-title">User</p>
                <Divider style={{margin: '3px 0'}}/>
                <div className="common-list">
                    <div className="item1">
                        <Form className="user_search" onFinish={this.onFinish}>
                            <div className="flex1">
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item>
                                            {
                                                getFieldDecorator('userName', {})(
                                                    <Input placeholder="Please input PG account(shortname)"
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
                                            this.setState({pageNo: 0}, () => {
                                                // this.userList()
                                            })
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
                                            // this.userList()
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
                                <UsergroupAddOutlined/>
                                <span>Add User</span>
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
                                // scroll={{ x: 1366}}
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

export default createForm()(UserManage);
