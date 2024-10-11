import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';

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
                alert("保存成功！");
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert('保存失败：' + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.warningRuleCode4Edit == undefined ? true : false;
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
                open={open}
                title="新建/编辑规则"
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={650}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                        提交
                    </Button>
                ]}
            >
                <div style={{height: 350, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>规则编码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="规则编码" disabled={isBlankStr(props.warningRuleCode4Edit) ? false : true} value={warningRuleCode} onChange={(e) => setWarningRuleCode(e.target.value)} />
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>规则名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="规则名称" value={warningRuleName} onChange={(e) => setWarningRuleName(e.target.value)} />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>预警内容：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Radio.Group onChange={(e) => setWarningContent(e.target.value)} value={warningContent}>
                                    <Radio value={0}>报废预警</Radio>
                                    <Radio value={1}>缺料预警</Radio>
                                    <Radio value={2}>清洗预警</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>预警类型：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Radio.Group onChange={(e) => setWarningType(e.target.value)} value={warningType}>
                                    <Radio value={0}>弱提醒</Radio>
                                    <Radio value={1}>强提醒</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>阈值类型：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Radio.Group disabled='true' onChange={(e) => setThresholdMode(e.target.value)} value={thresholdMode}>
                                    <Radio value={0}>固定值</Radio>
                                    <Radio value={1}>百分比</Radio>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>阈值：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Space><InputNumber min={0} max={999} onChange={(e) => setThreshold(e)} value={threshold}/><span>克/分钟</span></Space>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>备注：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default WarningRuleNewModal;