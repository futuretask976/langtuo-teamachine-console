import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespModel, handleRespError, isBlankStr, isRespSuccess } from '../../js/common.js';

const DeployNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/deviceset/deploy/put');
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
            if (isRespSuccess(response)) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            handleRespError(error);
        });

        setTimeout(() => {
            setLoading(false);
            props.onClose();
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [deployCode, setDeployCode] = useState(isBlankStr(props.deployCode4Edit) ? '' : props.deployCode4Edit);
    const [modelCode, setModelCode] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [shopCode, setShopCode] = useState('');
    const [state, setState] = useState(0);
    const [shopList4Select, setShopList4Select] = useState([]);
    const [modelList4Select, setModelList4Select] = useState([]);
    const fetchShopList4Select = () => {
        let url = genGetUrlByParams('/shopset/shop/list', {
            tenantCode: 'tenant_001'
        })
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            let model = getRespModel(response);
            setShopList4Select((prev => {
                let shopListTmp = [];
                model.forEach(item => {
                    shopListTmp.push({
                        label: item.shopName,
                        value: item.shopCode
                    });
                });
                return shopListTmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchModelList4Select= () => {
        let url = genGetUrlByParams('/deviceset/model/list', {
            tenantCode: 'tenant_001'
        })
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            let model = getRespModel(response);
            setModelList4Select((prev => {
                let modelListTmp = [];
                model.forEach(item => {
                    modelListTmp.push({
                        label: item.modelCode,
                        value: item.modelCode
                    });
                });
                return modelListTmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchShopList4Select();
        fetchModelList4Select();
    }, []);
    useEffect(() => {
        if (isBlankStr(props.deployCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/deviceset/deploy/{segment}/{segment}/get', ['tenant_001', props.deployCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            let model = getRespModel(response);
            setDeployCode(model.deployCode);
            setModelCode(model.modelCode);
            setMachineCode(model.machineCode);
            setShopCode(model.shopCode);
        })
        .catch(error => {
            handleRespError(error);
        });
    }, [props.deployCode4Edit]);

    // 输入相关
    const onClickDeployCodeGen = (e) => {
        let url = genGetUrlByParams('/deviceset/deploy/generate', {
            tenantCode: 'tenant_001'
        })
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            let model = getRespModel(response);
            setDeployCode(model);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建部署码"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={500}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 200, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <Button key="submit" type="primary" onClick={onClickDeployCodeGen} disabled={isBlankStr(props.deployCode4Edit) ? false : true}>部署码生成</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="部署编码" value={deployCode} onChange={(e) => setDeployCode(e.target.value)} disabled={isBlankStr(props.deployCode4Edit) ? false : true} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>型号编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Select
                                value={modelCode}
                                style={{width: '90%'}}
                                onChange={(e) => setModelCode(e)}
                                options={modelList4Select}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>机器编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="机器编码" value={machineCode} onChange={(e) => setMachineCode(e.target.value)} style={{width: '90%'}} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>店铺：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Select
                                value={shopCode}
                                style={{width: '90%'}}
                                onChange={(e) => setShopCode(e)}
                                options={shopList4Select}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default DeployNewModal;