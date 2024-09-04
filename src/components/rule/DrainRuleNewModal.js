import React, { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Space, Switch, Table, Col, Row } from 'antd';

import '../../css/common.css';
import { isBlankArray, isBlankStr, getTenantCode } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const DrainRuleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);

        put('/ruleset/drain/put', {
            tenantCode: getTenantCode(),
            drainRuleCode: drainRuleCode,
            drainRuleName: drainRuleName,
            defaultRule: defaultRule,
            toppingRuleList: toppingRuleList
        }).then(resp => {
            if (resp.success) {
                alert("保存成功");
            } else {
                alert('保存失败：' + resp.errorMsg);
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
    const [drainRuleCode, setDrainRuleCode] = useState(isBlankStr(props.drainRuleCode4Edit) ? '' : props.drainRuleCode4Edit);
    const [drainRuleName, setDrainRuleName] = useState('');
    const [defaultRule, setDefaultRule] = useState(0);

    // 初始化动作相关
    const fetchDrainRule4Edit = () => {
        if (isBlankStr(props.drainRuleCode4Edit)) {
            return;
        }

        get('/ruleset/drain/get', {  
            tenantCode: getTenantCode(),
            drainRuleCode: props.drainRuleCode4Edit
        }).then(resp => {
            let model = resp.model;
            setDrainRuleCode(model.drainRuleCode);
            setDrainRuleName(model.drainRuleName);
            setDefaultRule(model.defaultRule);
            setToppingRuleList(prev => {
                let tmp = [];
                model.toppingRuleList.forEach(item => {
                    item.actions = ['delete'];
                    tmp.push(item);
                });
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchDrainRule4Edit();
    }, [props.drainRuleCode4Edit]);

    // 物料规则相关
    const [toppingList4Select, setToppingList4Select] = useState([]);
    const [toppingCodeList4Selected, setToppingCodeList4Selected] = useState([]);
    const [toppingRuleList, setToppingRuleList] = useState([]);
    const [flushSec, setFlushSec] = useState(0);
    const [flushWeight, setFlushWeight] = useState(0);
    const fetchToppingList4Select = () => {
        get('/drinkset/topping/list', {  
            tenantCode: getTenantCode()
        }).then(resp => {
            let model = resp.model;
            setToppingList4Select((prev => {
                let toppingList4SelectTmp = [];
                model.forEach(item => {
                    let toppingTmp = {...item};
                    toppingTmp.key = item.toppingCode;
                    toppingTmp.label = item.toppingName;
                    toppingTmp.toppingName = item.toppingName;
                    toppingTmp.value = item.toppingCode;
                    toppingTmp.toppingCode = item.toppingCode;
                    toppingList4SelectTmp.push(toppingTmp);
                })
                return toppingList4SelectTmp;
            }));
        });
    }
    useEffect(() => {
        fetchToppingList4Select();
    }, []);

    // 物料规则表格相关
    const toppingRuleCols = [
        {
            title: '物料名称',
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '35%'
        },
        {
            title: '排空时间',
            dataIndex: 'flushSec',
            key: 'flushSec',
            width: '25%'
        },
        {
            title: '排空克重',
            dataIndex: 'flushWeight',
            key: 'flushWeight',
            width: '25%'
        },
        {
            title: '操作',
            key: 'actions',
            width: '15%',
            render: (_, { toppingName, toppingCode, actions }) => (
                <Space size="middle">
                    {actions.map((action) => {
                        if (action == 'delete') {
                            return (
                                <a key={action + '_' + toppingCode} onClick={(e) => onClickDeleteToppingRule(e, toppingCode)}>删除</a>
                            );
                        }
                    })}
                </Space>
            ),
        },
    ];
    const onClickDeleteToppingRule = () => {
        
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
        if (isBlankArray(toppingRuleList)) {
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
                open={open}
                title="新建规则"
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={800}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                        提交
                    </Button>,
                ]}
            >
                <div style={{height: 500, width: '100%'}}>
                    <Space direction='vertical' size={20}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>规则编码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="规则编码" disabled={isBlankStr(props.drainRuleCode4Edit) ? false : true} value={drainRuleCode} onChange={(e) => setDrainRuleCode(e.target.value)} />
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>规则名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={9}>
                                <Input placeholder="规则名称" value={drainRuleName} onChange={(e) => setDrainRuleName(e.target.value)} />
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>是否默认：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <Switch checkedChildren="支持" unCheckedChildren="不支持" checked={defaultRule === 1 ? true : false} onChange={(e) => setDefaultRule(e ? 1 : 0)} />
                            </Col>
                            <Col className="gutter-row" span={16}>
                                &nbsp;
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>选择物料：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={21}>
                                <Select
                                    placeholder="请选择"
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
                                    <span>排出时间：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <InputNumber min={0} max={999} onChange={(e) => setFlushSec(e)} value={flushSec}/>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>排出克重：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <InputNumber min={0} max={999} onChange={(e) => setFlushWeight(e)} value={flushWeight}/>
                            </Col>
                            <Col className="gutter-row" span={5}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end'}}>
                                    <Button onClick={onClickAddToppingRule} type='primary'>新增物料规则</Button>
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
                                    rowKey={record=>record.id}
                                    scroll={{ y: 170 }}
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