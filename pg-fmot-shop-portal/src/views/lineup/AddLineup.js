import React, {useEffect} from 'react';
import {Drawer, Form, Input, Row, Col, message, Button} from 'antd';
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";

const {TextArea} = Input;

export function AddLineup({show, onHide, updateList}) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [form, show]);

    const addLineupFun = () => {
        form.validateFields().then((values) => {
            api.lineupSave({...values}).then((res) => {
                if (res) {
                    if (0 === res.data.code) {
                        onHide()
                        updateList()
                        message.success('Added successfully!', 3);
                    } else {
                        MyAlert({errorMsg: res.data.message});
                    }
                }
            }).catch((err) => {
                message.error(err ? err : 'link failure！', 2);
            })
        })
    }

    return (
        <React.Fragment>
            <Form form={form}
                  layout="vertical"
                  labelCol={{span: 5}}
                  wrapperCol={{span: 18}}
            >
                <Drawer
                    title="Add Lineup"
                    width={720}
                    visible={show}
                    onClose={() => {
                        onHide()
                    }}
                    bodyStyle={{paddingBottom: 80}}
                    footer={
                        <div className='create-event-btn'>
                            <Button onClick={addLineupFun} type="primary">
                                Submit
                            </Button>
                            <Button onClick={onHide}>Cancel</Button>
                        </div>
                    }
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Lineup Name"
                                rules={[{required: true, message: 'Please input the lineup name'}]}
                            >
                                <Input
                                    placeholder="Please input the lineup name"/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Lineup Description"
                            >
                                <TextArea rows={4}
                                          maxLength={500}
                                          placeholder="Please input the lineup description"/>

                                {/*<Input*/}
                                {/*    placeholder="Please input the lineup description" />*/}
                            </Form.Item>
                        </Col>
                    </Row>
                </Drawer>
            </Form>
        </React.Fragment>
    );
}
