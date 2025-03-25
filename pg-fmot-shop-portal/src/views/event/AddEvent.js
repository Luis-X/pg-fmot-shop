/**
 * Created by mp on 2022/7/26.
 */

import React, {useState, useRef} from 'react';
import {Select, Modal, Drawer, Space, Form, Input, Row, Col, message, Button, DatePicker} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";
import {ConfigProvider} from "antd";
import en_GB from 'antd/es/locale/en_GB';
import 'moment/locale/en-gb';
import {AddEventFun} from "./AddEventFun";


const {Option} = Select;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

export function AddEvent({show, onHide, updateList}) {
    const [addUserName, setAddUserName] = useState([]);
    const [form] = Form.useForm();
    const addUserNameFun = (e) => {
        form.validateFields().then((values) => {
            // debugger
        })
    }

    return (
        <React.Fragment>
            <Drawer
                title="Add Event"
                // footer={<div>
                //     <Button style={{backgroundColor: '#7f7f7f'}} onClick={addUserNameFun}>Save</Button>
                //     <Button type='primary' onClick={onHide}>Create Event</Button>
                //     <Button onClick={onHide}>Cancel</Button>
                // </div>}
                width={720}
                visible={show}
                onClose={() => {
                    setAddUserName([])
                    onHide()
                }}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onHide}>Cancel</Button>
                        <Button onClick={addUserNameFun} type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form name="basic"
                      // form={form}
                      labelCol={{span: 6}}
                      wrapperCol={{span: 17}}
                      initialValues={{remember: true}}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                      autoComplete="off">
                    <Form.Item
                        name="name"
                        label="Event Name "
                        rules={[{required: true, message: 'Please input the event name.'}]}
                    >
                        <Input
                            value={addUserName}
                            onChange={(e) => setAddUserName(e)}
                            placeholder="Please input the event name."/>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Event Description"
                        rules={[{required: true, message: 'Please input event description.'}]}
                    >
                        <TextArea rows={4}
                                  maxLength={6}
                                  value={addUserName}
                                  onChange={(e) => setAddUserName(e)}
                                  placeholder="Please input event description."/>
                    </Form.Item>

                    <Form.Item
                        name="eventPeriod"
                        label="Event Period"
                        rules={[{required: false, message: 'Please input event description.'}]}
                    >
                        <ConfigProvider locale={en_GB}>
                            <RangePicker style={{width: "100%"}}
                                         placeholder={['Start Time', 'End Time']}/>
                        </ConfigProvider>
                    </Form.Item>

                    <Form.Item
                        name="couponAmount"
                        label="Issued Coupons Qty"
                        rules={[{required: true, message: 'Please input the amount.'}]}
                    >
                        <Input
                            value={addUserName}
                            onChange={(e) => setAddUserName(e)}
                            placeholder="Please input the amount."/>
                    </Form.Item>

                    <Form.Item
                        name="couponValue"
                        label="Coupon value"
                        rules={[{required: true, message: 'Please input value.'}]}
                    >
                        <Input
                            value={addUserName}
                            onChange={(e) => setAddUserName(e)}
                            placeholder="Please input the value."/>
                    </Form.Item>

                    <Form.Item
                        name="totalProductsQuantity"
                        className='text-package'
                        label={
                            <div>
                                <p>Total Lineup</p>
                                <p>Quantity in Package</p>
                            </div>
                        }
                        rules={[{required: true, message: 'Total Lineup Quantity in Package'}]}
                    >
                        <Input
                            value={addUserName}
                            onChange={(e) => setAddUserName(e)}
                            placeholder="Total Lineup Quantity in Package"/>
                    </Form.Item>

                    <Form.Item
                        name="shopMarketId"
                        label="Market"
                        rules={[{required: true, message: 'Please select'}]}
                    >
                        <Select placeholder="Please select"
                                style={{width: '100%'}}
                        >
                            <Option value='Hong Kong'>Hong Kong</Option>
                            <Option value='Macau'>Macau</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="lineUpGroups"
                        label="Lineup Details"
                        rules={[{required: false, message: 'Please select'}]}
                    >
                        <AddEventFun/>
                    </Form.Item>

                    {/*<Form.List*/}
                    {/*    name="name"*/}
                    {/*    label="Lineup Details"*/}
                    {/*>*/}
                    {/*    {(fields, {add, remove}) => (*/}
                    {/*        <>*/}
                    {/*            {fields.map((field) => (*/}
                    {/*                <Space key={field.id}*/}
                    {/*                       style={{display: 'flex', marginBottom: 8, marginLeft: 20, marginTop: 20}}*/}
                    {/*                       align="baseline"*/}
                    {/*                >*/}
                    {/*                    <Row>*/}
                    {/*                        <Col span={24}>*/}
                    {/*                            <Form.Item label='菜单名称1:'*/}
                    {/*                                       {...field}*/}
                    {/*                                       key={field.id}*/}
                    {/*                                       name={[field.name, 'menuName']}*/}
                    {/*                                       fieldKey={[true, 'menuName']}*/}
                    {/*                                       rules={[{required: true, message: '请填写菜单名称'}]}*/}
                    {/*                            >*/}
                    {/*                                <Input maxLength={30} style={{width: '300px'}} placeholder="菜单名称"/>*/}
                    {/*                            </Form.Item>*/}
                    {/*                        </Col>*/}
                    {/*                    </Row>*/}
                    {/*                    <Row>*/}
                    {/*                        <Col span={24}>*/}
                    {/*                            <Form.Item label='素材ID:'*/}
                    {/*                                       {...field}*/}
                    {/*                                       key={field.id}*/}
                    {/*                                       name={[field.name, 'materialId']}*/}
                    {/*                                       fieldKey={[true, 'materialId']}*/}
                    {/*                                       rules={[{required: true, message: '请填写素材ID'}]}*/}
                    {/*                            >*/}
                    {/*                                <Input maxLength={30} style={{width: '300px'}} placeholder="素材ID"/>*/}
                    {/*                            </Form.Item>*/}
                    {/*                        </Col>*/}
                    {/*                    </Row>*/}

                    {/*                    <MinusCircleOutlined className='removebtn' onClick={() => remove(field.name)}/>*/}
                    {/*                </Space>*/}
                    {/*            ))}*/}

                    {/*            <Form.Item>*/}
                    {/*                <Button style={{width: '800px'}}*/}
                    {/*                        type="dashed"*/}
                    {/*                        onClick={() => add()}*/}
                    {/*                        block*/}
                    {/*                        icon={<PlusOutlined/>}>*/}
                    {/*                    继续添加菜单*/}
                    {/*                </Button>*/}
                    {/*            </Form.Item>*/}
                    {/*        </>*/}
                    {/*    )}*/}
                    {/*</Form.List>*/}
                </Form>
            </Drawer>
        </React.Fragment>
    );
}
