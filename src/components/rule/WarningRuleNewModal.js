import React, { useEffect, useState } from 'react';
import { Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, getTenantCode } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const WarningRuleNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        put('/ruleset/warning/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            warningRuleCode: warningRuleCode,
            warningRuleName: warningRuleName,
            warningType: warningType,
            warningContent: warningContent,
            thresholdMode: thresholdMode,
            threshold: threshold,
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
    const putNew = props.warningRuleCode4Edit === undefined ? true : false;
    const [warningRuleCode, setWarningRuleCode] = useState();
    const [warningRuleName, setWarningRuleName] = useState();
    const [warningType, setWarningType] = useState(0);
    const [warningContent, setWarningContent] = useState(0);
    const [thresholdMode, setThresholdMode] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [comment, setComment] = useState();

    // 初始化定义
    const fetchWarningRule4Edit = () => {
        if (isBlankStr(props.warningRuleCode4Edit)) {
            return;
        }

        get('/ruleset/warning/get', {  
            tenantCode: getTenantCode(),
            warningRuleCode: props.warningRuleCode4Edit
        }).then(respData => {
            let model = respData.model;
            setWarningRuleCode(model.warningRuleCode);
            setWarningRuleName(model.warningRuleName);
            setWarningType(model.warningType);
            setWarningContent(model.warningContent);
            setThresholdMode(model.thresholdMode);
            setThreshold(model.threshold);
            setComment(model.comment);
        });
    }
    useEffect(() => {
        fetchWarningRule4Edit();
    }, []);
 
    return (
        <>
            <Modal
                centered
                confirmLoading={loading}
                open={open}
                title={applyLang('labelNewOrEdit')}
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={875}
            >
                <div style={{height: 300, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptRuleCode')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={7}>
                                <Input placeholder={applyLang('labelRuleCode')} disabled={isBlankStr(props.warningRuleCode4Edit) ? false : true} value={warningRuleCode} onChange={(e) => setWarningRuleCode(e.target.value)} />
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptRuleName')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={7}>
                                <Input placeholder={applyLang('labelRuleName')} value={warningRuleName} onChange={(e) => setWarningRuleName(e.target.value)} />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptWarningContent')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={19}>
                                <Radio.Group onChange={(e) => setWarningContent(e.target.value)} value={warningContent}>
                                    <Radio value={0}>{applyLang('labelWarningInvalid')}</Radio>
                                    <Radio value={1}>{applyLang('labelWarningSupply')}</Radio>
                                    <Radio value={2}>{applyLang('labelWarningClean')}</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptWarningType')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={19}>
                                <Radio.Group onChange={(e) => setWarningType(e.target.value)} value={warningType}>
                                    <Radio value={0}>{applyLang('labelStrongWarning')}</Radio>
                                    <Radio value={1}>{applyLang('labelWeakWarning')}</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptWarningThreshholdType')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={19}>
                                <Radio.Group disabled='true' onChange={(e) => setThresholdMode(e.target.value)} value={thresholdMode}>
                                    <Radio value={0}>{applyLang('labelFix')}</Radio>
                                    <Radio value={1}>{applyLang('labelPer')}</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptWarningThreshhold')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={19}>
                                <Space><InputNumber min={0} max={999} onChange={(e) => setThreshold(e)} value={threshold}/><span>{applyLang('labelKg')}/{applyLang('labelMins')}</span></Space>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptComment')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={19}>
                                <TextArea rows={2} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default WarningRuleNewModal;