import React, { useEffect, useState } from 'react';
import { InputNumber, Select, Space, Table } from 'antd';

import '../../css/common.css';
import { isArray, isBlankObj, isNumber } from '../../js/common.js';

const TeaNewModalAdjustRulePane = (props) => {
    // 数据定义
    const [teaUnitList, setTeaUnitList] = useState(() => {
        if (isArray(props.teaUnitList4Edit)) {
            let tmp = [...props.teaUnitList4Edit];
            tmp.forEach(teaUnit => {
                teaUnit.backgroundColor = '#FFFFFF';
                teaUnit.textColor = '#818181';
                teaUnit.selected = false;
            });
            return tmp;
        }
        return [];
    });
    const [curTeaUnitCode, setCurTeaUnitCode] = useState();
    const [curToppingAdjustRuleList, setCurToppingAdjustRuleList] = useState();

    // 规格项组合初始化定义
    const genTeaUnitList = () => {
        const getValuebyArr = (arr1, arr2) => {
            var ans = [];
            for (let i = 0; i < arr1.length; ++i) {
                let v1 = arr1[i];
                for (let j = 0; j < arr2.length; ++j) {
                    let v2 = arr2[j];
                    if (v1.teaUnitName.length > 0) {
                        ans.push({
                            teaUnitName: v1.teaUnitName + '-' + v2.specItemName,
                            teaUnitCode: v1.teaUnitCode + '-' + v2.specItemCode,
                            outerTeaUnitCode: v1.outerTeaUnitCode + '-' + v2.outerSpecItemCode
                        });
                    } else {
                        ans.push({
                            teaUnitName: v2.specItemName,
                            teaUnitCode: v2.specItemCode,
                            outerTeaUnitCode: v2.outerSpecItemCode
                        });
                    }
                };
            };
            return ans;
        }
        const getArrbyArr = (targetArr) => {
            var ans = [{teaUnitName: '', teaUnitCode: ''}];
            for (let i = 0; i < targetArr.length; ++i) {
                ans = getValuebyArr(ans, targetArr[i]);
            }
            return ans;
        }
        const genToppingAdjustRuleList = () => {
            let toppingAdjustRuleList = [];
            props.toppingBaseRuleList4Edit.forEach(toppingBaseRule => {
                toppingAdjustRuleList.push({
                    stepIndex: toppingBaseRule.stepIndex,
                    toppingName: toppingBaseRule.toppingName,
                    toppingCode: toppingBaseRule.toppingCode,
                    measureUnit: toppingBaseRule.measureUnit,
                    baseAmount: toppingBaseRule.baseAmount,
                    actualAmount: toppingBaseRule.baseAmount,
                    adjustType: 0,
                    adjustMode: 0,
                    adjustAmount: 0
                });
            });
            return toppingAdjustRuleList;
        }
        const genSpecItemRuleListBySpecCode = (specItemRuleList) => {
            let groupBy = (array, key) => {
                return array.reduce((result, currentItem) => {
                  // 使用 key 函数提取属性值作为分组的键
                  const groupKey = key(currentItem);
               
                  // 确保 result 对象中有对应分组的数组
                  if (!result[groupKey]) {
                    result[groupKey] = [];
                  }
               
                  // 将当前项推入对应分组的数组
                  result[groupKey].push(currentItem);
               
                  return result;
                }, {});
            }
            let specItemRuleGroup = groupBy(specItemRuleList, specItemRule => specItemRule.specCode);

            let specItemRuleLists = [];
            for (let key in specItemRuleGroup) {
                if (specItemRuleGroup.hasOwnProperty(key)) {
                    specItemRuleLists.push(specItemRuleGroup[key]);
                }
            }
            return specItemRuleLists;
        }
        const teaUnitListEqual = (teaUnitList1, teaUnitList2) => {
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
        let specItemRuleListBySpecCode = genSpecItemRuleListBySpecCode(props.specItemRuleList4Edit);
        console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList props.specItemRuleList4Edit=', props.specItemRuleList4Edit);
        console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList specItemRuleListBySpecCode=', specItemRuleListBySpecCode);
        if (specItemRuleListBySpecCode.length <= 0) {
            return;
        }

        // 根据过滤过的specItemRuleLists，生成teaUnitListTmp
        specItemRuleListBySpecCode.sort((a, b)=>{
            return a.specItemCode.localeCompare(b.specItemCode);
        });
        let teaUnitListTmp = getArrbyArr(specItemRuleListBySpecCode);
        // console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList teaUnitListTmp=', teaUnitListTmp);
        teaUnitListTmp.forEach(teaUnit => {
            teaUnit.toppingAdjustRuleList = genToppingAdjustRuleList();
            teaUnit.backgroundColor = '#FFFFFF';
            teaUnit.textColor = '#818181';
            teaUnit.selected = false;
        });
        
        setTeaUnitList(prev => {
            prev.sort((a, b) => a.teaUnitCode.localeCompare(b.teaUnitCode));
            teaUnitListTmp.sort((a, b) => a.teaUnitCode.localeCompare(b.teaUnitCode));
            // console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList prev=', prev);
            // console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList teaUnitListTmp2=', teaUnitListTmp);
            // console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList teaUnitListEqual=', teaUnitListEqual(prev, teaUnitListTmp));
            if (teaUnitListEqual(prev, teaUnitListTmp)) {
                return prev;
            } else {
                return teaUnitListTmp;
            }
        });
    }
    useEffect(() => {
        genTeaUnitList();
    }, [props.toppingBaseRuleList4Edit, props.specRuleList4Edit]);
    

    // TeaUnit 操作定义
    const onClickTeaUnit = (e, teaUnitCode) => {
        setTeaUnitList(prev => {
            let tmp = [];
            teaUnitList.forEach(teaUnit => {
                if (teaUnit.teaUnitCode == teaUnitCode) {
                    teaUnit.backgroundColor = '#353535';
                    teaUnit.textColor = '#FFFFFF';
                    teaUnit.selected = true;
                    setCurTeaUnitCode(teaUnit.teaUnitCode);
                    setCurToppingAdjustRuleList(prev => {
                        let toppingAdjustRuleList = teaUnit.toppingAdjustRuleList;
                        toppingAdjustRuleList.forEach(toppingAdjustRule => {
                            toppingAdjustRule.actualAmount = calcActualAmount(toppingAdjustRule);
                        })
                        return teaUnit.toppingAdjustRuleList;
                    });
                } else {
                    teaUnit.backgroundColor = '#FFFFFF';
                    teaUnit.textColor = '#818181';
                    teaUnit.selected = false;
                }
                tmp.push(teaUnit);
            });
            return tmp;
        });
    }
    const initTeaUnitListSelected = () => {
        console.log('$$$$$ teaNewModalAdjustRulePane#initTeaUnitListSelected teaUnitList=', teaUnitList);
        if (!isArray(teaUnitList) || teaUnitList.length <= 0) {
            return;
        }
        let hasSelected = false;
        teaUnitList.forEach(teaUnit => {
            if (teaUnit.selected) {
                hasSelected = true;
            }
        });
        console.log('$$$$$ teaNewModalAdjustRulePane#initTeaUnitListSelected hasSelected=', hasSelected);
        if (!hasSelected) {
            onClickTeaUnit(undefined, teaUnitList[0].teaUnitCode);
        }
    }
    useEffect(() => {
        initTeaUnitListSelected();
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
                        {teaUnitList.map(teaUnit => {
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
                        pagination={false} 
                        scroll={{ y: 275 }}  
                        size='small' 
                        style={{width: '100%'}} 
                        rowKey={record=>record.toppingCode}/>
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalAdjustRulePane;