import React, {Component} from "react";
import {createForm} from 'rc-form';
import {Table, message, Pagination, Form, Input, Select, Row, Col, Divider, Tag, notification} from 'antd';
import {
    ImportOutlined,
    AppstoreOutlined,
    SearchOutlined,
    ReloadOutlined,
    StopOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    ExportOutlined
} from '@ant-design/icons';
import HomeLayout from "../../common/LayoutStyle";
import * as api from "../../api/api";
import MyAlert, {ConfirmAlert} from "../../components/MyAlert";
import {AddStore} from "./AddStore";
import {StoreOwnerList} from "./StoreOwnerList";
import {ImportStore} from "./ImportStore";
import axios from "axios";
import Dict from "../../config/Dict";

const {Option} = Select;

class StoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingShow: false,
            visible: false,
            ownerVisible: false,
            importVisible: false,
            storeQueryData: null,

            pageNo: 0,
            pageSize: 10,
            totalNum: 10,

            marketData: [],
            shopAreasData: [],
            ownerListData: [],
            storeId: '',
            storeName: ''
        };
    }

    componentDidMount() {
        this.storeList();
        this.marketList();
    }

    storeList = () => {
        const {pageNo, pageSize, storeQueryData} = this.state;
        this.setState({loadingShow: true})

        api.storeList({
            ...storeQueryData,
            "page": pageNo,
            "size": pageSize,
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
            message.error('The network request failed, please try again later!', 2);
        })
    }

    pageOnChange(pageNo, pageSize) {
        this.setState({
            pageNo,
            pageSize,
            totalNum: this.state.totalNum
        }, () => {
            this.storeList()
        });
    }

     /**
     * 导出
     */
     exportAll = () => {
        const _this = this;
        const {pageNo, pageSize} = this.state;
        _this.setState({loadingShow: true})

        this.props.form.validateFields((err, values) => {
            return new Promise(() => {
                const fileName = 'D-Tiger StoreListEmployee'
                axios({
                    url: '/api/admin/employee/export',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'X-Content-Type-Options': 'nosniff',
                        'Pragma': 'no-cache',
                        'Authorization': localStorage.getItem('token') || ''
                    },
                    data: {
                        ...values,
                        "page": pageNo,
                        "size": pageSize
                    },
                    responseType: 'blob'
                })
                    .then((res) => {
                        _this.setState({loadingShow: false})
                        if (res.status === 200) {
                            const blob = new Blob([res.data], {
                                type: 'application/vnd.ms-excel;charset=utf-8'
                            });
                            const objectUrl = URL.createObjectURL(blob);
                            const elink = document.createElement('a');
                            elink.download = `${fileName}.xlsx`;
                            elink.style.display = 'none';
                            elink.href = objectUrl;
                            document.body.appendChild(elink);
                            elink.click();
                            URL.revokeObjectURL(elink.href); // 释放URL 对象
                            document.body.removeChild(elink);

                            notification['success']({
                                message: 'File exported successfully！',
                                description:
                                    'Open Excel to view export details.',
                            });
                        }
                    })
                    .catch(function () {
                        _this.setState({loadingShow: false});
                        message.error('link failure！', 2);
                    })
            })
        })
    }

    marketList = () => {
        api.marketData().then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    this.setState({
                        marketData: res.data.data
                    })
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            this.setState({loadingShow: false})
            message.error('The network request failed, please try again later!', 2);
        })
    }

    jurisdiction = (status, id) => {
        ConfirmAlert({
            title: "Info",
            errorMsg: `Are you sure to modify the permission to ${'NORMAL' === status ? "Suspend" : "Normal"}?`,
            callbackOK: () => {
                api.storeChangeStatus({
                    "id": id,
                    "status": 'NORMAL' === status ? 'DISABLE' : 'NORMAL'
                }).then((res) => {
                    if (res) {
                        if (0 === res.data.code) {
                            this.storeList()
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

    ownerList = (id, name) => {
        api.ownerList({
            "shopId": id,
        }).then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    this.setState({
                        ownerListData: res.data.data,
                        ownerVisible: true,
                        storeId: id,
                        storeName: name
                    })
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            message.error(err ? err : 'Link failed！', 2);
        })
    }

    selectMarket = (value) => {
        let {marketData} = this.state;
        let shopAreasData = []
        for (const key in marketData) {
            if (marketData[key].id === value) {
                shopAreasData = marketData[key].shopAreas;
                break;
            }
        }
        this.setState({
            shopAreasData: shopAreasData || [],
        })
    }

    uploadOwnerList = () => {
        let {storeId} = this.state
        this.ownerList(storeId)
    }

    onFinish = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({storeQueryData: values}, () => {
                    this.storeList();
                })
            }
        });
    }

    render() {
        const {marketData, shopAreasData} = this.state
        const {form: {resetFields, getFieldDecorator}} = this.props
        const columns = [
            {
                title: 'Store ID',
                dataIndex: 'id',
                width: 140,
                key: 'id',
                ellipsis: true,
                align: 'center'
            },
            {
                title: 'Store Name',
                dataIndex: 'name',
                width: 120,
                key: 'name',
                ellipsis: true,
                align: 'center'
            },
            {
                title: 'Store Market',
                dataIndex: 'shopMarket',
                width: 70,
                key: 'shopMarket',
                align: 'center',
                ellipsis: true,
                render: (text) =>
                    <div>
                        {text.name}
                    </div>
            },
            {
                title: 'Store District',
                dataIndex: 'shopArea',
                width: 80,
                key: 'shopArea',
                align: 'center',
                ellipsis: true,
                render: (text) =>
                    <div>
                        {text.name}
                    </div>
            },
            {
                title: 'Store Status',
                dataIndex: 'status',
                width: 70,
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text) =>
                    <>
                        <Tag color={'DISABLE' === text ? 'red' : 'green'}>{Dict.getValue('storeLock', text, '')}</Tag>
                    </>
            },
            {
                title: 'Setting',
                width: 50,
                dataIndex: 'status',
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text, record) => (
                    <div>
                        <TeamOutlined className="cursor-p offset-r15 link" title="StoreOwner List" onClick={() => {
                            this.ownerList(record.id, record.name)
                        }}/>
                        {'NORMAL' === text ?
                            <StopOutlined className="cursor-p" style={{color: "red"}} title="Deactivate"
                                          onClick={() => {
                                              this.jurisdiction(text, record.id)
                                          }}/> :
                            <CheckCircleOutlined className="cursor-p" style={{color: "#1890ff"}} title="Activate"
                                                 onClick={() => {
                                                     this.jurisdiction(text, record.id)
                                                 }}/>
                        }
                    </div>
                ),
            }
        ];

        return (
            <HomeLayout>
                <AddStore show={this.state.visible}
                          onHide={() => {
                              this.setState({visible: false})
                          }}
                          marketData={marketData}
                          updateList={() => {
                              resetFields();
                              this.setState({
                                  pageNo: 0,
                              }, () => this.storeList())
                          }}
                />
                {
                    this.state.ownerVisible ?
                        <StoreOwnerList
                            show={this.state.ownerVisible}
                            ownerListData={this.state.ownerListData}
                            storeId={this.state.storeId}
                            storeName={this.state.storeName}
                            onHide={() => {
                                this.setState({ownerVisible: false})
                            }}
                            handleJurisdiction={this.uploadOwnerList}
                            handleSetLeader={this.uploadOwnerList}
                            handleAddBlack={this.uploadOwnerList}
                        /> : null
                }

                <ImportStore show={this.state.importVisible}
                             onHide={() => {
                                 this.setState({importVisible: false})
                             }}
                    // marketData={marketData}
                             updateList={() => {
                                 resetFields();
                                 this.setState({
                                     pageNo: 0,
                                 }, () => this.storeList())
                             }}
                />
                <p className="list-title">Store List</p>
                <Divider style={{margin: '3px 0'}}/>
                <div className="common-list">
                    <div className="item1">
                        <Form className="user_search"
                              onFinish={() => {
                                  this.onFinish()
                              }}>
                            <div className="flex1">
                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item>
                                            {
                                                getFieldDecorator('searchValue', {})(
                                                    <Input placeholder="Please input Store Name or Store ID"
                                                    />
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item>
                                            {
                                                getFieldDecorator('shopMarketId', {})(
                                                    <Select placeholder="Please select the Store Market"
                                                            onSelect={this.selectMarket}
                                                    >
                                                        {
                                                            marketData.map((item, index, arr) => (
                                                                <Option key={index}
                                                                        value={item.id}
                                                                >{item.name}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item>
                                            {
                                                getFieldDecorator('shopAreaId', {})(
                                                    <Select placeholder="Please select the Store District"
                                                            onChange={this.selectShopAreas}
                                                    >
                                                        {
                                                            shopAreasData.map((areaItem, index, arr) => (
                                                                <Option key={index}
                                                                        value={areaItem.id}
                                                                >{areaItem.name}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <div className="btn-width" style={{width: "245px"}}>
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
                                            // shopAreaId: '',
                                            // shopMarketId: '',
                                            shopAreasData: []
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
                                <AppstoreOutlined/>
                                <span>Add Store</span>
                            </button>
                            <button className='current-btn'
                                    onClick={() => {
                                        this.setState({importVisible: true})
                                    }}
                            >
                                <ImportOutlined/>
                                <span>Import Store</span>
                            </button>
                            <button className='current-btn'
                                    onClick={() => {
                                        this.setState({
                                            pageNo: 0,
                                            // pageSize: 10,
                                        },()=>{
                                            this.exportAll()
                                        })
                                    }}
                            >
                                <ExportOutlined/>
                                <span>Export</span>
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

export default createForm()(StoreList);
