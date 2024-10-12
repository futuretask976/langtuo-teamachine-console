import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Space, Switch, Table, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankStr, isEmptyArray, isValidCode, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const DrainRuleNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(drainRuleCode, true)) {
            alert(applyLang('msgRuleCodeInvalid'));
            return;
        }
        if (!isValidName(drainRuleName, true)) {
            alert(applyLang('msgRuleNameInvalid'));
            return;
        }
        if (isEmptyArray(toppingRuleList)) {
            alert(applyLang('msgToppingListEmpty'));
            return;
        }

        setLoading(true);
        put('/ruleset/drain/put', {
            tenantCode: getTenantCode(),
            drainRuleCode: drainRuleCode,
            drainRuleName: drainRuleName,
            defaultRule: defaultRule,
            toppingRuleList: toppingRuleList,
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
    const putNew = props.drainRuleCode4Edit == undefined ? true : false;
    const [drainRuleCode, setDrainRuleCode] = useState();
    const [drainRuleName, setDrainRuleName] = useState();
    const [defaultRule, setDefaultRule] = useState(0);
    const [toppingList4Select, setToppingList4Select] = useState([]);
    const [toppingCodeList4Selected, setToppingCodeList4Selected] = useState([]);
    const [toppingRuleList, setToppingRuleList] = useState([]);
    const [flushSec, setFlushSec] = useState(1);
    const [flushWeight, setFlushWeight] = useState(1);

    // 初始化定义
    const fetchDrainRule4Edit = () => {
        if (isBlankStr(props.drainRuleCode4Edit)) {
            return;
        }

        get('/ruleset/drain/get', {  
            tenantCode: getTenantCode(),
            drainRuleCode: props.drainRuleCode4Edit
        }).then(respData => {
            let model = respData.model;
            setDrainRuleCode(model.drainRuleCode);
            setDrainRuleName(model.drainRuleName);
            setDefaultRule(model.defaultRule);
            setToppingRuleList(prev => {
                let tmp = [];
                if (isArray(model.toppingRuleList)) {
                    model.toppingRuleList.forEach(item => {
                        item.actions = ['delete'];
                        tmp.push(item);
                    });
                }
                return tmp;
            });
        });
    }
    const fetchToppingList4Select = () => {
        get('/drinkset/topping/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            setToppingList4Select((prev => {
                let toppingList4SelectTmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        let toppingTmp = {...item};
                        toppingTmp.key = item.toppingCode;
                        toppingTmp.label = item.toppingName;
                        toppingTmp.toppingName = item.toppingName;
                        toppingTmp.value = item.toppingCode;
                        toppingTmp.toppingCode = item.toppingCode;
                        toppingList4SelectTmp.push(toppingTmp);
                    });
                }
                return toppingList4SelectTmp;
            }));
        });
    }
    useEffect(() => {
        fetchToppingList4Select();
        fetchDrainRule4Edit();
    }, []);

    // 输入定义
    const toppingRuleCols = [
        {
            title: applyLang('labelToppingName'),
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '35%'
        },
        {
            title: applyLang('labelFlushSec'),
            dataIndex: 'flushSec',
            key: 'flushSec',
            width: '25%'
        },
        {
            title: applyLang('labelFlushWeight'),
            dataIndex: 'flushWeight',
            key: 'flushWeight',
            width: '25%'
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '15%',
            render: (_, { toppingName, toppingCode, actions }) => (
                <Space size="middle">
                    {actions.map((action) => {
                        if (action == 'delete') {
                            return (
                                <a key={action + '_' + toppingCode} onClick={(e) => onClickDeleteToppingRule(e, toppingCode)}>{applyLang('labelOpeDel')}</a>
                            );
                        }
                    })}
                </Space>
            ),
        },
    ];
    const onClickDeleteToppingRule = (e, toppingCode) => {
        alert(toppingCode);
    };
    const onClickAddToppingRule = () => {
        setToppingRuleList(prev => {
            let tmp = [];
            toppingCodeList4Selected.forEach(toppingCode => {
                let topping = getToppingByCode(toppingCode);
                tmp.push({
                    toppingCode: topping.toppingCode,
                    toppingName: topping.toppingName,
                    flushSec: flushSec,
                    flushWeight: flushWeight,
                    actions: ['delete']
                });
            });

            prev.forEach(p => {
                if (!inToppingRuleList(p.toppingCode, tmp)) {
                    tmp.push(p);
                }
            });
            return tmp;
        });
    }
    const inToppingRuleList = (toppingCode, toppingRuleList) => {
        if (isEmptyArray(toppingRuleList)) {
            return false;
        }
        let alreadyIn = false;
        toppingRuleList.forEach(toppingRule => {
            if (toppingRule.toppingCode == toppingCode) {
                alreadyIn = true;
            }
        });
        return alreadyIn;
    };
    const onChangeToppingCode = (selectedList) => {
        setToppingCodeList4Selected(selectedList);
    };
    const getToppingByCode = (toppingCode) => {
        let result = null;
        toppingList4Select.forEach(topping => {
            if (topping.toppingCode == toppingCode) {
                result = topping;
            }
        });
        return result;
    }
 
    return (
        <>
            <Modal
                centered
                confirmLoading={loading}
                open={open}
                title={applyLang('labelNewOrEdit')}
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={750}
            >
                <div style={{height: 450, width: '100%'}}>
                    <Space direction='vertical' size={20}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptRuleCode')}</span></Space>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder={applyLang('labelRuleCode')} disabled={isBlankStr(props.drainRuleCode4Edit) ? false : true} value={drainRuleCode} onChange={(e) => setDrainRuleCode(e.target.value)} />
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptRuleName')}</span></Space>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder={applyLang('labelRuleName')} value={drainRuleName} onChange={(e) => setDrainRuleName(e.target.value)} />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptDefaultRule')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <Switch checkedChildren={applyLang('labelYes')} unCheckedChildren={applyLang('labelNo')} checked={defaultRule === 1 ? true : false} onChange={(e) => setDefaultRule(e ? 1 : 0)} />
                            </Col>
                            <Col className="gutter-row" span={16}>
                                &nbsp;
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptApplyTopping')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Select
                                    placeholder={applyLang('labelPleaseSelect')}
                                    mode="multiple"
                                    onChange={(e) => onChangeToppingCode(e)}
                                    options={toppingList4Select}
                                    size="middle"
                                    style={{width: '100%'}}
                                    value={toppingCodeList4Selected}
                                />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={7}>
                                &nbsp;
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptFlushSec')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <InputNumber min={1} max={9999} onChange={(e) => setFlushSec(e)} value={flushSec}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>{applyLang('promptFlushWeight')}</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <InputNumber min={1} max={9999} onChange={(e) => setFlushWeight(e)} value={flushWeight}/>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><Button onClick={onClickAddToppingRule} type='primary'>{applyLang('labelAddToppingRule')}</Button></Space>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{height: 220, width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                &nbsp;
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Table
                                    columns={toppingRuleCols} 
                                    dataSource={toppingRuleList}
                                    pagination={false}
                                    rowKey={record=>record.toppingCode}
                                    scroll={{ y: 200 }}
                                    size='small'
                                    style={{width: '100%'}} />
                            </Col>
                        </Row>
                    </Space>
                </div>
            </Modal>
        </>
    );
};
 
export default DrainRuleNewModal;