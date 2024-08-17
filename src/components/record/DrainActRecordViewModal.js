import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, InputNumber, Modal, Radio, Space, Col, Row } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

import '../../css/common.css';
import { genGetUrlBySegs, getRespModel, handleRespError, isBlankStr, getJwtToken, getTenantCode } from '../../js/common.js';

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

        let url = genGetUrlBySegs('/recordset/drain/{segment}/{segment}/get', [getTenantCode(), props.idempotentMark4View]);
        axios.get(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
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
        })
        .catch(error => {
            handleRespError(error);
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
                                    value={dayjs(drainStartTime, 'YYYY-MM-DD HH:mm:ss')}
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
                                    value={dayjs(drainEndTime, 'YYYY-MM-DD HH:mm:ss')}
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
                        {drainType == 0 &&
                            <Row style={{width: '100%'}}>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>排空规则：</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={9}>
                                    <Input disabled={true} value={drainRuleCode}/>
                                </Col>
                            </Row>
                        }
                        {drainType == 1 &&
                            <>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>手动排空：</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{width: '100%'}}>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>排空时间：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <InputNumber disabled={true} value={flushSec} style={{width: 50}}/>秒
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>排空克重：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={15}>
                                        <InputNumber disabled={true} value={flushWeight} style={{width: 50}}/>克
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