import React, { useEffect, useState } from 'react';
import { InputNumber, Select, Space, Table } from 'antd';

import '../css/common.css';
import { isBlankObj, isBlankStr, isNumber } from '../js/common.js';

const TeaNewModalUnitPane = (props) => {
    // 状态变量初始化相关
    const [teaUnitList, setTeaUnitList] = useState([]);
    const [curTeaUnitCode, setCurTeaUnitCode] = useState('');
    const [curToppingAdjustList, setCurToppingAdjustList] = useState([]);

    // 规格项组合初始化相关
    const genToppingAdjustList = () => {
        let adjustList = [];
        props.actStepList4Edit.forEach(actStep => {
            actStep.toppingRelList.forEach(toppingRel => {
                adjustList.push({
                    stepIdx: actStep.stepIdx,
                    toppingName: toppingRel.toppingName,
                    toppingCode: toppingRel.toppingCode,
                    measureUnit: toppingRel.measureUnit,
                    amount: toppingRel.amount,
                    actualAmount: toppingRel.amount,
                });
            })
        });
        return adjustList;
    }
    const doGenTeaUnitList = (specItemLists, index, combo, resultList) => {
        if (combo == null || combo == undefined) {
            combo = [];
        }
        if (index == specItemLists.length) {
            let specItemListTmp = [];
            let teaUnitCode = '';
            let teaUnitName = '';
            combo.forEach(f => {
                specItemListTmp.push(f);
                teaUnitCode = teaUnitCode + '-' + f.specItemCode;
                teaUnitName = teaUnitName + '-' + f.specItemName;
            })
            resultList.push({
                teaUnitCode: teaUnitCode.slice(1),
                teaUnitName: teaUnitName.slice(1),
                specItemList: specItemListTmp,
                backgroundColor: 'white'
            });
            return;
        }

        let list = specItemLists[index];
        list.forEach(s => {
            combo.push(s);
            doGenTeaUnitList(specItemLists, index + 1, combo, resultList);
            combo.pop();
        });
    }
    const genTeaUnitList = () => {
        let specItemLists = [];
        props.specList4Edit.forEach(spec => {
            let specItemListTmp = [];
            spec.specItemList.forEach(specItem => {
                if (specItem.selected == 1) {
                    specItemListTmp.push(specItem);
                }
            })
            specItemLists.push(specItemListTmp);
        });
        let teaUnitListTmp = [];
        doGenTeaUnitList(specItemLists, 0, null, teaUnitListTmp);
        
        teaUnitListTmp.forEach(teaUnit => {
            teaUnit.toppingAdjustList = genToppingAdjustList();
        })
        
        setTeaUnitList(prev => {
            return teaUnitListTmp;
        });
    }
    useEffect(() => {
        genTeaUnitList();
    }, [props.specList4Edit, props.actStepList4Edit]);
    

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
                    setCurToppingAdjustList(prev => {
                        return teaUnit.toppingAdjustList;
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
    const toppingAdjustCols = [
        {
            title: '步骤',
            dataIndex: 'stepIdx',
            key: 'stepIdx',
            width: '10%'
        },
        {
            title: '物料名称',
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '25%'
        },
        {
            title: '修改',
            dataIndex: 'adjustMode',
            key: 'adjustMode',
            width: '15%',
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
            width: '20%',
            render: (_, { adjustAmount, toppingCode }) => (
                <InputNumber min={1} max={10000} onChange={(e) => onChangeAdjustAmount(e, toppingCode)} size="small" value={adjustAmount}/>
            ),
        },
        {
            title: '实际用量',
            dataIndex: 'actualAmount',
            key: 'actualAmount',
            width: '15%',
            render: (_, { actualAmount }) => (
                <span>{actualAmount}</span>
            ),
        }
    ]
    const onChangeAdjustMode = (e, toppingCode) => {
        setCurToppingAdjustList(prev => {
            let tmp = [...prev];
            tmp.forEach(item => {
                if (item.toppingCode == toppingCode) {
                    item.adjustMode = e;
                    item.actualAmount = calcActualAmount(item);
                }
            })
            return tmp;
        });
    }
    const onChangeAdjustUnit = (e, toppingCode) => {
        setCurToppingAdjustList(prev => {
            let tmp = [...prev];
            tmp.forEach(item => {
                if (item.toppingCode == toppingCode) {
                    item.adjustUnit = e;
                    item.actualAmount = calcActualAmount(item);
                }
            })
            return tmp;
        });
    }
    const onChangeAdjustAmount = (e, toppingCode) => {
        setCurToppingAdjustList(prev => {
            let tmp = [...prev];
            tmp.forEach(item => {
                if (item.toppingCode == toppingCode) {
                    item.adjustAmount = e;
                    item.actualAmount = calcActualAmount(item);
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
            return adjustTopping.amount;
        }

        let actualAmount = adjustTopping.amount;
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
                    tmp.toppingAdjustList = curToppingAdjustList;
                }
            });
            return tmp;
        });
    }
    useEffect(() => {
        updateTeaUnitList();
    }, [curToppingAdjustList]);

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
                        columns={toppingAdjustCols} 
                        dataSource={curToppingAdjustList} 
                        size='small' 
                        style={{width: '100%'}} 
                        rowKey='toppingCode'/>
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalUnitPane;