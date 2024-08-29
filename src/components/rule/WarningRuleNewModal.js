import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlBySegs, getJwtToken, genPostUrl, getRespErrorMsg, getRespModel, getTenantCode, handleRespError, isBlankStr, isRespSuccess } from '../../js/common.js';

const { TextArea } = Input;

const WarningRuleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/ruleset/warning/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            comment: comment,
            warningRuleCode: warningRuleCode,
            warningRuleName: warningRuleName,
            warningType: warningType,
            warningContent: warningContent,
            thresholdMode: thresholdMode,
            threshold: threshold
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("保存成功");
            } else {
                alert('保存失败：' + getRespErrorMsg(response));
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
    const [warningRuleCode, setWarningRuleCode] = useState(isBlankStr(props.warningRuleCode4Edit) ? '' : props.warningRuleCode4Edit);
    const [warningRuleName, setWarningRuleName] = useState('');
    const [warningType, setWarningType] = useState(0);
    const [warningContent, setWarningContent] = useState(0);
    const [thresholdMode, setThresholdMode] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [comment, setComment] = useState('');
    useEffect(() => {
        if (isBlankStr(props.warningRuleCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/ruleset/warning/{segment}/{segment}/get', [getTenantCode(), props.warningRuleCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setWarningRuleCode(model.warningRuleCode);
            setWarningRuleName(model.warningRuleName);
            setWarningType(model.warningType);
            setWarningContent(model.warningContent);
            setThresholdMode(model.thresholdMode);
            setThreshold(model.threshold);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
        });
    }, [props.warningRuleCode4Edit]);
 
    return (
        <>
            <Modal
                centered
                open={open}
                title="新建规则"
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
                                <Radio.Group onChange={(e) => setThresholdMode(e.target.value)} value={thresholdMode}>
                                    <Radio value={0}>绝对值</Radio>
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
                                <InputNumber min={0} max={999} onChange={(e) => setThreshold(e)} value={threshold}/>
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