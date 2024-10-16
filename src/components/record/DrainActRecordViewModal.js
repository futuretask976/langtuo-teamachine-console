import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

dayjs.locale('zh-cn');

const DrainActRecordViewModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [machineCode, setMachineCode] = useState('');
    const [shopName, setShopName] = useState('');
    const [shopGroupName, setShopGroupName] = useState('');
    const [drainStartTime, setDrainStartTime] = useState();
    const [drainEndTime, setDrainEndTime] = useState();
    const [toppingName, setToppingName] = useState('');
    const [pipelineNum, setPipelineNum] = useState(0);
    const [drainType, setDrainType] = useState(0);
    const [drainRuleCode, setDrainRuleCode] = useState('');
    const [flushSec, setFlushSec] = useState(0);
    const [flushWeight, setFlushWeight] = useState(0);

    // 赋值初始化
    const fetchInvalidActRecord = () => {
        if (isBlankStr(props.idempotentMark4View)) {
            return;
        }

        get('/recordset/drain/get', {  
            tenantCode: getTenantCode(),
            idempotentMark: props.idempotentMark4View
        }).then(respData => {
            let model = respData.model;
            setMachineCode(model.machineCode);
            setShopName(model.shopName);
            setShopGroupName(model.shopGroupName);
            setDrainStartTime(model.drainStartTime);
            setDrainEndTime(model.drainEndTime);
            setToppingName(model.toppingName);
            setPipelineNum(model.pipelineNum);
            setDrainType(model.drainType);
            setDrainRuleCode(model.drainRuleCode);
            setFlushSec(model.flushSec);
            setFlushWeight(model.flushWeight);
        });
    }
    useEffect(() => {
        fetchInvalidActRecord();
    }, [props.idempotentMark4View]);
 
    return (
        <>
            <Modal
                centered
                onCancel={onClickCancel}
                open={open}
                style={{border: '0px solid red'}}
                title={applyLang('labelViewDetail')}
                width={825}
                footer={[
                    <Button key="back" onClick={onClickCancel}>{applyLang('labelClose')}</Button>,
                ]}
            >
                <div style={{height: 325, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptMachineCode')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelMachineCode')} disabled={true} value={machineCode}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptShopGroupName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelShopGroupName')} disabled={true} value={shopGroupName}/>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptShopName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelShopName')} disabled={true} value={shopName}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptStartTime')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <DatePicker
                                    disabled={true}
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    style={{width: '100%'}}
                                    value={dayjs(drainStartTime, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptEndTime')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <DatePicker
                                    disabled={true}
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    style={{width: '100%'}}
                                    value={dayjs(drainEndTime, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptToppingName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Input placeholder={applyLang('labelToppingName')} disabled={true} value={toppingName}/>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptPipelineNo')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <InputNumber disabled={true} value={pipelineNum}/>
                            </Col>
                        </Row>
                        {drainType === 0 &&
                            <Row style={{width: '100%'}}>
                                <Col className="gutter-row" span={4}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>{applyLang('promptDrainRule')}</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <Input disabled={true} value={drainRuleCode}/>
                                </Col>
                            </Row>
                        }
                        {drainType === 1 &&
                            <>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>{applyLang('promptDrainManually')}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>{applyLang('promptDrainDuration')}</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <InputNumber disabled={true} value={flushSec} style={{width: 50}}/>&nbsp;{applyLang('labelSec')}
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>{applyLang('promptDrainWeight')}</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={8}>
                                        <InputNumber disabled={true} value={flushWeight} style={{width: 50}}/>&nbsp;{applyLang('labelMeasureUnitKg')}
                                    </Col>
                                </Row>
                            </>
                        }
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default DrainActRecordViewModal;