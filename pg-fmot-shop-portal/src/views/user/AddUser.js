import React, {useEffect} from 'react';
import {Drawer, Form, Input, Row, Col, message, Button} from 'antd';
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";

export function AddUser({show, onHide, updateList}) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [form, show]);

    const addUserNameFun = () => {
        form.validateFields().then((values) => {
            api.userSave({...values}).then((res) => {
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
            <Form form={form} layout="vertical">
                <Drawer
                    title="Add User"
                    width={720}
                    visible={show}
                    onClose={() => {
                               onHide()
                           }}
                    bodyStyle={{ paddingBottom: 80 }}
                    // extra={
                    //     <Space>
                    //         <Button onClick={addUserNameFun} type="primary">
                    //             Submit
                    //         </Button>
                    //         <Button onClick={onHide}>Cancle</Button>
                    //     </Space>
                    // }
                    footer={
                        <div className='create-event-btn'>
                            <Button onClick={addUserNameFun} type="primary">
                                Submit
                            </Button>
                            <Button onClick={onHide}>Cancel</Button>
                        </div>
                    }
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="account"
                                label="PG Account"
                                rules={[{ required: true, message: 'Please input PG Account(Shortname)' }]}
                            >
                                <Input
                                    placeholder="Please input PG Account(Shortname)" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Drawer>
            </Form>
        </React.Fragment>
    );
}
