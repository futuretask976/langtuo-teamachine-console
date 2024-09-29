import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table } from 'antd';

import '../../css/common.css';
import { isArray, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

const TeaNewModalActStepPane = (props) => {
    // 数据定义
    const [toppingList4Select, setToppingList4Select] = useState();
    const [actStepList, setActStepList] = useState(() => {
        if (!isArray(props.toppingBaseRuleList4Edit)) {
            return [];
        }

        let actStepList = [];
        props.toppingBaseRuleList4Edit.forEach(toppingBaseRule => {
            let stepIndex = toppingBaseRule.stepIndex;
            let actStep = actStepList[stepIndex - 1];
            if (actStep == undefined) {
                actStep = {
                    stepIndex: stepIndex,
                    toppingBaseRuleList: []
                };
                actStepList.push(actStep);
            }
            actStep.toppingBaseRuleList.push(toppingBaseRule);
        });
        return actStepList;
    });
    const [stepIndex, setStepIndex] = useState(() => {
        let stepIndex = 0;
        if(isArray(props.actStepList4Edit)) {
            stepIndex = props.actStepList4Edit.length;
        }
        return stepIndex + 1;
    });
    

    // 动作定义
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
                        toppingTmp.value = item.toppingCode;
                        toppingList4SelectTmp.push(toppingTmp);
                    });
                }
                return toppingList4SelectTmp;
            }));
        });
    }
    const onClickAddStep = (e) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep) => (
                tmp.push(actStep)
            ));
            tmp.push({
                stepIndex: stepIndex,
                toppingBaseRuleList: []
            });
            setStepIndex(stepIndex + 1);
            return tmp;
        }));
    }
    const onClickDeleteStep = (e) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep) => {
                tmp.push(actStep)
            });
            tmp.pop();
            setStepIndex(stepIndex - 1);
            return tmp;
        }));
    }
    const onChangeToppingCodeList = (selectedToppingCodeList, stepIndex) => {
        setActStepList((prev => {
            let tmp = [];
            prev.forEach((actStep) => {
                if (actStep.stepIndex == stepIndex) {
                    let toppingBaseRuleList = [];
                    selectedToppingCodeList.forEach(selectedToppingCode => {
                        let toppingTmp = findExistToppingRule(selectedToppingCode, actStep.toppingBaseRuleList);
                        if (toppingTmp == undefined) {
                            toppingTmp = findNewToppingRule(selectedToppingCode, stepIndex);
                        }
                        toppingBaseRuleList.push(toppingTmp);
                    })
                    actStep.toppingBaseRuleList = toppingBaseRuleList;
                    tmp.push(actStep)
                } else {
                    tmp.push(actStep)
                }
            });
            return tmp;
        }));
    }
    const findNewToppingRule = (toppingCode, stepIndex) => {
        let toppingBaseRule = {};
        toppingList4Select.forEach(topping => {
            if (topping.toppingCode == toppingCode) {
                toppingBaseRule.stepIndex = stepIndex;
                toppingBaseRule.toppingCode = topping.toppingCode;
                toppingBaseRule.toppingName = topping.toppingName;
                toppingBaseRule.measureUnit = topping.measureUnit;
                toppingBaseRule.baseAmount = 0;
            }
        });
        return toppingBaseRule;
    }
    const findExistToppingRule = (toppingCode, toppingBaseRuleList) => {
        let found = undefined;
        if (!isArray(toppingBaseRuleList)) {
            return found;
        }

        toppingBaseRuleList.forEach(toppingBaseRule => {
            if (toppingBaseRule.toppingCode == toppingCode) {
                found = toppingBaseRule;
            }
        });
        return found;
    }
    const convertToToppingBaseRuleList = () => {
        let tmp = [];
        if (!isArray(actStepList)) {
            return tmp;
        }
        actStepList.forEach(actStep => {
            if (isArray(actStep.toppingBaseRuleList)) {
                actStep.toppingBaseRuleList.forEach(toppingBaseRule => {
                    tmp.push(toppingBaseRule);
                });
            }
        });
        return tmp;
    }
    useEffect(() => {
        fetchToppingList4Select();
    }, []);
    useEffect(() => {
        props.updateToppingBaseRuleList(convertToToppingBaseRuleList(actStepList));
    }, [actStepList]);

    // 表格定义
    const actStepListCols = [
        {
            title: '步骤',
            dataIndex: 'stepIndex',
            key: 'stepIndex',
            width: '10%'
        },
        {
            title: '物料',
            dataIndex: 'toppingList4Select',
            key: 'toppingList4Select',
            width: '90%',
            render: (_, {stepIndex, toppingBaseRuleList}) => (
                <Select
                    placeholder="请选择"
                    mode="multiple"
                    onChange={(e) => onChangeToppingCodeList(e, stepIndex)}
                    options={toppingList4Select}
                    size="middle"
                    style={{width: '100%'}}
                    value={convertToSelectedToppingCodeList(toppingBaseRuleList)}
                />
            ),
        }
    ];
    const convertToSelectedToppingCodeList = (toppingBaseRuleList) => {
        let tmp = [];
        if (!isArray(toppingBaseRuleList)) {
            return tmp;
        }
        toppingBaseRuleList.forEach(toppingBaseRule => {
            tmp.push(toppingBaseRule.toppingCode);
        })
        return tmp;
    }

    return (
        <div className="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '15%', width: '98%'}}>
                <Space>
                    <Button key="addStep" onClick={onClickAddStep} type="primary" style={{height: 35, width: 100}}>新增步骤</Button>
                    <Button key="reduceStep" onClick={onClickDeleteStep} type="primary" style={{height: 35, width: 100}}>删减步骤</Button>
                </Space>
            </div>
            <div className="flex-row-cont" style={{alignItems: 'flex-start', height: '85%', width: '98%'}}>
                <Table 
                    columns={actStepListCols} 
                    dataSource={actStepList} 
                    pagination={false} 
                    scroll={{ y: 250 }} 
                    size='small' 
                    style={{height: '100%', width: '100%'}} 
                    rowKey={record => record.stepIndex}/>
            </div>
        </div>
    );
};

export default TeaNewModalActStepPane;