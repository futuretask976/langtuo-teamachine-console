import React, { useEffect, useState } from 'react';
import { Input, InputNumber, Modal, Radio, Select, Space, Switch, Col, Row } from 'antd';

import '../../css/common.css';
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
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert("保存成功！");
            } else {
                alert('保存失败：' + respData.errorMsg);
            }
            setLoading(false);
            props.onClose();
            setOpen(false);
        });
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据定义
    const putNew = props.toppingCode4Edit == undefined ? true : false;
    const [toppingCode, setToppingCode] = useState();
    const [toppingName, setToppingName] = useState();
    const [toppingTypeCode, setToppingTypeCode] = useState();
    const [measureUnit, setMeasureUnit] = useState(0);
    const [state, setState] = useState(1);
    const [validHourPeriod, setValidHourPeriod] = useState(0);
    const [cleanHourPeriod, setCleanHourPeriod] = useState(0);
    const [convertCoefficient, setConvertCoefficient] = useState(0.0);
    const [flowSpeed, setFlowSpeed] = useState(1);
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
                            <Input placeholder="物料编码" allowClear value={toppingCode} onChange={(e) => setToppingCode(e.target.value)} disabled={isBlankStr(props.toppingCode4Edit) ? false : true} />
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
                            <Input placeholder="物料名称" allowClear value={toppingName} onChange={(e) => setToppingName(e.target.value)} />
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
                            <InputNumber disabled={true} min={0} max={9999} step={0.01} value={convertCoefficient} onChange={(e) => setConvertCoefficient(e)} />
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