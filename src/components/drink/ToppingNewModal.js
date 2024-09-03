import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Radio, Select, Space, Switch, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getJwtToken, getTenantCode, getRespModel, handleRespError, isBlankObj, isBlankStr, isRespSuccess, isValidCode, isValidComment, isValidName } from '../../js/common.js';

const { TextArea } = Input;

const ToppingNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(toppingCode, true)) {
            alert('物料编码不符合规则');
            return;
        }
        if (!isValidName(toppingName, true)) {
            alert('物料名称不符合规则');
            return;
        }
        if (!isValidCode(toppingTypeCode, true)) {
            alert('物料类型编码不符合规则');
            return;
        }
        if (isBlankObj(validHourPeriod)) {
            alert('维保期不符合规则');
            return;
        }
        if (isBlankObj(cleanHourPeriod)) {
            alert('清洗期不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }

        setLoading(true);
        let url = genPostUrl('/drinkset/topping/put');
        axios.put(url, {
            toppingCode: toppingCode,
            toppingName: toppingName,
            toppingTypeCode: toppingTypeCode,
            measureUnit: measureUnit,
            state: state,
            validHourPeriod: validHourPeriod,
            cleanHourPeriod: cleanHourPeriod,
            convertCoefficient: convertCoefficient,
            flowSpeed: flowSpeed,
            comment: comment,
            tenantCode: getTenantCode()
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("保存成功")
            } else {
                alert("保存失败，请重试，或联系管理员处理")
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
    const [toppingCode, setToppingCode] = useState(isBlankStr(props.toppingCode4Edit) ? '' : props.toppingCode4Edit);
    const [toppingName, setToppingName] = useState('');
    const [toppingTypeCode, setToppingTypeCode] = useState('');
    const [measureUnit, setMeasureUnit] = useState(0);
    const [state, setState] = useState(1);
    const [validHourPeriod, setValidHourPeriod] = useState(0);
    const [cleanHourPeriod, setCleanHourPeriod] = useState(0);
    const [convertCoefficient, setConvertCoefficient] = useState(0.0);
    const [flowSpeed, setFlowSpeed] = useState(1);
    const [comment, setComment] = useState('');
    const fetchTopping4Edit = () => {
        if (isBlankStr(props.toppingCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/topping/{segment}/{segment}/get', [getTenantCode(), props.toppingCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setToppingCode(model.toppingCode);
            setToppingName(model.toppingName);
            setToppingTypeCode(model.toppingTypeCode);
            setMeasureUnit(model.measureUnit);
            setState(model.state);
            setValidHourPeriod(model.validHourPeriod);
            setCleanHourPeriod(model.cleanHourPeriod);
            setConvertCoefficient(model.convertCoefficient);
            setFlowSpeed(model.flowSpeed);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchTopping4Edit();
    }, [props.toppingTypeCode4Edit]);
    const [toppingTypeList, setToppingTypeList] = useState([]);
    const fetchToppingTypeListData = () => {
        let url = genGetUrlByParams('/drinkset/topping/type/list', {
            tenantCode: getTenantCode()
        });
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setToppingTypeList((prev => {
                let tmp = [];
                model.forEach(function(item) {
                    tmp.push({
                        label: item.toppingTypeName,
                        value: item.toppingTypeCode
                    });
                });
                return tmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchToppingTypeListData();
    }, []);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            style={{border: '0px solid red'}}
            title="新建/编辑物料"
            width={650}
        >
            <div style={{height: 380, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>物料编码：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="物料编码" value={toppingCode} onChange={(e) => setToppingCode(e.target.value)} disabled={isBlankStr(props.toppingCode4Edit) ? false : true} />
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
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>物料名称：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="物料名称" value={toppingName} onChange={(e) => setToppingName(e.target.value)} />
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
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>物料类型：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Select
                                value={toppingTypeCode}
                                style={{width: '100%'}}
                                onChange={(e) => setToppingTypeCode(e)}
                                options={toppingTypeList}
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
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>计量单位：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Radio.Group disabled='true' onChange={(e) => setMeasureUnit(e.target.value)} value={measureUnit}>
                                <Radio value={0}>克</Radio>
                                <Radio value={1}>毫升</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>状态：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={state === 1 ? true : false} onChange={(e) => setState(e == true ? 1 : 0)} />
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
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>维保期：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Space><InputNumber min={1} max={9999} value={validHourPeriod} onChange={(e) => setValidHourPeriod(e)} /><span>小时</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>清洗期：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Space><InputNumber min={1} max={9999} value={cleanHourPeriod} onChange={(e) => setCleanHourPeriod(e)} /><span>小时</span></Space>
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
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>转换系数：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <InputNumber disabled='true' min={0} max={9999} step={0.01} value={convertCoefficient} onChange={(e) => setConvertCoefficient(e)} />
                        </div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <Space size='small'><span style={{color: 'red'}}>*</span><span>转速：</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Space><InputNumber min={0} max={99} value={flowSpeed} onChange={(e) => setFlowSpeed(e)} /><span>档</span></Space>
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
                            <TextArea rows={3} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} />
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default ToppingNewModal;