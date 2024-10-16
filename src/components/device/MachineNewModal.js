import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Select, Space, Switch, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { dateToYMDHMS, getTenantCode, isArray, isBlankObj, isBlankStr, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

dayjs.locale('zh-cn');

const MachineDeployNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidName(machineName, true)) {
            alert(applyLang('msgMachineNameInvalid'));
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
            if (respData === undefined) {
                return;
            }
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
    const [shopList4Select, setShopList4Select] = useState();
    const [modelList4Select, setModelList4Select] = useState();
    const [machineCode, setMachineCode] = useState();
    const [machineName, setMachineName] = useState();
    const [screenCode, setScreenCode] = useState();
    const [elecBoardCode, setElecBoardCode] = useState();
    const [modelCode, setModelCode] = useState();
    const [state, setState] = useState(0);
    const [validUntil, setValidUntil] = useState(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    const [maintainUntil, setMaintainUntil] = useState(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));
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
            setValidUntil(isBlankObj(model.validUntil) ? validUntil : dateToYMDHMS(new Date(model.validUntil)));
            setMaintainUntil(isBlankObj(model.maintainUntil) ? maintainUntil : dateToYMDHMS(new Date(model.maintainUntil)));
            setShopCode(model.shopCode);
        });
    }
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
            title={applyLang('labelNewOrEdit')}
            width={600}
        >
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 450, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptMachineCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMachineCode')} allowClear value={machineCode} disabled={true} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptMachineName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMachineName')} allowClear value={machineName} onChange={(e) => setMachineName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptScreenCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMachineCode')} allowClear value={screenCode} disabled={true} onChange={(e) => setScreenCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptElecBoardCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelElecBoardCode')} allowClear value={elecBoardCode} disabled={true} onChange={(e) => setElecBoardCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptModelCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    className="full-width"
                                    onChange={(e) => setModelCode(e)}
                                    options={modelList4Select}
                                    value={modelCode}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptState')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Switch checkedChildren={applyLang('labelEnabled')} unCheckedChildren={applyLang('labelDisabled')} checked={state === 1 ? true : false} onChange={(e) => setState(e ? 1 : 0)} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptMaintainPeriod')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
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
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptValidPeriod')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
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
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptShopName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
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