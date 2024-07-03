import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Switch, Col, Row } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import axios from 'axios';

import '../css/common.css';

const MachineDeployNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = 'http://localhost:8080/teamachine/machine/deploy/put';
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            deployCode: deployCode,
            modelCode: modelCode,
            machineCode: machineCode,
            shopCode: shopCode,
            state: state,
            tenantCode: 'tenant_001',
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            }
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            alert("here is error")
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });

        setTimeout(() => {
            setLoading(false);
            props.onClose();
            setOpen(false);
        }, 3000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [deployCode, setDeployCode] = useState(props.deployCode4Edit === undefined || props.deployCode4Edit === null ? '' : props.deployCode4Edit);
    const [modelCode, setModelCode] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [shopCode, setShopCode] = useState('');
    const [state, setState] = useState(0);
    useEffect(() => {
        if (props.deployCode4Edit === undefined || props.deployCode4Edit === null || props.deployCode4Edit === '') {
            return;
        }

        let url = 'http://localhost:8080/teamachine/machine/deploy/tenant_001/' + props.deployCode4Edit + '/get';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setDeployCode(response.data.model.deployCode);
                setModelCode(response.data.model.modelCode);
                setMachineCode(response.data.model.machineCode);
                setShopCode(response.data.model.shopCode);
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }, [props.deployCode4Edit]);
    const [shopList, setShopList] = useState([]);
    const fetchShopListData = () => {
        let url = 'http://localhost:8080/teamachine/shop/list?tenantCode=tenant_001';
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setShopList((prev => {
                    let shopListTmp = [];
                    response.data.model.forEach(item => {
                        shopListTmp.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                    return shopListTmp;
                }));
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }
    useEffect(() => {
        fetchShopListData();
    }, []);

    // 输入相关
    const onChangeDeployCode = (e) => {
        setDeployCode(e.target.value);
    }
    const onChangeModelCode = (e) => {
        setModelCode(e.target.value);
    }
    const onChangeMachineCode = (e) => {
        setMachineCode(e.target.value);
    }
    const onChangeShopCode = (e) => {
        setShopCode(e);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建部署码"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={1000}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 410, width: '100%'}}>
                <div style={{height: 410, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>部署编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="部署编码" value={deployCode} onChange={onChangeDeployCode}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>型号编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="型号编码" value={modelCode} onChange={onChangeModelCode}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>机器编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Input placeholder="机器编码" value={machineCode} onChange={onChangeMachineCode}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={22}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={14}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Select
                                    value={shopCode}
                                    style={{width: '100%'}}
                                    onChange={onChangeShopCode}
                                    options={shopList}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};
 
export default MachineDeployNewModal;