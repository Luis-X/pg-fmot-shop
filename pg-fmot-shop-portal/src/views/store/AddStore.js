import React, {useState, useEffect} from 'react';
import {Drawer, Form, Input, Row, Col, message, Select, Button} from 'antd';
import * as api from "../../api/api";
import MyAlert from "../../components/MyAlert";

const {Option} = Select;
const {TextArea} = Input;

export function AddStore({show, onHide, marketData, updateList}) {
    const [form] = Form.useForm();

    const [shopMarketId, setShopMarketId] = useState('');
    const [shopAreaId, setShopAreaId] = useState('');
    const [shopAreasData, setShopAreasData] = useState([]);

    useEffect(() => {
        form.resetFields();
        return function () {
            setShopAreasData([]);
        }
    }, [form, show]);

    const selectMarket = (value) => {
        setShopAreasData(marketData[value].shopAreas || [])
        setShopMarketId(marketData[value].id || '')
    }

    const selectShopAreas = (value) => {
        setShopAreaId(shopAreasData[value].id)
    }

    const addStoreFun = () => {
        form.validateFields().then((values) => {
            values.name = values.storeName;
            delete values.storeName;
            saveStore(values)
        })
    }

    const saveStore = (values) => {
        api.storeSave({
            ...values,
            "shopAreaId": shopAreaId,
            "shopMarketId": shopMarketId,
        }).then((res) => {
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
                    title="Add Store"
                    width={720}
                    visible={show}
                    onClose={() => {
                        onHide()
                    }}
                    bodyStyle={{paddingBottom: 80}}
                    // extra={
                    //     <Space>
                    //         <Button onClick={onHide}>Cancle</Button>
                    //         <Button onClick={addStoreFun} type="primary">
                    //             Submit
                    //         </Button>
                    //
                    //     </Space>
                    // }
                    footer={
                        <div className='create-event-btn'>
                            <Button onClick={addStoreFun} type="primary">
                                Submit
                            </Button>
                            <Button onClick={onHide}>Cancel</Button>
                        </div>
                    }
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="storeName"
                                label="Store Name"
                                rules={[{required: true, message: 'Please provide the store name'}]}
                            >
                                <Input placeholder="Please provide the store name"/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Store Description"
                                rules={[{required: true, message: 'Please provide the store description'}]}
                            >
                                <TextArea rows={4}
                                          maxLength={500}
                                          placeholder="Please provide the store description"/>
                                {/*<Input*/}
                                {/*    placeholder="Please provide the store description"/>*/}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="shopMarketId"
                                label="Store Market"
                                rules={[{required: true, message: 'Please select the store market'}]}
                            >
                                <Select placeholder="Please select the Store Market"
                                        style={{width: '100%'}}
                                        onSelect={selectMarket}
                                >
                                    {
                                        marketData.map((item, index, arr) => (
                                            <Option key={index}
                                                    value={index}
                                            >{item.name}</Option>
                                        ))
                                    }
                                    {/*<Option value={null}>所有状态</Option>*/}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="shopAreaId"
                                label="Store District"
                                rules={[{required: true, message: 'Please select the store district'}]}
                            >
                                <Select placeholder="Please select the Store district"
                                        style={{width: '100%'}}
                                        onChange={selectShopAreas}
                                >
                                    {
                                        shopAreasData.map((areaItem, index, arr) => (
                                            <Option key={index}
                                                    value={index}
                                            >{areaItem.name}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="soldToStoreNo"
                                label="DKSH Sold to Store No."
                                rules={[{required: true, message: 'Please provide DKSH Sold to Store No.'}]}
                            >
                                <Input placeholder="Please provide DKSH Sold to Store No."/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Drawer>
            </Form>
        </React.Fragment>
    );
}
