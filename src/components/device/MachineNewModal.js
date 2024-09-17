import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Select, Space, Switch, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { dateToYMDHMS, getTenantCode, isArray, isBlankStr, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

dayjs.locale('zh-cn');

const MachineDeployNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidName(machineName, true)) {
            alert('机器名称不符合规则');
            return;
        }

        setLoading(true);
        put('/deviceset/machine/update', {
            tenantCode: getTenantCode(),
            machineCode: machineCode,
            machineName: machineName,
            screenCode: screenCode,
            elecBoardCode: elecBoardCode,
            modelCode: modelCode,
            state: state,
            validUntil: new Date(validUntil),
            maintainUntil: new Date(maintainUntil)
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
    const [shopList4Select, setShopList4Select] = useState();
    const [modelList4Select, setModelList4Select] = useState();
    const putNew = props.machineCode4Edit == undefined ? true : false;
    const [machineCode, setMachineCode] = useState();
    const [machineName, setMachineName] = useState();
    const [screenCode, setScreenCode] = useState();
    const [elecBoardCode, setElecBoardCode] = useState();
    const [modelCode, setModelCode] = useState();
    const [state, setState] = useState(0);
    const [validUntil, setValidUntil] = useState();
    const [maintainUntil, setMaintainUntil] = useState(dateToYMDHMS(new Date()));
    const [shopCode, setShopCode] = useState();

    // 初始化定义
    const fetchMachine4Edit = () => {
        if (isBlankStr(props.machineCode4Edit)) {
            return;
        }

        get('/deviceset/machine/get', {
            tenantCode: getTenantCode(),
            machineCode: props.machineCode4Edit
        }).then(respData => {
            let model = respData.model;
            setMachineCode(model.machineCode);
            setMachineName(model.machineName);
            setScreenCode(model.screenCode);
            setElecBoardCode(model.elecBoardCode);
            setModelCode(model.modelCode);
            setState(model.state);
            setValidUntil(dateToYMDHMS(new Date(model.validUntil)));
            setMaintainUntil(dateToYMDHMS(new Date(model.maintainUntil)));
            setShopCode(model.shopCode);
        });
    }
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
    useEffect(() => {
        fetchShopList4Select();
        fetchModelList4Select();
        fetchMachine4Edit();
    }, []);

    // 输入定义
    const onChangeValidUntil = (date, dateString) => {
        setValidUntil(dateString);
    }
    const onChangeMaintainUntil = (date, dateString) => {
        setMaintainUntil(dateString);
    }
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            style={{border: '0px solid red'}}
            title="编辑机器信息01"
            width={500}
        >
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 400, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>机器编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器编码" allowClear value={machineCode} disabled={true} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>机器名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器名称" allowClear value={machineName} onChange={(e) => setMachineName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>屏幕编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="机器编码" allowClear value={screenCode} disabled={true} onChange={(e) => setScreenCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>电控板编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="电控板编码" allowClear value={elecBoardCode} disabled={true} onChange={(e) => setElecBoardCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>型号编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
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
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>状态：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={(e) => setState(e ? 1 : 0)} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>保修期：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    onChange={onChangeMaintainUntil}
                                    value={dayjs(maintainUntil, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>有效期：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    onChange={onChangeValidUntil}
                                    value={dayjs(validUntil, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>归属店铺：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Select
                                value={shopCode}
                                disabled={true}
                                style={{width: '100%'}}
                                onChange={(e) => setShopCode(e)}
                                options={shopList4Select}
                            />
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default MachineDeployNewModal;