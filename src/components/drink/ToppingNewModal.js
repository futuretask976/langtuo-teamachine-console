import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Radio, Select, Space, Switch, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl, getJwtToken, getTenantCode, getRespModel, handleRespError, isRespSuccess } from '../../js/common.js';

const { TextArea } = Input;

const ToppingNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
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
            // withCredentials: true, // 这会让axios在请求中携带cookies
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
            // withCredentials: true, // 这会让axios在请求中携带cookies
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
    

    // 输入相关
    const onChangeToppingCode = (e) => {
        setToppingCode(e.target.value);
    }
    const onChangeToppingName = (e) => {
        setToppingName(e.target.value);
    }
    const onChangeMeasureUnit = (e) => {
        setMeasureUnit(e.target.value);
    }
    const onChangeState = (e) => {
        setState(e == true ? 1 : 0);
    }
    const onChangeValidHourPeriod = (e) => {
        setValidHourPeriod(e);
    }
    const onChangeCleanHourPeriod = (e) => {
        setCleanHourPeriod(e);
    }
    const onChangeConvertCoefficient = (e) => {
        setConvertCoefficient(e);
    }
    const onChangeFlowSpeed = (e) => {
        setFlowSpeed(e);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
    const onChangeToppingTypeCode = (e) => {
        setToppingTypeCode(e);
    }
 
    return (
        <Modal
            centered
            open={open}
            title="新建物料"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={550}
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
                            <span>物料编码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="物料编码" value={toppingCode} onChange={onChangeToppingCode} disabled={isBlankStr(props.toppingCode4Edit) ? false : true} />
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
                            <span>物料名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="物料名称" value={toppingName} onChange={onChangeToppingName} />
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
                            <span>物料类型：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={20}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Select
                                value={toppingTypeCode}
                                style={{width: '100%'}}
                                onChange={onChangeToppingTypeCode}
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
                            <span>计量单位：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Radio.Group onChange={onChangeMeasureUnit} value={measureUnit}>
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
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>维保期：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Space><InputNumber min={1} max={99999999} value={validHourPeriod} onChange={onChangeValidHourPeriod} /><span>小时</span></Space>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>清洗期：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Space><InputNumber min={1} max={99999999} value={cleanHourPeriod} onChange={onChangeCleanHourPeriod} /><span>小时</span></Space>
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
                            <span>转换系数：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <InputNumber min={0} max={99999999} step={0.01} value={convertCoefficient} onChange={onChangeConvertCoefficient} />
                        </div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>转速：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Space><InputNumber min={0} max={99} value={flowSpeed} onChange={onChangeFlowSpeed} /><span>档</span></Space>
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
    );
};
 
export default ToppingNewModal;