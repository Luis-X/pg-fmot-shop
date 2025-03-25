/**
 * Created by mp on 2022/7/26.
 */
import React, {useState, useEffect} from 'react';
import {Drawer, Form, message, Button, ConfigProvider} from 'antd';
import {
    ProCard,
    ProForm,
    ProFormGroup,
    ProFormList,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormDateRangePicker,
    ProFormDigit,
    // ProFormDigitRange
} from '@ant-design/pro-components';
import '@ant-design/pro-components/dist/components.css';
import {CloseOutlined} from '@ant-design/icons';
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";
import en_GB from "antd/es/locale/en_GB";
import moment from 'moment';

export function AddEventFun({eventId, eventStatus, show, onHide, updateList}) {
    const [marketData, setMarketData] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    // useEffect(()=>{
    //     return ()=>{
    //         console.log("WillUnmount")
    //     }
    // })

    useEffect(() => {
        async function fetchData() {
            await marketDataFun();
        }

        fetchData();
    }, []);

    /**
     * eventDetail数据准备
     */
    const eventDetailFun = async () => {
        let evenDetail = {}
        let lineUpGroups = []
        let lineupIds = [];
        try {
            const res = await api.eventDetail(eventId);
            if (res) {
                if (0 === res.data.code) {
                    evenDetail = res.data.data;
                    evenDetail.eventPeriod = Object.values(evenDetail.eventPeriod);
                    for (let i in evenDetail.lineUpGroups) {
                        for (let j in evenDetail.lineUpGroups[i].lineupIds) {
                            lineupIds.push({
                                'lId': evenDetail.lineUpGroups[i].lineupIds[j]
                            })
                        }
                        lineUpGroups.push(
                            {
                                "name": evenDetail.lineUpGroups[i].name,
                                "writeOffQuantity": evenDetail.lineUpGroups[i].writeOffQuantity,
                                "lineupIds": lineupIds
                            }
                        )
                        lineupIds = [];
                    }
                    evenDetail.lineUpGroups = lineUpGroups;
                    // values.id = null;
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        } catch (err) {
            message.error(err ? err : 'link failure！', 2);
        }
        console.log("---evenDetail---", evenDetail)
        return evenDetail;
    };

    /**
     * marketData数据准备
     */
    const marketDataFun = () => {
        let marketData = [];
        api.marketData().then((res) => {
            if (res) {
                if (0 === res.data.code) {
                    if (res.data.data.length > 0) {
                        for (let i in res.data.data) {
                            marketData.push({
                                label: res.data.data[i].name,
                                value: res.data.data[i].id
                            });
                        }
                        setMarketData(marketData || [])
                    }
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            message.error(err ? err : 'link failure！', 2);
        })
    };

    /**
     * form.validateFields数据准备
     */
    const saveAndCreateEvent = (type) => {
        setLoading(true)
        form.validateFields().then((values) => {
            let lineUpGroups = []
            let lineupIds = [];

            for (let i in values.lineUpGroups) {
                for (let j in values.lineUpGroups[i].lineupIds) {
                    lineupIds.push(values.lineUpGroups[i].lineupIds[j].lId);
                }
                lineUpGroups.push(
                    {
                        "name": values.lineUpGroups[i].name,
                        "writeOffQuantity": values.lineUpGroups[i].writeOffQuantity,
                        "lineupIds": lineupIds
                    }
                )
                lineupIds = [];
            }
            values.eventPeriod = {
                // "beginDate": values.eventPeriod[0],
                // "endDate": values.eventPeriod[1],
                "beginDate": moment(new Date(values.eventPeriod[0])).format('YYYY-MM-DD'),
                "endDate": moment(new Date(values.eventPeriod[1])).format('YYYY-MM-DD'),
            };
            values.lineUpGroups = lineUpGroups;
            if (eventId && 'INIT' === eventStatus) {
                values.id = eventId;
            } else if (!eventId && !eventStatus) {
                values.id = null;
            }
            if ('save' === type) {
                saveFun(values)
            } else if ('create' === type) {
                createEventFun(values)
            }
        }).catch((error) => {
            setLoading(false);
        })
    };

    /**
     * Save折扣
     */
    const saveFun = (values) => {
        api.saveEvent({
            ...values,
        }).then((res) => {
            if (res) {
                setLoading(false)
                if (0 === res.data.code) {
                    onHide()
                    updateList()
                    message.success('Added successfully!', 3);
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            setLoading(false)
            message.error(err ? err : 'link failure！', 2);
        })
    };

    /**
     * create折扣
     */
    const createEventFun = (values) => {
        api.publishEvent({
            ...values,
        }).then((res) => {
            if (res) {
                setLoading(false)
                if (0 === res.data.code) {
                    onHide()
                    updateList()
                    message.success('Added successfully!', 3);
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        }).catch((err) => {
            setLoading(false)
            message.error(err ? err : 'link failure！', 2);
        })
    };


    /**
     * Lineup ID下拉框防抖异步搜索
     */
    const requestLineup = async (params) => {
        let requestData = [];
        try {
            const res = await api.lineupList({
                "searchKey": params ? params.keyWords : null,
                "page": 0,
                "size": 500
            });
            if (res) {
                if (0 === res.data.code) {
                    if (res.data.data.content.length > 0) {
                        for (let i in res.data.data.content) {
                            requestData.push({
                                // name:res.data.data.content[i].name,
                                label: res.data.data.content[i].name + '-' + res.data.data.content[i].id,
                                value: res.data.data.content[i].id
                            });
                        }
                    }
                } else {
                    MyAlert({errorMsg: res.data.message});
                }
            }
        } catch (err) {
            message.error(err ? err : 'link failure！', 2);
        }
        return requestData;
    };

    /**
     * Form布局
     */
    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 17},
    };

    return (
        <React.Fragment>
            <Drawer
                title={
                    eventStatus ?
                        'PUBLISHED' === eventStatus ? 'Event Info' : 'Edit Event'
                        : 'Add Event'
                }
                footer={(eventStatus && 'PUBLISHED' === eventStatus) ? null :
                    <div className='create-event-btn'>
                        <Button type="dashed"
                                disabled={Loading}
                                // style={{backgroundColor: '#7f7f7f'}}
                                onClick={() => {
                                    saveAndCreateEvent('save')
                                }}>
                            Save
                        </Button>
                        <Button type='primary'
                                disabled={Loading}
                                onClick={() => {
                                    saveAndCreateEvent('create')
                                }}>
                            Create Event
                        </Button>
                        <Button onClick={onHide}>Cancel</Button>
                    </div>
                }
                width={720}
                visible={show}
                onClose={() => {
                    onHide()
                }}
                bodyStyle={{paddingBottom: 80}}
            >
                <ProForm form={form}
                         className='add-event-porForm'
                         disabled={eventStatus && 'PUBLISHED' === eventStatus}
                         {...formItemLayout}
                         layout='LAYOUT_TYPE_HORIZONTAL'
                    // layout='horizontal'//horizontal
                         name='sonForm'
                         submitter={{
                             submitButtonProps: {
                                 style: {
                                     display: 'none',  // 隐藏提交按钮
                                 },
                             },
                             resetButtonProps: { // 配置按钮的属性
                                 style: {
                                     display: 'none',   // 隐藏重置按钮
                                 },
                             }
                         }}
                         params={{}} //网络请求参数
                         request={eventId ? eventDetailFun : null}
                >
                    <ProFormText name="name"
                                 label="Event Name"
                                 rules={[{required: true, message: 'Please input the event name.'}]}
                                 placeholder="Please input the event name."
                    />
                    <ProFormTextArea name="description"
                                     label="Event Description"
                        // rules={[{required: true, message: 'Please input event description.'}]}
                                     placeholder={(eventStatus && 'PUBLISHED' === eventStatus) || "Please input event description."}/>
                    <div className='add-event-picker'>
                        <ConfigProvider locale={en_GB}>
                            <ProFormDateRangePicker name="eventPeriod"
                                                    label="Event Period"
                                                    rules={[{
                                                        required: true,
                                                        message: 'Please input event Period.'
                                                    }]}
                                                    placeholder={['Start Time', 'End Time']}
                            />
                        </ConfigProvider>
                    </div>

                    <ProFormDigit name="couponAmount"
                                  label="Issued Coupons Qty"
                                  rules={[{required: true, message: 'Please input the amount.'}]}
                                  placeholder="Please input the amount."
                                  min={1}
                                  max={100000}
                                  fieldProps={{precision: 0}}
                        // precision={0}
                    />
                    <ProFormDigit name="couponValue"
                                  label="Coupon value (HKD$)"
                                  rules={[{required: true, message: 'Please input value.'}]}
                                  placeholder="Please input the value."
                                  min={0}
                                  fieldProps={{precision: 2}}
                    />
                    <div className='text-package'>
                        <ProFormDigit
                            name="totalProductsQuantity"
                            label={
                                <div>
                                    <p>Total Lineup</p>
                                    <p>Quantity in Package</p>
                                </div>
                            }
                            rules={[{required: true, message: 'Total Lineup Quantity in Package'}]}
                            placeholder="Total Lineup Quantity in Package."
                            min={1}
                            // max={10}
                            fieldProps={{precision: 0}}
                        />
                    </div>
                    <ProFormSelect
                        options={marketData}
                        name="shopMarketId"
                        label="Market"
                        rules={[{required: true, message: 'Please select.'}]}
                        placeholder="Please select."
                    />
                    <ProFormList
                        className={!eventStatus || (eventStatus && 'INIT' === eventStatus) ? "lineup-groups pro-list" : 'lineup-groups pro-list-INIT'}
                        name="lineUpGroups"
                        label="Lineup Details"
                        copyIconProps={false} //隐藏复制这行
                        creatorButtonProps={!eventStatus || (eventStatus && 'INIT' === eventStatus) ? { //按钮文字
                            creatorButtonText: 'Add Group',
                        } : false}
                        // creatorButtonProps={false}
                        deleteIconProps={!eventStatus || (eventStatus && 'INIT' === eventStatus) ? {
                            Icon: CloseOutlined,
                            tooltipText: 'Delete group',
                        } : false}
                        itemRender={({listDom, action}, {record}) => {
                            return (
                                <ProCard bordered
                                         extra={action}
                                         style={{marginBottom: 8}}
                                >
                                    {listDom}
                                </ProCard>
                            );
                        }}
                        initialValue={[{name: ''}]}
                    >
                        <ProFormGroup>
                            <ProFormText
                                width="md"
                                name="name"
                                label="Group Name"
                                rules={[{required: true, message: 'Please input the Group Name.'}]}
                                placeholder="Please input the Group Name."
                            />
                        </ProFormGroup>
                        <div>
                            <span className='lineup-title'>* </span>
                            Lineup：
                        </div>
                        <ProFormList
                            width="md"
                            name="lineupIds"
                            creatorButtonProps={!eventStatus || (eventStatus && 'INIT' === eventStatus) ? { //按钮文字
                                creatorButtonText: 'Add Lineup',
                            } : false}
                            copyIconProps={false}//隐藏复制这行
                            deleteIconProps={!eventStatus || (eventStatus && 'INIT' === eventStatus) ? {
                                tooltipText: 'Delete Lineup',
                            } : false}
                            initialValue={[
                                {
                                    lId: null,
                                },
                            ]}
                        >
                            <ProFormGroup key="requestLineup">
                                <ProFormSelect style={{width: 200}}
                                               width="md"
                                               showSearch
                                               debounceTime={500}
                                               name="lId"
                                    // label="Lineup"
                                               valueType="select"
                                               request={requestLineup}
                                    // fieldProps={{
                                    //     optionItemRender(item) {
                                    //         return item.label + ' - ' + item.value;
                                    //     },
                                    // }}
                                               placeholder="Please input the lineup ID or lineup name to search."
                                               rules={[{
                                                   required: true,
                                                   message: 'Please input the lineup ID or lineup name to search.'
                                               }]}
                                />
                            </ProFormGroup>
                        </ProFormList>
                        <ProFormGroup
                            style={{marginTop: !eventStatus || (eventStatus && 'INIT' === eventStatus) ? '0px' : '-25px'}}>
                            <ProFormDigit
                                width="md"
                                name="writeOffQuantity"
                                label="Minimum Lineup Quantity"
                                rules={[{
                                    required: true,
                                    message: 'Please input the minimum products quantity within the group.'
                                }]}
                                placeholder="Please input the minimum products quantity within the group."
                                min={1}
                                // max={10}
                                fieldProps={{precision: 0}}
                            />
                        </ProFormGroup>
                    </ProFormList>
                </ProForm>
            </Drawer>
        </React.Fragment>
    );
}
