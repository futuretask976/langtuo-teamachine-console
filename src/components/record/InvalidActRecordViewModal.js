import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, InputNumber, Modal, Space, Col, Row } from 'antd';
import dayjs from 'dayjs';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

dayjs.locale('zh-cn');

const InvalidActRecordViewModal = (props) => {
    // 对话框相关
    const [open, setOpen] = useState(true);
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [machineCode, setMachineCode] = useState('');
    const [shopGroupName, setShopGroupName] = useState('');
    const [shopName, setShopName] = useState('');
    const [invalidTime, setInvalidTime] = useState();
    const [toppingName, setToppingName] = useState('');
    const [pipelineNum, setPipelineNum] = useState(0);
    const [invalidAmount, setInvalidAmount] = useState(0);

    // 赋值初始化
    const fetchInvalidActRecord = () => {
        if (isBlankStr(props.idempotentMark4View)) {
            return;
        }

        get('/recordset/invalid/get', {  
            tenantCode: getTenantCode(),
            idempotentMark: props.idempotentMark4View
        }).then(respData => {
            let model = respData.model;
            setMachineCode(model.machineCode);
            setShopGroupName(model.shopGroupName);
            setShopName(model.shopName);
            setInvalidTime(model.invalidTime);
            setToppingName(model.toppingName);
            setPipelineNum(model.pipelineNum);
            setInvalidAmount(model.invalidAmount);
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
                title="查看详情"
                width={800}
                footer={[
                    <Button key="back" onClick={onClickCancel}>关闭</Button>,
                ]}
            >
                <div style={{height: 250, width: '100%'}}>
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
                                    <span>失效时间：</span>
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
                                    value={dayjs(invalidTime, 'YYYY-MM-DD HH:mm:ss')}
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
                                <Input placeholder="管道序号" disabled={true} value={pipelineNum}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>失效数量：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <InputNumber disabled={true} size="small" value={invalidAmount}/>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                &nbsp;
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default InvalidActRecordViewModal;