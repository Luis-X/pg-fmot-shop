import React from "react";
import {Table, Drawer, Row, Col} from 'antd';
import {StopOutlined, CheckCircleOutlined, FlagOutlined, FrownOutlined, FileExcelOutlined} from '@ant-design/icons';
import * as api from "../../api/api";
import MyAlert, {ConfirmAlert} from "../../components/MyAlert";

export class StoreOwnerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeName: this.props.storeName,
        };
    }

    static defaultProps = {
        ownerListData: [],
        storeId: '',
        storeName: '',
        show: false,
        onHide: null,
        handleJurisdiction: null,
        handleSetLeader: null,
        handleAddBlack: null,
    };

    componentDidMount() {
        // this.setState({storeName: this.props.storeName})
    }

    jurisdiction = (status, id) => {
        ConfirmAlert({
            title: "Info",
            errorMsg: `Are you sure to modify the permission to ${'NORMAL' === status ? "Suspend" : "Normal】"}?`,
            callbackOK: () => {
                api.employeeChangeStatus({
                    "employeeId": id,
                    "status": 'NORMAL' === status ? 'DISABLE' : 'NORMAL'
                }).then((res) => {
                    if (res) {
                        if (0 === res.data.code) {
                            this.props.handleJurisdiction();
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

    setLeader = (type, id) => {
        ConfirmAlert({
            title: "Info",
            errorMsg: `Are you sure to set this user as the store manager?`,
            callbackOK: () => {
                api.employeeSetLeader({
                    "employeeId": id,
                    "type": 'EMPLOYEE' === type ? 'LEADER' : 'EMPLOYEE'
                }).then((res) => {
                    if (res) {
                        if (0 === res.data.code) {
                            this.props.handleSetLeader()
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

    addBlack = (shopEmployeeId, amUserId) => {
        ConfirmAlert({
            title: "Info",
            errorMsg: `Are you sure to add this user to the blacklist?`,
            callbackOK: () => {
                api.addBlack({
                    shopEmployeeId,
                    amUserId
                }).then((res) => {
                    if (res) {
                        if (0 === res.data.code) {
                            this.props.handleAddBlack()
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

    render() {
        const {show, ownerListData} = this.props;
        const {storeName} = this.state;
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
                        {record.blackListId && <FrownOutlined title="Blacklist" style={{marginRight: 10}}/>}
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
                        {'EMPLOYEE' === record.type ?
                            <FlagOutlined className="cursor-p offset-r15 link" title="Set as StoreOwner"
                                          onClick={() => {
                                              this.setLeader(record.type, record.id)
                                          }}/> :
                            <FlagOutlined style={{color: "#dddddd"}} className="cursor-p offset-r15 link"
                                          title="Set as StoreOwner"/>
                        }
                        {'NORMAL' === text ?
                            <StopOutlined className="offset-r15" style={{color: "red"}} title="Deactivate"
                                          onClick={() => {
                                              this.jurisdiction(record.status, record.id)
                                          }}/> :
                            <CheckCircleOutlined className="cursor-p offset-r15 link" title="Activate" onClick={() => {
                                this.jurisdiction(record.status, record.id)
                            }}/>
                        }
                        <FileExcelOutlined className="cursor-p link" title="Add Blacklist" style={{color: "black"}}
                                           onClick={() => {
                                               this.addBlack(record.id, record.amUserId)
                                           }}/>
                    </div>
                ),
            }
        ];

        return (
            <Drawer
                title="StoreOwner List"
                width={1200}
                visible={show}
                onClose={() => {
                    this.props.onHide()
                }}
                bodyStyle={{paddingBottom: 80}}
            >
                <h4 style={{marginBottom: 10}}>{storeName}</h4>
                <Row gutter={16}>
                    <Col span={24}>
                        <Table size="middle"
                               pagination={false}
                               rowKey="id"
                               columns={columns}
                               dataSource={ownerListData}
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
