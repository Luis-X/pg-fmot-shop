import React, {useState} from 'react';
import {Form, Modal, Input, Drawer, Row, Col, Button, message} from 'antd';
import * as api from "../../api/api";
// import MyAlert from "../../components/MyAlert";

export function ChangePassword({show, onHide}) {
    const [form] = Form.useForm();
    const [Loading, setLoading] = useState(false);
    const addStoreFun = () => {
        form.validateFields().then((values) => {
            setLoading(true)
            api.changePasswordNew({...values}).then((res) => {
                if (res) {
                    setLoading(false);
                    if (0 === res.data.code) {
                        message.success('Successfully!', 3);
                    } else {
                        Modal.info({
                            title: 'Tips',
                            content: res.data.message,
                        });
                    }
                }
            }).catch((err) => {
                setLoading(false)
                message.error(err ? err : 'link failure！', 2);
            })
            // if (values.new === values.confirm) {
            //
            // } else {
            //     Modal.info({
            //         title: 'Tips',
            //         content: 'The passwords entered twice are different！',
            //     });
            // }
        })
    }
    return (
        <React.Fragment>
            <Form form={form}
                  layout="vertical"
                  labelCol={{span: 6}}
                  wrapperCol={{span: 17}}
                  autoComplete="off"
            >
                <Drawer
                    title="Change Store Password"
                    width={720}
                    visible={show}
                    onClose={() => {
                        onHide()
                    }}
                    bodyStyle={{paddingBottom: 80}}
                    footer={
                        <div className='create-event-btn'>
                            <Button type='primary'
                                    loading={Loading}
                                    onClick={addStoreFun}>
                                Submit
                            </Button>
                            <Button onClick={onHide}>Cancel</Button>
                        </div>
                    }
                >
                    {/*<h4 style={{marginBottom: 10}}><span style={{color: 'red'}}>* </span>Please input the QR Code quantity*/}
                    {/*    to be generated</h4>*/}
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label="Current Password"
                                       name="oldValue"
                                       rules={[
                                           {
                                               required: true,
                                               message: 'Please enter the current password',
                                           },
                                       ]}>
                                <Input placeholder="Please enter the current password"/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="New Password"
                                       name="configValue"
                                       rules={[{required: true, message: 'Please enter a new password'}]}
                            >
                                <Input placeholder="Please enter a new password"/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Confirm New Password"
                                       name="confirmConfigValue"
                                       rules={[{required: true, message: 'Please confirm the new password'}]}
                            >
                                <Input placeholder="Please confirm the new password"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Drawer>
            </Form>
        </React.Fragment>
    )
}
