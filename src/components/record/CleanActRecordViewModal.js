import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
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
                open={open}
                title="清洗记录明细"
                onCancel={onClickCancel}
                width={750}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>关闭</Button>,
                ]}
            >
                <div style={{height: 325, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>机器编码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="机器编码" disabled={true} value={machineCode}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>店铺组名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="店铺组名称" disabled={true} value={shopGroupName}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>店铺名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="店铺名称" disabled={true} value={shopName}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>开始时间：</span>
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
                                    <span>结束时间：</span>
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
                                    <span>物料名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="物料名称" disabled={true} value={toppingName}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>管道序号：</span>
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
                                        <span>清洗规则：</span>
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
                                            <span>手动清洗：</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>清洗内容：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={9}>
                                        <Radio.Group disabled={true} value={cleanContent}>
                                            <Radio value={0}>冲洗</Radio>
                                            <Radio value={1}>浸泡</Radio>
                                        </Radio.Group>
                                    </Col>
                                </Row>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>清洗时间：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <InputNumber disabled={true} value={washSec} style={{width: 50}}/>秒
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>浸泡时间：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={15}>
                                        <InputNumber disabled={true} value={soakMin} style={{width: 50}}/>分钟，每隔<InputNumber disabled={true} value={flushIntervalMin} style={{width: 50}}/>分钟，冲洗<InputNumber disabled={true} value={flushSec} style={{width: 50}}/>秒
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