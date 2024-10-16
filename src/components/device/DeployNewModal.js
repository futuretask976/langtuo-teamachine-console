import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankStr, isValidCode } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const DeployNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(deployCode, true)) {
            alert(applyLang('msgDeployCodeInvalid'));
            return;
        }
        if (!isValidCode(modelCode, true)) {
            alert(applyLang('msgModelCodeInvalid'));
            return;
        }
        if (!isValidCode(machineCode, true)) {
            alert(applyLang('msgMachineCodeInvalid'));
            return;
        }
        if (!isValidCode(shopCode, true)) {
            alert(applyLang('msgShopCodeInvalid'));
            return;
        }

        setLoading(true);
        put('/deviceset/deploy/put', {
            tenantCode: getTenantCode(),
            deployCode: deployCode,
            modelCode: modelCode,
            machineCode: machineCode,
            shopCode: shopCode,
            state: state,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgPutSucceed'));
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert(applyLang('msgPutFailed') + respData.errorMsg);
                setLoading(false);
            }
            
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.deployCode4Edit === undefined ? true : false;
    const [deployCode, setDeployCode] = useState();
    const [modelCode, setModelCode] = useState();
    const [machineCode, setMachineCode] = useState();
    const [shopCode, setShopCode] = useState();
    const state = 0;
    const [shopList4Select, setShopList4Select] = useState();
    const [modelList4Select, setModelList4Select] = useState();

    // 初始化定义
    const fetchShopList4Select = () => {
        get('/shopset/shop/list', {
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
            title={applyLang('labelNewOrEdit')}
            width={550}
        >
            <div style={{height: 200, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><Button key="submit" type="primary" onClick={onClickDeployCodeGen} disabled={isBlankStr(props.deployCode4Edit) ? false : true} style={{width: 150}}>{applyLang('labelGenDeployCode')}</Button></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelModeCode')} allowClear value={deployCode} onChange={(e) => setDeployCode(e.target.value)} disabled={true}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><Button key="submit" type="primary" onClick={onClickMachineCodeGen} disabled={isBlankStr(props.deployCode4Edit) ? false : true} style={{width: 150}}>{applyLang('labelGenMachineCode')}</Button></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMachineCode')} allowClear value={machineCode} onChange={(e) => setMachineCode(e.target.value)} disabled={true}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptModelCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    className="full-width"
                                    onChange={(e) => setModelCode(e)}
                                    options={modelList4Select}
                                    placeholder={applyLang('labelPleaseSelect')}
                                    value={modelCode}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptShopName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    className="full-width"
                                    onChange={(e) => setShopCode(e)}
                                    options={shopList4Select}
                                    placeholder={applyLang('labelPleaseSelect')}
                                    value={shopCode}
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