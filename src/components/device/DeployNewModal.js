import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray, isBlankStr, isValidCode } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const DeployNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(deployCode, true)) {
            alert('部署编码不符合规则');
            return;
        }
        if (!isValidCode(modelCode, true)) {
            alert('型号编码不符合规则');
            return;
        }
        if (!isValidCode(machineCode, true)) {
            alert('机器编码不符合规则');
            return;
        }
        if (!isValidCode(shopCode, true)) {
            alert('店铺编码不符合规则');
            return;
        }

        setLoading(true);
        put('/deviceset/deploy/put', {
            tenantCode: getTenantCode(),
            deployCode: deployCode,
            modelCode: modelCode,
            machineCode: machineCode,
            shopCode: shopCode,
            state: state
        }).then(respData => {
            if (respData.success) {
                alert("保存成功");
            } else {
                alert('保存失败：' + respData.errorMsg);
            }
            setLoading(false);
            props.onClose();
            setOpen(false);
        });
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据定义
    const putNew = useState(props.deployCode4Edit == undefined ? true : false);
    const [deployCode, setDeployCode] = useState();
    const [modelCode, setModelCode] = useState();
    const [machineCode, setMachineCode] = useState();
    const [shopCode, setShopCode] = useState();
    const state = useState(0);
    const [shopList4Select, setShopList4Select] = useState();
    const [modelList4Select, setModelList4Select] = useState();

    // 初始化定义
    const fetchShopList4Select = () => {
        get('/shopset/shop/listbyadminorg', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setShopList4Select((prev => {
                let shopListTmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopListTmp.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                }
                return shopListTmp;
            }));
        });
    }
    const fetchModelList4Select= () => {
        get('/deviceset/model/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setModelList4Select((prev => {
                let modelListTmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        modelListTmp.push({
                            label: item.modelCode,
                            value: item.modelCode
                        });
                    });
                }
                return modelListTmp;
            }));
        });
    }
    const fetchDeploy4Edit = () => {
        if (isBlankStr(props.deployCode4Edit)) {
            return;
        }

        get('/deviceset/deploy/get', {
            tenantCode: getTenantCode(),
            deployCode: props.deployCode4Edit
        }).then(respData => {
            let model = respData.model;
            setDeployCode(model.deployCode);
            setModelCode(model.modelCode);
            setMachineCode(model.machineCode);
            setShopCode(model.shopCode);
        });
    }
    useEffect(() => {
        fetchShopList4Select();
        fetchModelList4Select();
        fetchDeploy4Edit();
    }, []);

    // 输入定义
    const onClickDeployCodeGen = (e) => {
        get('/deviceset/deploy/deploycode/generate', {
            tenantCode: getTenantCode()
        }).then(resp => {
            let model = resp.model;
            setDeployCode(model);
        });
    }
    const onClickMachineCodeGen = (e) => {
        get('/deviceset/deploy/machinecode/generate', {
            tenantCode: getTenantCode()
        }).then(resp => {
            let model = resp.model;
            setMachineCode(model);
        });
    }
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            onCancel={onClickCancel}
            onOk={onClickOK}
            open={open}
            style={{border: '0px solid red'}}
            title="新建/编辑部署码"
            width={500}
        >
            <div style={{height: 200, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><Button key="submit" type="primary" onClick={onClickDeployCodeGen} disabled={isBlankStr(props.deployCode4Edit) ? false : true}>部署码生成</Button></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="部署编码" allowClear value={deployCode} onChange={(e) => setDeployCode(e.target.value)} disabled={true}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><Button key="submit" type="primary" onClick={onClickMachineCodeGen} disabled={isBlankStr(props.deployCode4Edit) ? false : true}>机器码生成</Button></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器编码" allowClear value={machineCode} onChange={(e) => setMachineCode(e.target.value)} disabled={true}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>型号编码：</span></Space>
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
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>店铺：</span></Space>
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
                </Space>
            </div>
        </Modal>
    );
};
 
export default DeployNewModal;