import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

dayjs.locale('zh-cn');

const CleanActRecordViewModal = (props) => {
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
    const [cleanStartTime, setCleanStartTime] = useState();
    const [cleanEndTime, setCleanEndTime] = useState();
    const [toppingName, setToppingName] = useState('');
    const [pipelineNum, setPipelineNum] = useState(0);
    const [cleanType, setCleanType] = useState(0);
    const [cleanRuleCode, setCleanRuleCode] = useState('');
    const [cleanContent, setCleanContent] = useState(0);
    const [washSec, setWashSec] = useState(10);
    const [soakMin, setSoakMin] = useState(0);
    const [flushIntervalMin, setFlushIntervalMin] = useState(0);
    const [flushSec, setFlushSec] = useState(0);

    // 赋值初始化
    const fetchInvalidActRecord = () => {
        if (isBlankStr(props.idempotentMark4View)) {
            return;
        }

        get('/recordset/clean/get', {  
            tenantCode: getTenantCode(),
            idempotentMark: props.idempotentMark4View
        }).then(respData => {
            let model = respData.model;
            setMachineCode(model.machineCode);
            setShopName(model.shopName);
            setShopGroupName(model.shopGroupName);
            setCleanStartTime(model.cleanStartTime);
            setCleanEndTime(model.cleanEndTime);
            setToppingName(model.toppingName);
            setPipelineNum(model.pipelineNum);
            setCleanType(model.cleanType);
            setCleanRuleCode(model.cleanRuleCode);
            setCleanContent(model.cleanContent);
            setWashSec(model.washSec);
            setSoakMin(model.soakMin);
            setFlushIntervalMin(model.flushIntervalMin);
            setFlushSec(model.flushSec);
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
                width={800}
                footer={[
                    <Button key="back" onClick={onClickCancel}>{applyLang('labelClose')}</Button>,
                ]}
            >
                <div style={{height: 325, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptMachineCode')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder={applyLang('labelMachineCode')} disabled={true} value={machineCode}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptShopGroupName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder={applyLang('labelShopGroupName')} disabled={true} value={shopGroupName}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('labelShopName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder={applyLang('labelShopName')} disabled={true} value={shopName}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptStartTime')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <DatePicker
                                    disabled={true}
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    style={{width: '100%'}}
                                    value={dayjs(cleanStartTime, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptEndTime')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <DatePicker
                                    disabled={true}
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    style={{width: '100%'}}
                                    value={dayjs(cleanEndTime, 'YYYY-MM-DD HH:mm:ss')}
                                />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptToppingName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder={applyLang('labelToppingName')} disabled={true} value={toppingName}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptPipelineNo')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <InputNumber disabled={true} value={pipelineNum}/>
                            </Col>
                        </Row>
                        {cleanType == 0 &&
                            <Row style={{width: '100%'}}>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>{applyLang('promptCleanRule')}</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={9}>
                                    <InputNumber disabled={true} value={cleanRuleCode}/>
                                </Col>
                            </Row>
                        }
                        {cleanType == 1 &&
                            <>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>{applyLang('promptCleanManually')}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>{applyLang('promptCleanContent')}</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={9}>
                                        <Radio.Group disabled={true} value={cleanContent}>
                                            <Radio value={0}>{applyLang('labelWash')}</Radio>
                                            <Radio value={1}>{applyLang('labelSoak')}</Radio>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>{applyLang('promptWashDuration')}</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <InputNumber disabled={true} value={washSec} style={{width: 50}}/>&nbsp;{applyLang('labelMin')}
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>{applyLang('promptSoakDuration')}</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={15}>
                                        <InputNumber disabled={true} value={soakMin} style={{width: 50}}/>&nbsp;{applyLang('labelMin')} {applyLang('labelEveryInterval')}&nbsp;<InputNumber disabled={true} value={flushIntervalMin} style={{width: 50}}/>&nbsp;{applyLang('labelMin')} {applyLang('labelFlush')}&nbsp;<InputNumber disabled={true} value={flushSec} style={{width: 50}}/>&nbsp;{applyLang('labelSec')}
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
 
export default CleanActRecordViewModal;