import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Switch, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl } from '../../js/common.js';

const { TextArea } = Input;

const ToppingAccuracyTemplateNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/topping/accuracy/template/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            tenantCode: 'tenant_001',
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
            templateCode: templateCode,
            templateName: templateName,
            state: state,
            overUnit: overUnit,
            overAmount: overAmount,
            underUnit: underUnit,
            underAmount: underAmount,
            toppingCode: toppingCode,
            comment: comment
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
    const [templateCode, setTemplateCode] = useState(isBlankStr(props.templateCode4Edit) ? '' : props.templateCode4Edit);
    const [templateName, setTemplateName] = useState('');
    const [state, setState] = useState(0);
    const [overUnit, setOverUnit] = useState(0);
    const [overAmount, setOverAmount] = useState(0);
    const [underUnit, setUnderUnit] = useState(0);
    const [underAmount, setUnderAmount] = useState(0);
    const [toppingCode, setToppingCode] = useState('');
    const [comment, setComment] = useState('');
    const [toppingList4Select, setToppingList4Select] = useState([]);
    useEffect(() => {
        if (isBlankStr(props.templateCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/topping/accuracy/template/{segment}/{segment}/get', ['tenant_001', props.templateCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setTemplateCode(response.data.model.templateCode);
                setTemplateName(response.data.model.templateName);
                setState(response.data.model.state);
                setOverUnit(response.data.model.overUnit);
                setOverAmount(response.data.model.overAmount);
                setUnderUnit(response.data.model.underUnit);
                setUnderAmount(response.data.model.underAmount);
                setToppingCode(response.data.model.toppingCode);
                setComment(response.data.model.comment);
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
    }, [props.templateCode4Edit]);
    useEffect(() => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setToppingList4Select(prev => {
                    let tmp = [];
                    response.data.model.forEach(topping => {
                        tmp.push({
                            label: topping.toppingName,
                            value: topping.toppingCode
                        });
                    });
                    return tmp;
                });
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
    }, []);

    // 输入相关
    const onChangeTemplateCode = (e) => {
        setTemplateCode(e.target.value);
    }
    const onChangeTemplateName = (e) => {
        setTemplateName(e.target.value);
    }
    const onChangeState = (e) => {
        setState(e ? 1 : 0);
    }
    const onChangeOverUnit = (e) => {
        setOverUnit(e);
    }
    const onChangeOverAmount = (e) => {
        setOverAmount(e);
    }
    const onChangeUnderUnit = (e) => {
        setUnderUnit(e);
    }
    const onChangeUnderAmount = (e) => {
        setUnderAmount(e);
    }
    const onChangeToppingCode = (e) => {
        setToppingCode(e);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
 
    return (
        <>
            <Modal
                centered
                open={open}
                title="新建模板"
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={500}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                        提交
                    </Button>,
                ]}
            >
                <div style={{height: 380, width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>模板编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="模板编码" disabled={isBlankStr(props.templateCode4Edit) ? false : true} value={templateCode} onChange={onChangeTemplateCode} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>模板名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="模板名称" value={templateName} onChange={onChangeTemplateName} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
                        </Col>
                    </Row> 
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>状态：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={onChangeState} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
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
                                    size="small"
                                    style={{width: '100%'}}
                                    onChange={onChangeOverUnit}
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
                                    value={overUnit}
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
                                <InputNumber min={1} max={10000} onChange={onChangeOverAmount} size="small" value={overAmount}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
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
                                    size="small"
                                    style={{width: '100%'}}
                                    onChange={(e)=>onChangeUnderUnit(e)}
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
                                    value={underUnit}
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
                                <InputNumber min={1} max={10000} onChange={onChangeUnderAmount} size="small" value={underAmount}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
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
                                    size="small"
                                    style={{width: '100%'}}
                                    onChange={onChangeToppingCode}
                                    options={toppingList4Select}
                                    value={toppingCode}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{height: 20, width: '100%'}}>
                        <Col className="gutter-row" span={24}>
                            &nbsp;
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
                                <TextArea rows={3} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};
 
export default ToppingAccuracyTemplateNewModal;