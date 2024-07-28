import React, { useEffect, useState } from 'react';
import { InputNumber, Select, Space, Table } from 'antd';

import '../../css/common.css';
import { isArray, isBlankObj, isBlankStr, isNumber } from '../../js/common.js';

const TeaNewModalAdjustRulePane = (props) => {
    // 状态变量初始化相关
    const [teaUnitList, setTeaUnitList] = useState(() => {
        if (isArray(props.teaUnitList4Edit)) {
            let tmp = [...props.teaUnitList4Edit];
            tmp.forEach(item => {
                item.backgroundColor = '#FFFFFF';
            });
            return tmp;
        }
        return [];
    });
    const [curTeaUnitCode, setCurTeaUnitCode] = useState('');
    const [curToppingAdjustRuleList, setCurToppingAdjustRuleList] = useState([]);

    // 规格项组合初始化相关
    const genToppingAdjustRuleList = () => {
        let toppingAdjustRuleList = [];
        props.actStepList4Edit.forEach(actStep => {
            actStep.toppingBaseRuleList.forEach(toppingBaseRule => {
                toppingAdjustRuleList.push({
                    stepIndex: actStep.stepIndex,
                    toppingName: toppingBaseRule.toppingName,
                    toppingCode: toppingBaseRule.toppingCode,
                    measureUnit: toppingBaseRule.measureUnit,
                    baseAmount: toppingBaseRule.baseAmount,
                    actualAmount: toppingBaseRule.baseAmount,
                });
            })
        });
        return toppingAdjustRuleList;
    }
    const isTeaUnitListEqual = (teaUnitList1, teaUnitList2) => {
        let length1 = teaUnitList1.length;
        let length2 = teaUnitList2.length;
        if (length1 != length2) {
            return false;
        }
        for (let i = 0; i < length1; i++) {
            let teaUnit1 = teaUnitList1[i];
            let teaUnit2 = teaUnitList2[i];
            if (teaUnit1.teaUnitCode != teaUnit2.teaUnitCode) {
                return false;
            }
        }
        return true;
    }
    const doGenTeaUnitList = (specItemRuleLists, index, combo, resultList) => {
        if (combo == null || combo == undefined) {
            combo = [];
        }
        if (index == specItemRuleLists.length) {
            let specItemRuleListTmp = [];
            let teaUnitCode = '';
            let teaUnitName = '';
            combo.sort((a, b) => a.specCode.localeCompare(b.specCode));
            combo.forEach(f => {
                specItemRuleListTmp.push(f);
                teaUnitCode = teaUnitCode + '-' + f.specItemCode;
                teaUnitName = teaUnitName + '-' + f.specItemName;
            })
            resultList.push({
                teaUnitCode: teaUnitCode.slice(1),
                teaUnitName: teaUnitName.slice(1),
                specItemRuleList: specItemRuleListTmp,
                backgroundColor: '#FFFFFF'
            });
            return;
        }

        let list = specItemRuleLists[index];
        list.forEach(s => {
            combo.push(s);
            doGenTeaUnitList(specItemRuleLists, index + 1, combo, resultList);
            combo.pop();
        });
    }
    const genTeaUnitList = () => {
        // 从specRuleList过滤出上一步选中的specItem，放到specItemRuleLists中
        let specItemRuleLists = [];
        props.specRuleList4Edit.forEach(specRule => {
            let specItemRuleListTmp = [];
            specRule.specItemRuleList.forEach(specItemRule => {
                if (specItemRule.selected == 1) {
                    specItemRule.specCode = specRule.specCode;
                    specItemRuleListTmp.push(specItemRule);
                }
            })
            specItemRuleLists.push(specItemRuleListTmp);
        });

        // 根据过滤过的specItemRuleLists，生成teaUnitListTmp
        let teaUnitListTmp = [];
        doGenTeaUnitList(specItemRuleLists, 0, null, teaUnitListTmp);
        teaUnitListTmp.forEach(teaUnit => {
            teaUnit.toppingAdjustRuleList = genToppingAdjustRuleList();
        })
        
        setTeaUnitList(prev => {
            prev.sort((a, b) => a.teaUnitCode.localeCompare(b.teaUnitCode));
            teaUnitListTmp.sort((a, b) => a.teaUnitCode.localeCompare(b.teaUnitCode));
            if (isTeaUnitListEqual(prev, teaUnitListTmp)) {
                return prev;
            } else {
                return teaUnitListTmp;
            }
        });
    }
    useEffect(() => {
        genTeaUnitList();
    }, [props.specRuleList4Edit, props.actStepList4Edit]);
    

    // TeaUnit 操作
    const onClickTeaUnit = (e, teaUnitCode) => {
        setTeaUnitList(prev => {
            let tmp = [];
            teaUnitList.forEach(teaUnit => {
                if (teaUnit.teaUnitCode == teaUnitCode) {
                    teaUnit.backgroundColor = '#145CFE';
                    teaUnit.textColor = 'white';
                    teaUnit.selected = 1;
                    setCurTeaUnitCode(teaUnit.teaUnitCode);
                    setCurToppingAdjustRuleList(prev => {
                        return teaUnit.toppingAdjustRuleList;
                    })
                } else {
                    teaUnit.backgroundColor = 'white';
                    teaUnit.textColor = '#818181';
                    teaUnit.selected = 0;
                }
                tmp.push(teaUnit);
            });
            return tmp;
        })
    }
    useEffect(() => {
        props.updateTeaUnitList(teaUnitList);
    }, [teaUnitList]);

    // 物料调整表格相关
    const toppingAdjustRuleCols = [
        {
            title: '步骤',
            dataIndex: 'stepIndex',
            key: 'stepIndex',
        },
        {
            title: '物料名称',
            dataIndex: 'toppingName',
            key: 'toppingName',
        },
        {
            title: '修改',
            dataIndex: 'adjustMode',
            key: 'adjustMode',
            render: (_, { adjustMode, toppingCode }) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
                    onChange={(e)=>onChangeAdjustMode(e, toppingCode)}
                    options={[
                        {
                            label: '增加',
                            value: 'add'
                        },
                        {
                            label: '减少',
                            value: 'reduce'
                        }
                    ]}
                    value={isBlankStr(adjustMode) ? '' : adjustMode}
                />
            ),
        },
        {
            title: '方式',
            dataIndex: 'adjustUnit',
            key: 'adjustUnit',
            width: '15%',
            render: (_, { adjustUnit, toppingCode }) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
                    onChange={(e)=>onChangeAdjustUnit(e, toppingCode)}
                    options={[
                        {
                            label: '固定值',
                            value: 'fix'
                        },
                        {
                            label: '百分比',
                            value: 'per'
                        }
                    ]}
                    value={isBlankStr(adjustUnit) ? '' : adjustUnit}
                />
            ),
        },
        {
            title: '数值',
            dataIndex: 'adjustAmount',
            key: 'adjustAmount',
            render: (_, { adjustAmount, toppingCode }) => (
                <InputNumber min={1} max={10000} onChange={(e) => onChangeAdjustAmount(e, toppingCode)} size="small" value={adjustAmount}/>
            ),
        },
        {
            title: '实际用量',
            dataIndex: 'actualAmount',
            key: 'actualAmount',
            render: (_, { actualAmount }) => (
                <span>{actualAmount}</span>
            ),
        }
    ]
    const onChangeAdjustMode = (e, toppingCode) => {
        setCurToppingAdjustRuleList(prev => {
            let tmp = [...prev];
            tmp.forEach(adjustRule => {
                if (adjustRule.toppingCode == toppingCode) {
                    adjustRule.adjustMode = e;
                    adjustRule.actualAmount = calcActualAmount(adjustRule);
                }
            })
            return tmp;
        });
    }
    const onChangeAdjustUnit = (e, toppingCode) => {
        setCurToppingAdjustRuleList(prev => {
            let tmp = [...prev];
            tmp.forEach(adjustRule => {
                if (adjustRule.toppingCode == toppingCode) {
                    adjustRule.adjustUnit = e;
                    adjustRule.actualAmount = calcActualAmount(adjustRule);
                }
            })
            return tmp;
        });
    }
    const onChangeAdjustAmount = (e, toppingCode) => {
        setCurToppingAdjustRuleList(prev => {
            let tmp = [...prev];
            tmp.forEach(adjustRule => {
                if (adjustRule.toppingCode == toppingCode) {
                    adjustRule.adjustAmount = e;
                    adjustRule.actualAmount = calcActualAmount(adjustRule);
                }
            })
            return tmp;
        });
    }
    const calcActualAmount = (adjustTopping) => {
        if (isBlankObj(adjustTopping) 
                || isBlankStr(adjustTopping.adjustMode)
                || isBlankStr(adjustTopping.adjustUnit)
                || !isNumber(adjustTopping.adjustAmount)) {
            return adjustTopping.baseAmount;
        }

        let actualAmount = adjustTopping.baseAmount;
        if (adjustTopping.adjustMode == 'add') {
            if (adjustTopping.adjustUnit == 'fix') {
                actualAmount = actualAmount + adjustTopping.adjustAmount;
            } else {
                actualAmount = actualAmount + actualAmount * adjustTopping.adjustAmount;
            }
        } else {
            if (adjustTopping.adjustUnit == 'fix') {
                actualAmount = actualAmount - adjustTopping.adjustAmount;
            } else {
                actualAmount = actualAmount - actualAmount * adjustTopping.adjustAmount;
            }
        }
        return actualAmount < 0 ? 0 : actualAmount;
    }
    const updateTeaUnitList = () => {
        setTeaUnitList(prev => {
            let tmp = [...prev];
            tmp.forEach(teaUnit => {
                if (teaUnit.teaUnitcode == curTeaUnitCode) {
                    tmp.toppingAdjustRuleList = curToppingAdjustRuleList;
                }
            });
            return tmp;
        });
    }
    useEffect(() => {
        updateTeaUnitList();
    }, [curToppingAdjustRuleList]);

    return (
        <div class="flex-col-cont" style={{height: 340, width: '100%'}}>
            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '10%', width: '100%'}}>
                <span style={{color: 'black', fontWeight: 'bold'}}>搭配规则：</span>
            </div>
            <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '90%', width: '100%'}}>
                <div style={{height: '100%', width: '29%', overflowY: 'auto'}}>
                    <Space direction='vertical' size='small' style={{height: '100%', width: '100%'}}>
                        {teaUnitList.map(teaUnit => {
                            return (
                                <div style={{height: 50, width: '99%', borderRadius: 5, backgroundColor: teaUnit.backgroundColor, color: teaUnit.textColor}} onClick={(e) => onClickTeaUnit(e, teaUnit.teaUnitCode)}>
                                    <span class="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                        {teaUnit.teaUnitName}
                                    </span>
                                </div>
                            )
                        })}
                    </Space>
                </div>
                <div style={{height: '100%', width: '2%'}}>&nbsp;</div>
                <div class="flex-col-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: '100%', width: '69%'}}>
                    <Table 
                        columns={toppingAdjustRuleCols} 
                        dataSource={curToppingAdjustRuleList} 
                        size='small' 
                        style={{width: '100%'}} 
                        rowKey='toppingCode'/>
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalAdjustRulePane;