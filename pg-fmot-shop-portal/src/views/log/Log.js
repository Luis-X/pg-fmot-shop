/**
 * Created by mp on 2022/7/26.
 */

import React, {Component} from 'react';
import {ProTable} from '@ant-design/pro-components';
import '@ant-design/pro-components/dist/components.css';
import {createForm} from 'rc-form';
import {message, Pagination, Form, Input, Row, Col, Divider, DatePicker, ConfigProvider} from 'antd';
import {SearchOutlined, ReloadOutlined} from '@ant-design/icons';
import HomeLayout from "../../common/LayoutStyle";
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";
import en_GB from "antd/es/locale/en_GB";
import moment from "moment";

// import moment from "moment";
const {RangePicker} = DatePicker;

class Log extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loadingShow: false,
            visible: false,
            logQueryData: null,

            pageNo: 0,
            pageSize: 10,
            totalNum: 10
        };
    }

    async componentDidMount() {
        this.logList()
    }

    logList = () => {
        const {pageNo, pageSize, logQueryData} = this.state;
        this.setState({loadingShow: true})
        if (logQueryData && logQueryData.queryDate) {
            logQueryData.beginDate = moment(new Date(logQueryData.queryDate[0])).format('YYYY-MM-DD');
            logQueryData.endDate = moment(new Date(logQueryData.queryDate[1])).format('YYYY-MM-DD');
            delete logQueryData.queryDate;
        }

        api.logList({
            ...logQueryData,
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
            this.logList()
        });
    }

    onFinish = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({logQueryData: values}, () => {
                    this.logList()
                })
            }
        });
    }

    // jsonFormat = (format) => {
    //     let msg = '', pos = 0, prevChar = '', outOfQuotes = true;
    //     for (let i = 0; i < format.length; i++) { //循环每一个字符
    //         let char = format.substring(i, i + 1);  //获取到该字符
    //         if (char == '"' && prevChar != '\\') {  //如果转移
    //             outOfQuotes = !outOfQuotes;
    //         } else if ((char == '}' || char == ']') && outOfQuotes) {   //如果是关闭
    //             msg += "<br/>";
    //             pos--;
    //             for (let j = 0; j < pos; j++) msg += '    ';
    //         }
    //         msg += char;
    //         if ((char == ',' || char == '{' || char == '[') && outOfQuotes) {
    //             msg += "<br/>";
    //             if (char == '{' || char == '[') pos++;
    //             for (let k = 0; k < pos; k++) msg += '    ';
    //         }
    //         prevChar = char;
    //     }
    //     return <div>
    //         <div dangerouslySetInnerHTML={{__html: msg}}/>
    //     </div>;
    // }

    render() {
        const {form: {resetFields, getFieldDecorator}} = this.props
        const columns = [
            {
                title: 'Execution Timepoint',
                dataIndex: 'createDate',
                width: 80,
                key: 'createDate',
                ellipsis: true,
                align: 'center',
                valueType: 'dateTime',
                // render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: 'Execution Account',
                dataIndex: 'userName',
                width: 80,
                key: 'userName',
                ellipsis: true,
                align: 'center',
                render: (text, record) =>
                    <>{record.userName || record.openid}</>
            },
            {
                title: 'Execution Menu',
                dataIndex: 'categoryName',
                width: 110,
                key: 'categoryName',
                ellipsis: true,
                align: 'center',
                render: (text, record) =>
                    <>
                        <p style={{fontWeight: 'bold'}}>
                            {record.categoryName}
                        </p>
                        <p> {record.operation}</p>
                        {/*{record.categoryName}->{record.operation}*/}
                    </>
            },
            {
                title: 'Execution Description',
                dataIndex: 'params',
                width: 160,
                key: 'params',
                // ellipsis: true,
                // align: 'center',
                className: 'execution',
                valueType: 'jsonCode',
                render: (text, record) =>
                    <>
                        {/*{*/}
                        {/*    "ssoLogin" === record.operation && JSON.parse(record.params).length <= 0 ?*/}
                        {/*        "Login" : text*/}
                        {/*}*/}
                        {
                            JSON.parse(record.params).length <= 0 ?
                                "ssoLogin" === record.operation ? "Login" : "Logout"
                                : text
                        }
                    </>
            },
        ];

        return (
            <HomeLayout>
                <p className="list-title">Log</p>
                <Divider style={{margin: '3px 0'}}/>
                <div className="common-list">
                    <div className="item1">
                        <Form className="user_search" onFinish={() => {
                            this.onFinish()
                        }}>
                            <div className="flex1">
                                <Row gutter={24}>
                                    <Col span={7}>
                                        <Form.Item>
                                            {
                                                getFieldDecorator('userName', {})(
                                                    <Input placeholder="Please input the user account"
                                                    />
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item>
                                            {
                                                getFieldDecorator('searchKey', {})(
                                                    <Input placeholder="Please input the key word"
                                                    />
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        {/*<ConfigProvider locale={en_GB}>*/}
                                        {/*    <Form.Item>*/}
                                        {/*        {*/}
                                        {/*            getFieldDecorator('queryDate', {})(*/}
                                        {/*                <DatePicker className="width100"*/}
                                        {/*                            placeholder="Please select query date range"/>*/}
                                        {/*            )*/}
                                        {/*        }*/}
                                        {/*    </Form.Item>*/}
                                        {/*</ConfigProvider>*/}
                                        <ConfigProvider locale={en_GB}>
                                            <Form.Item>
                                                {
                                                    getFieldDecorator('queryDate', {})(
                                                        <RangePicker style={{width: "100%"}}
                                                                     placeholder={['Query start date', 'Query end date']}/>
                                                    )
                                                }
                                            </Form.Item>
                                        </ConfigProvider>
                                    </Col>
                                </Row>
                            </div>
                            <div className="btn-width" style={{width: "230px"}}>
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
                        {/*<Table size="middle"*/}
                        {/*       loading={this.state.loadingShow}*/}
                        {/*       pagination={false}*/}
                        {/*       rowKey="id"*/}
                        {/*       columns={columns}*/}
                        {/*       dataSource={this.state.data}*/}
                        {/*       rowClassName={(record, idx) => {*/}
                        {/*           if (idx % 2 === 1)*/}
                        {/*               return 'bg-row';*/}
                        {/*       }}*/}
                        {/*/>*/}
                        <ProTable size="middle"
                                  loading={this.state.loadingShow}
                                  pagination={false}
                                  rowKey="id"
                                  columns={columns}
                                  dataSource={this.state.data}
                                  rowClassName={(record, idx) => {
                                      if (idx % 2 === 1)
                                          return 'bg-row';
                                  }}
                                  toolBarRender={false}
                                  search={false}
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

export default createForm()(Log);
