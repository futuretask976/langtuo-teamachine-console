import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Switch, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, getJwtToken, getTenantCode, handleRespError, getRespModel, isRespSuccess } from '../../js/common.js';

const { TextArea } = Input;

const ToppingAccuracyTplNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/accuracy/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            templateCode: templateCode,
            templateName: templateName,
            state: state,
            overMode: overMode,
            overAmount: overAmount,
            underMode: underMode,
            underAmount: underAmount,
            toppingCode: toppingCode,
            comment: comment
        }, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("here is success")
            } else {
                alert("here is wrong")
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
    const [templateCode, setTemplateCode] = useState(isBlankStr(props.templateCode4Edit) ? '' : props.templateCode4Edit);
    const [templateName, setTemplateName] = useState('');
    const [state, setState] = useState(0);
    const [overMode, setOverMode] = useState(0);
    const [overAmount, setOverAmount] = useState(0);
    const [underMode, setUnderMode] = useState(0);
    const [underAmount, setUnderAmount] = useState(0);
    const [toppingCode, setToppingCode] = useState('');
    const [comment, setComment] = useState('');
    const [toppingList4Select, setToppingList4Select] = useState([]);
    const fetchTemplate4Edit = () => {
        if (isBlankStr(props.templateCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/accuracy/{segment}/{segment}/get', [getTenantCode(), props.templateCode4Edit]);
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setTemplateCode(model.templateCode);
            setTemplateName(model.templateName);
            setState(model.state);
            setOverMode(model.overMode);
            setOverAmount(model.overAmount);
            setUnderMode(model.underMode);
            setUnderAmount(model.underAmount);
            setToppingCode(model.toppingCode);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchTemplate4Edit();
    }, [props.templateCode4Edit]);
    const fetchToppingList4Select = () => {
        let url = genGetUrlByParams('/drinkset/topping/list', {
            tenantCode: getTenantCode()
        });
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setToppingList4Select(prev => {
                let tmp = [];
                model.forEach(topping => {
                    tmp.push({
                        label: topping.toppingName,
                        value: topping.toppingCode
                    });
                });
                return tmp;
            });
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchToppingList4Select();
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
        setOverMode(e);
    }
    const onChangeOverAmount = (e) => {
        setOverAmount(e);
    }
    const onChangeUnderUnit = (e) => {
        setUnderMode(e);
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
 
export default ToppingAccuracyTplNewModal;