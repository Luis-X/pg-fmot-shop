/**
 * Created by mp on 2022/7/26.
 */

import React, {Component} from "react";
import {createForm} from 'rc-form';
import {Divider, Table, message, Pagination, Select, Form, Input, Row, Col, Tag, notification, Tooltip} from 'antd';
import {SearchOutlined, ReloadOutlined, PlusSquareOutlined} from '@ant-design/icons';
import HomeLayout from "../../common/LayoutStyle";
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";
import moment from 'moment';
import {AddEventFun} from "./AddEventFun";
import axios from 'axios'
import Dict from "../../config/Dict";
// import $ from "jquery";
// import {exportByEventId, setResponseType} from "../../api/api";
const {Option} = Select;

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingShow: false,
            visible: false,
            eventID: '',
            eventStatus: '',
            queryData: null,

            pageNo: 0,
            pageSize: 10,
            totalNum: 10
        };
    }

    async componentDidMount() {
        this.eventList()
    }

    /**
     * 下载
     */
    pointImportTemplateUrl = (eventId) => {
        const _this = this;
        _this.setState({loadingShow: true})
        return new Promise(() => {
            const fileName = 'Write off details'
            axios({
                url: '/api/admin/couponWriteLog/exportByEventId',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-Content-Type-Options': 'nosniff',
                    'Pragma': 'no-cache',
                    'Authorization': localStorage.getItem('token') || ''
                },
                data: {'eventId': eventId},
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
    }

    /**
     * 列表数据请求
     */
    eventList = () => {
        const {pageNo, pageSize, queryData} = this.state;
        this.setState({loadingShow: true});

        api.eventList({
            ...queryData,
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

    /**
     * 翻页OnChange
     */
    pageOnChange(pageNo, pageSize) {
        this.setState({
            pageNo,
            pageSize,
            totalNum: this.state.totalNum
        }, () => {
            this.eventList()
        });
    }

    /**
     * Form表单的submit
     */
    onFinish = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({queryData: values}, () => {
                    this.eventList();
                })
            }
        });
    }

    render() {
        const {form: {resetFields, getFieldDecorator}} = this.props;
        const columns = [
            {
                title: 'EventID',
                width: 115,
                dataIndex: 'id',
                key: 'id',
                align: 'center',
            },
            {
                title: 'Event Name',
                width: 110,
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: 'Event Created Time',
                dataIndex: 'syncCouponDate',
                width: 80,
                key: 'syncCouponDate',
                align: 'center',
                render: (text) => (
                    <>
                        {text ? moment(text).format('YYYY-MM-DD') : '--'}
                    </>
                ),
            },
            {
                title: 'Event Status',
                dataIndex: 'status',
                width: 85,
                key: 'status',
                ellipsis: true,
                align: 'center',
                render: (text) =>
                    <Tag color={'INIT' === text ? '#f50' : '#87d068'}>
                        {Dict.getValue('eventStatus', text, '')}
                    </Tag>

            },
            {
                title: 'Issued Coupons Qty',
                dataIndex: 'couponAmount',
                width: 80,
                key: 'couponAmount',
                align: 'center',
            },
            {
                title: 'Event Period',
                dataIndex: 'Period',
                width: 150,
                key: 'Period',
                ellipsis: true,
                align: 'center',
                render: (text, record) => (
                    <>
                        {
                            <div>
                                {moment(record.beginDate).format('YYYY-MM-DD')} <span
                                style={{fontWeight: 'bold'}}>to</span> {moment(record.endDate).format('YYYY-MM-DD')}
                            </div>

                        }
                    </>
                ),
            },
            {
                title: 'Coupon Value',
                dataIndex: 'couponValue',
                width: 80,
                key: 'couponValue',
                // ellipsis: true,
                align: 'center'
            },
            {
                title: 'Store Redemption Qty',
                dataIndex: 'confirmedQuantity',
                width: 80,
                key: 'confirmedQuantity',
                // ellipsis: true,
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
                    <>
                        <Tooltip title="show">
                        <span className='event-setting'
                              onClick={() => {
                                  this.setState({
                                      visible: true,
                                      eventID: record.id,
                                      eventStatus: record.status,
                                  })
                              }}>
                            show
                        </span>
                        </Tooltip>
                        <Tooltip title="Export Redeem Detail">
                            {
                                record.confirmedQuantity > 0 ?
                                    <span className='event-setting'
                                          onClick={() => {
                                              this.pointImportTemplateUrl(record.id)
                                          }}>
                                           Export Redeem Detail
                                    </span> :
                                    <span className='event-setting' disabled>Export Redeem Detail</span>
                            }
                        </Tooltip>
                    </>
                ),
            }
        ];
        return (
            <HomeLayout>
                {
                    this.state.visible ?
                        <AddEventFun eventId={this.state.eventID}
                                     eventStatus={this.state.eventStatus}
                                     show={this.state.visible}
                                     onHide={() => {
                                         this.setState({visible: false})
                                     }}
                                     updateList={() => {
                                         resetFields();
                                         this.setState({
                                             pageNo: 0,
                                         }, () => this.eventList())
                                     }}
                        /> : null
                }
                <p className="list-title">Event</p>
                <Divider style={{margin: '3px 0'}}/>
                <div className="common-list">
                    <div className="item1">
                        <Form name="user_search"
                              onFinish={() => {
                                  this.onFinish()
                              }}
                        >
                            <Row gutter={24}>
                                <Col span={7}>
                                    <Form.Item>
                                        {
                                            getFieldDecorator('searchValue', {})(
                                                <Input placeholder="Please input the event name or id"
                                                       maxLength={50}
                                                />
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={7}>
                                    <Form.Item>
                                        {
                                            getFieldDecorator('status', {})(
                                                <Select placeholder="Please select the event status"
                                                    // value={null}
                                                        style={{width: '100%'}}
                                                >
                                                    <Option value='PUBLISHED'>Created</Option>
                                                    <Option value='INIT'>To Be Created</Option>
                                                    <Option value={null}>ALL</Option>
                                                </Select>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                                <div className="btn-width">
                                    <button className='current-btn'
                                            onClick={() => {
                                                this.setState({pageNo: 0, queryFlg: true}, () => {
                                                    // this.eventList()
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
                                                // this.eventList()
                                            })}
                                    >
                                        <ReloadOutlined/>
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </Row>
                        </Form>
                    </div>
                    <div className="item2">
                        <Row gutter={5} style={{marginBottom: "15px"}}>
                            <button className='current-btn'
                                    onClick={() => {
                                        this.setState({
                                            visible: true,
                                            eventID: '',
                                            eventStatus: '',

                                        })
                                    }}
                            >
                                <PlusSquareOutlined/>
                                <span>Add Event</span>
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

export default createForm()(Event);
