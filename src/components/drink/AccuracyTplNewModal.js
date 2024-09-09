import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray, isBlankStr } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const AccuracyTplNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);

        put('/drinkset/accuracy/put', {
            tenantCode: getTenantCode(),
            templateCode: templateCode,
            templateName: templateName,
            overMode: overMode,
            overAmount: overAmount,
            underMode: underMode,
            underAmount: underAmount,
            toppingCodeList: toppingCodeList,
            comment: comment
        }).then(respData => {
            if (respData.success) {
                alert("保存成功");
            } else {
                alert('保存失败：' + respData.errorMsg);
            }
        });

        setTimeout(() => {
            props.onClose();
            setLoading(false);
            setOpen(false);
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [templateCode, setTemplateCode] = useState(isBlankStr(props.templateCode4Edit) ? '' : props.templateCode4Edit);
    const [templateName, setTemplateName] = useState('');
    const [overMode, setOverMode] = useState(0);
    const [overAmount, setOverAmount] = useState(0);
    const [underMode, setUnderMode] = useState(0);
    const [underAmount, setUnderAmount] = useState(0);
    const [toppingCodeList, setToppingCodeList] = useState([]);
    const [comment, setComment] = useState('');
    const [toppingList4Select, setToppingList4Select] = useState([]);

    // 初始化动作相关
    const fetchTemplate4Edit = () => {
        if (isBlankStr(props.templateCode4Edit)) {
            return;
        }

        get('/drinkset/accuracy/get', {
            tenantCode: getTenantCode(),
            templateCode: props.templateCode4Edit
        }).then(respData => {
            let model = respData.model;
            setTemplateCode(model.templateCode);
            setTemplateName(model.templateName);
            setOverMode(model.overMode);
            setOverAmount(model.overAmount);
            setUnderMode(model.underMode);
            setUnderAmount(model.underAmount);
            setToppingCodeList(isArray(model.toppingCodeList) ? model.toppingCodeList : []);
            setComment(model.comment);
        });
    }
    const fetchToppingList4Select = () => {
        get('/drinkset/topping/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setToppingList4Select(prev => {
                let tmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(topping => {
                        tmp.push({
                            label: topping.toppingName,
                            value: topping.toppingCode
                        });
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchToppingList4Select();
    }, []);
    useEffect(() => {
        fetchTemplate4Edit();
    }, [props.templateCode4Edit]);
 
    return (
        <>
            <Modal
                centered
                loading={loading}
                onCancel={onClickCancel}
                onOk={onClickOK}
                open={open}
                style={{border: '0px solid red'}}
                title="新建/编辑模板"
                width={600}
            >
                <div style={{height: 350, width: '100%'}}>
                    <Space direction='vertical' size={20} style={{width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <Space size='small'><span style={{color: 'red'}}>*</span><span>模板编码：</span></Space>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={20}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Input placeholder="模板编码" disabled={isBlankStr(props.templateCode4Edit) ? false : true} value={templateCode} onChange={(e) => setTemplateCode(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>模板名称：</span></Space>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={20}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Input placeholder="模板名称" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>上溢单位：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Select
                                        disabled='true'
                                        onChange={(e) => setOverMode(e)}
                                        options={[
                                            {
                                                label: '固定值',
                                                value: 0
                                            },
                                            {
                                                label: '百分比',
                                                value: 1
                                            }
                                        ]}
                                        size='small'
                                        style={{width: '100%'}}
                                        value={overMode}
                                    />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>上溢值：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <InputNumber min={1} max={10000} size="small" value={overAmount} onChange={(e) => setOverAmount(e)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>下溢单位：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Select
                                        disabled='true'
                                        onChange={(e) => setUnderMode(e)}
                                        options={[
                                            {
                                                label: '固定值',
                                                value: 0
                                            },
                                            {
                                                label: '百分比',
                                                value: 1
                                            }
                                        ]}
                                        size='small'
                                        style={{width: '100%'}}
                                        value={underMode}
                                    />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>下溢值：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <InputNumber min={1} max={10000} size="small" value={underAmount} onChange={(e) => setUnderAmount(e)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>应用物料：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={20}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Select
                                        onChange={(e) => setToppingCodeList(e)}
                                        options={toppingList4Select}
                                        mode='multiple'
                                        style={{width: '100%'}}
                                        value={toppingCodeList}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={4}>
                                <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>备注：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={20}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <TextArea rows={3} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default AccuracyTplNewModal;