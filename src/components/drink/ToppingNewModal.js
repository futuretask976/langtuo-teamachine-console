import React, { useEffect, useState } from 'react';
import { Input, InputNumber, Modal, Radio, Select, Space, Switch, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankObj, isBlankStr, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const ToppingNewModal = (props) => {
    // 对话框定义
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
        put('/drinkset/topping/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            toppingCode: toppingCode,
            toppingName: toppingName,
            toppingTypeCode: toppingTypeCode,
            measureUnit: measureUnit,
            state: state,
            validHourPeriod: validHourPeriod,
            cleanHourPeriod: cleanHourPeriod,
            convertCoefficient: convertCoefficient,
            flowSpeed: flowSpeed,
            thresholdMode: thresholdMode,
            threshold: threshold,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgPutSucceed'));
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert(applyLang('msgPutFailed') + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.toppingCode4Edit == undefined ? true : false;
    const [toppingCode, setToppingCode] = useState();
    const [toppingName, setToppingName] = useState();
    const [toppingTypeCode, setToppingTypeCode] = useState();
    const [measureUnit, setMeasureUnit] = useState(0);
    const [state, setState] = useState(1);
    const [validHourPeriod, setValidHourPeriod] = useState(1);
    const [cleanHourPeriod, setCleanHourPeriod] = useState(1);
    const [convertCoefficient, setConvertCoefficient] = useState(1.0);
    const [flowSpeed, setFlowSpeed] = useState(1);
    const [thresholdMode, setThresholdMode] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [comment, setComment] = useState();

    // 初始化定义
    const fetchTopping4Edit = () => {
        if (isBlankStr(props.toppingCode4Edit)) {
            return;
        }

        get('/drinkset/topping/get', {
            tenantCode: getTenantCode(),
            toppingCode: props.toppingCode4Edit
        }).then(resp => {
            let model = resp.model;
            setToppingCode(model.toppingCode);
            setToppingName(model.toppingName);
            setToppingTypeCode(model.toppingTypeCode);
            setMeasureUnit(model.measureUnit);
            setState(model.state);
            setValidHourPeriod(model.validHourPeriod);
            setCleanHourPeriod(model.cleanHourPeriod);
            setConvertCoefficient(model.convertCoefficient);
            setFlowSpeed(model.flowSpeed);
            setThresholdMode(model.thresholdMode);
            setThreshold(model.threshold);
            setComment(model.comment);
        });
    }
    useEffect(() => {
        fetchTopping4Edit();
    }, [props.toppingTypeCode4Edit]);
    const [toppingTypeList, setToppingTypeList] = useState([]);
    const fetchToppingTypeListData = () => {
        get('/drinkset/topping/type/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setToppingTypeList((prev => {
                let tmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(function(item) {
                        tmp.push({
                            label: item.toppingTypeName,
                            value: item.toppingTypeCode
                        });
                    });
                }
                return tmp;
            }));
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
            width={800}
        >
            <div style={{height: 425, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>物料编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="物料编码" allowClear value={toppingCode} onChange={(e) => setToppingCode(e.target.value)} disabled={isBlankStr(props.toppingCode4Edit) ? false : true} />
                            </div>
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
                                <Input placeholder="物料名称" allowClear value={toppingName} onChange={(e) => setToppingName(e.target.value)} />
                            </div>
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
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>计量单位：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Radio.Group disabled={true} onChange={(e) => setMeasureUnit(e.target.value)} value={measureUnit}>
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
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>转换系数：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <InputNumber disabled={true} min={1} max={9999} step={0.01} value={convertCoefficient} onChange={(e) => setConvertCoefficient(e)} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>转速：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Space><InputNumber min={1} max={9999} value={flowSpeed} onChange={(e) => setFlowSpeed(e)} /><span>档</span></Space>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>报警阈值类型：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'flex-start', height: '100%'}}>
                                <Radio.Group disabled='true' onChange={(e) => setThresholdMode(e.target.value)} value={thresholdMode}>
                                    <Radio value={0}>固定值</Radio>
                                    <Radio value={1}>百分比</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>报警阈值：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Space><InputNumber min={0} max={999} onChange={(e) => setThreshold(e)} value={threshold}/><span>克/分钟</span></Space>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={20}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={3} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} />
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default ToppingNewModal;