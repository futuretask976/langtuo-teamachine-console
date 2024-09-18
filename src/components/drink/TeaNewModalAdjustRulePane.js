import React, { useEffect, useState } from 'react';
import { InputNumber, Select, Space, Table } from 'antd';

import '../../css/common.css';
import { isArray, isBlankObj, isNumber } from '../../js/common.js';

const TeaNewModalAdjustRulePane = (props) => {
    // 数据定义
    const [teaUnitList, setTeaUnitList] = useState(() => {
        if (isArray(props.teaUnitList4Edit)) {
            let tmp = [...props.teaUnitList4Edit];
            tmp.forEach(item => {
                item.backgroundColor = '#FFFFFF';
                item.textColor = '#818181';
            });
            return tmp;
        }
        return [];
    });
    const [curTeaUnitCode, setCurTeaUnitCode] = useState();
    const [curToppingAdjustRuleList, setCurToppingAdjustRuleList] = useState();

    // 规格项组合初始化定义
    const genTeaUnitList = () => {
        const getArrbyArr = (targetArr) => {
            var ans = [{teaUnitName: '', teaUnitCode: ''}];
            for (let i = 0; i < targetArr.length; ++i) {
                ans = getValuebyArr(ans, targetArr[i]);
            }
            return ans;
        }
        const getValuebyArr = (arr1, arr2) => {
            var ans = [];
            for (let i = 0; i < arr1.length; ++i) {
                let v1 = arr1[i];
                for (let j = 0; j < arr2.length; ++j) {
                    let v2 = arr2[j];
                    if (v1.teaUnitName.length > 0) {
                        ans.push({
                            teaUnitName: v1.teaUnitName + '-' + v2.specItemName,
                            teaUnitCode: v1.teaUnitCode + '-' + v2.specItemCode
                        });
                    } else {
                        ans.push({
                            teaUnitName: v2.specItemName,
                            teaUnitCode: v2.specItemCode
                        });
                    }
                };
            };
            return ans;
        }
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
                        adjustType: 0,
                        adjustMode: 0
                    });
                })
            });
            return toppingAdjustRuleList;
        }
        const genSpecItemRuleLists = () => {
            let specItemRuleLists = [];
            if (isArray(props.specRuleList4Edit)) {
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
            }
            return specItemRuleLists;
        }
        const isEqualTeaUnitList = (teaUnitList1, teaUnitList2) => {
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

        // 从specRuleList过滤出上一步选中的specItem，放到specItemRuleLists中
        let specItemRuleLists = genSpecItemRuleLists();

        // 根据过滤过的specItemRuleLists，生成teaUnitListTmp
        let teaUnitListTmp = getArrbyArr(specItemRuleLists);
        teaUnitListTmp.forEach(teaUnit => {
            teaUnit.toppingAdjustRuleList = genToppingAdjustRuleList();
        });
        
        setTeaUnitList(prev => {
            prev.sort((a, b) => a.teaUnitCode.localeCompare(b.teaUnitCode));
            teaUnitListTmp.sort((a, b) => a.teaUnitCode.localeCompare(b.teaUnitCode));
            if (isEqualTeaUnitList(prev, teaUnitListTmp)) {
                return prev;
            } else {
                return teaUnitListTmp;
            }
        });
    }
    useEffect(() => {
        genTeaUnitList();
    }, [props.specRuleList4Edit, props.actStepList4Edit]);
    

    // TeaUnit 操作定义
    const onClickTeaUnit = (e, teaUnitCode) => {
        setTeaUnitList(prev => {
            let tmp = [];
            teaUnitList.forEach(teaUnit => {
                if (teaUnit.teaUnitCode == teaUnitCode) {
                    teaUnit.backgroundColor = '#145CFE';
                    teaUnit.textColor = '#FFFFFF';
                    teaUnit.selected = 1;
                    setCurTeaUnitCode(teaUnit.teaUnitCode);
                    setCurToppingAdjustRuleList(prev => {
                        let toppingAdjustRuleList = teaUnit.toppingAdjustRuleList;
                        toppingAdjustRuleList.forEach(toppingAdjustRule => {
                            toppingAdjustRule.actualAmount = calcActualAmount(toppingAdjustRule);
                        })
                        return teaUnit.toppingAdjustRuleList;
                    })
                } else {
                    teaUnit.backgroundColor = '#FFFFFF';
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

    // 表格定义
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
            dataIndex: 'adjustType',
            key: 'adjustType',
            render: (_, { adjustType, toppingCode }) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
                    onChange={(e)=>onChangeAdjustType(e, toppingCode)}
                    options={[
                        {
                            label: '减少',
                            value: 0
                        },
                        {
                            label: '增加',
                            value: 1
                        }
                    ]}
                    value={isNumber(adjustType) ? adjustType : 0}
                />
            ),
        },
        {
            title: '方式',
            dataIndex: 'adjustMode',
            key: 'adjustMode',
            width: '15%',
            render: (_, { adjustMode, toppingCode }) => (
                <Select
                    disabled='true'
                    onChange={(e)=>onChangeAdjustMode(e, toppingCode)}
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
                    size="small"
                    style={{width: '100%'}}
                    value={isNumber(adjustMode) ? adjustMode : 0}
                />
            ),
        },
        {
            title: '数值',
            dataIndex: 'adjustAmount',
            key: 'adjustAmount',
            render: (_, { adjustAmount, toppingCode }) => (
                <InputNumber min={0} max={9999} onChange={(e) => onChangeAdjustAmount(e, toppingCode)} size="small" value={adjustAmount}/>
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
    const onChangeAdjustType = (e, toppingCode) => {
        setCurToppingAdjustRuleList(prev => {
            let tmp = [...prev];
            tmp.forEach(adjustRule => {
                if (adjustRule.toppingCode == toppingCode) {
                    adjustRule.adjustType = e;
                    adjustRule.actualAmount = calcActualAmount(adjustRule);
                }
            })
            return tmp;
        });
    }
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
                || !isNumber(adjustTopping.adjustType)
                || !isNumber(adjustTopping.adjustMode)
                || !isNumber(adjustTopping.adjustAmount)) {
            return adjustTopping.baseAmount;
        }

        let actualAmount = adjustTopping.baseAmount;
        if (adjustTopping.adjustType == 0) {
            if (adjustTopping.adjustMode == 0) {
                actualAmount = actualAmount - adjustTopping.adjustAmount;
            } else {
                actualAmount = actualAmount - actualAmount * adjustTopping.adjustAmount;
            }
        } else {
            if (adjustTopping.adjustMode == 0) {
                actualAmount = actualAmount + adjustTopping.adjustAmount;
            } else {
                actualAmount = actualAmount + actualAmount * adjustTopping.adjustAmount;
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
        <div className="flex-col-cont" style={{height: 340, width: '100%'}}>
            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '10%', width: '100%'}}>
                <span style={{color: 'black', fontWeight: 'bold'}}>搭配规则：</span>
            </div>
            <div className="flex-row-cont" style={{justifyContent: 'flex-start', height: '90%', width: '100%'}}>
                <div style={{height: '100%', width: '29%', overflowY: 'auto'}}>
                    <Space direction='vertical' size='small' style={{height: '100%', width: '100%'}}>
                        {isArray(teaUnitList) && teaUnitList.map(teaUnit => {
                            return (
                                <div style={{height: 50, width: '99%', borderRadius: 5, backgroundColor: teaUnit.backgroundColor, color: teaUnit.textColor}} onClick={(e) => onClickTeaUnit(e, teaUnit.teaUnitCode)}>
                                    <span className="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                        {teaUnit.teaUnitName}
                                    </span>
                                </div>
                            )
                        })}
                    </Space>
                </div>
                <div style={{height: '100%', width: '2%'}}>&nbsp;</div>
                <div className="flex-col-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: '100%', width: '69%'}}>
                    <Table 
                        columns={toppingAdjustRuleCols} 
                        dataSource={curToppingAdjustRuleList} 
                        size='small' 
                        style={{width: '100%'}} 
                        rowKey={record=>record.toppingCode}/>
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalAdjustRulePane;