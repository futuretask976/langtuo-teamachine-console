import React, { useEffect, useState } from 'react';
import { Button, Divider, Flex, Input, InputNumber, Modal, Radio, Select, Space, Switch, Table, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, isBlankArray } from '../../js/common.js';

const CloseRuleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/ruleset/close/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
            closeRuleCode: closeRuleCode,
            closeRuleName: closeRuleName,
            defaultRule: defaultRule,
            washSec: washSec,
            soakMin: soakMin,
            flushIntervalMin: flushIntervalMin,
            flushSec: flushSec
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            alert("here is error")
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
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
    const [closeRuleCode, setCloseRuleCode] = useState(isBlankStr(props.closeRuleCode4Edit) ? '' : props.closeRuleCode4Edit);
    const [closeRuleName, setCloseRuleName] = useState('');
    const [defaultRule, setDefaultRule] = useState(0);
    const [washSec, setWashSec] = useState(10);
    const [soakMin, setSoakMin] = useState(0);
    const [flushIntervalMin, setFlushIntervalMin] = useState(0);
    const [flushSec, setFlushSec] = useState(0);
    useEffect(() => {
        if (isBlankStr(props.closeRuleCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/ruleset/close/{segment}/{segment}/get', ['tenant_001', props.closeRuleCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                let model = response.data.model;
                setCloseRuleCode(model.closeRuleCode);
                setCloseRuleName(model.closeRuleName);
                setDefaultRule(model.defaultRule);
                setWashSec(model.washSec);
                setSoakMin(model.soakMin);
                setFlushIntervalMin(model.flushIntervalMin);
                setFlushSec(model.flushSec);
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }, [props.closeRuleCode4Edit]);

    return (
        <>
            <Modal
                centered
                open={open}
                title="新建规则"
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={625}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                        提交
                    </Button>,
                ]}
            >
                <div style={{height: 250, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>规则编码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Input placeholder="规则编码" disabled={isBlankStr(props.closeRuleCode4Edit) ? false : true} value={closeRuleCode} onChange={(e) => setCloseRuleCode(e.target.value)} />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>规则名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Input placeholder="规则名称" value={closeRuleName} onChange={(e) => setCloseRuleName(e.target.value)} />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>是否默认：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={defaultRule === 1 ? true : false} onChange={(e) => setDefaultRule(e ? 1 : 0)} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={16}>
                                &nbsp;
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', width: '100%'}}>
                                    <span>清洗时长：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Space size='small' style={{width: '100%'}}>
                                    <Radio.Group value={washSec} onChange={(e) => setWashSec(e.target.value)}>
                                        <Radio.Button value={10}>10秒</Radio.Button>
                                        <Radio.Button value={20}>20秒</Radio.Button>
                                        <Radio.Button value={30}>30秒</Radio.Button>
                                        <Radio.Button value={40}>40秒</Radio.Button>
                                        <Radio.Button value={50}>50秒</Radio.Button>
                                        <Radio.Button value={75}>75秒</Radio.Button>
                                        <Radio.Button value={100}>100秒</Radio.Button>
                                    </Radio.Group>
                                </Space>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>浸泡时间：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <InputNumber min={0} max={999} onChange={(e) => setSoakMin(e)} value={soakMin}/>分钟
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>设备每隔：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <InputNumber min={0} max={999} onChange={(e) => setFlushIntervalMin(e)} value={flushIntervalMin}/>分钟
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>冲洗：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <InputNumber min={0} max={999} onChange={(e) => setFlushSec(e)} value={flushSec}/>秒
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default CloseRuleNewModal;