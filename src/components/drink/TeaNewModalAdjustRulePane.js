import React, { useEffect, useState } from 'react';
import { Button, InputNumber, Select, Space, Table } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import TeaNewUnitQrCode from './TeaNewUnitQrCode'

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
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
    const [openQrCode, setOpenQrCode] = useState(false);
    const [qrCode, setQrCode] = useState();

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
        // console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList props.specItemRuleList4Edit=', props.specItemRuleList4Edit);
        // console.log('$$$$$ teaNewModalAdjustRulePane#genTeaUnitList specItemRuleListBySpecCode=', specItemRuleListBySpecCode);
        if (specItemRuleListBySpecCode.length <= 0) {
            return;
        }

        // 根据过滤过的specItemRuleLists，生成teaUnitListTmp
        specItemRuleListBySpecCode.forEach(specItemRuleList => {
            specItemRuleList.sort((a, b)=>{
                // console.log('$$$$$ specItemRuleListBySpecCode a=', a);
                // console.log('$$$$$ specItemRuleListBySpecCode b=', b);
                return a.specItemCode.localeCompare(b.specItemCode);
            });
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
        setQrCode(props.teaCode + '|xxxx|' + teaUnitCode.split('-').join(','));
    }
    const initTeaUnitListSelected = () => {
        // console.log('$$$$$ teaNewModalAdjustRulePane#initTeaUnitListSelected teaUnitList=', teaUnitList);
        if (!isArray(teaUnitList) || teaUnitList.length <= 0) {
            return;
        }
        let hasSelected = false;
        teaUnitList.forEach(teaUnit => {
            if (teaUnit.selected) {
                hasSelected = true;
            }
        });
        // console.log('$$$$$ teaNewModalAdjustRulePane#initTeaUnitListSelected hasSelected=', hasSelected);
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
            title: applyLang('labelStep'),
            dataIndex: 'stepIndex',
            key: 'stepIndex',
            width: '10%'
        },
        {
            title: applyLang('labelToppingName'),
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '20%'
        },
        {
            title: applyLang('labelAdjustType'),
            dataIndex: 'adjustType',
            key: 'adjustType',
            width: '20%',
            render: (_, { adjustType, toppingCode }) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
                    onChange={(e)=>onChangeAdjustType(e, toppingCode)}
                    options={[
                        {
                            label: applyLang('labelOpeDecrease'),
                            value: 0
                        },
                        {
                            label: applyLang('labelOpeIncrease'),
                            value: 1
                        }
                    ]}
                    value={isNumber(adjustType) ? adjustType : 0}
                />
            ),
        },
        {
            title: applyLang('labelAdjustMode'),
            dataIndex: 'adjustMode',
            key: 'adjustMode',
            width: '15%',
            render: (_, { adjustMode, toppingCode }) => (
                <Select
                    disabled={true}
                    onChange={(e)=>onChangeAdjustMode(e, toppingCode)}
                    options={[
                        {
                            label: applyLang('labelFix'),
                            value: 0
                        },
                        {
                            label: applyLang('labelPer'),
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
            title: applyLang('labelAmount'),
            dataIndex: 'adjustAmount',
            key: 'adjustAmount',
            width: '20%',
            render: (_, { adjustAmount, toppingCode }) => (
                <InputNumber min={0} max={9999} onChange={(e) => onChangeAdjustAmount(e, toppingCode)} size="small" value={adjustAmount}/>
            ),
        },
        {
            title: applyLang('labelActualAmount'),
            dataIndex: 'actualAmount',
            key: 'actualAmount',
            width: '15%',
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
        if (adjustTopping.adjustType === 0) {
            if (adjustTopping.adjustMode === 0) {
                actualAmount = actualAmount - adjustTopping.adjustAmount;
            } else {
                actualAmount = actualAmount - actualAmount * adjustTopping.adjustAmount;
            }
        } else {
            if (adjustTopping.adjustMode === 0) {
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


    // 输入定义
    const onClickoOpenQrCode = (e) => {
        setOpenQrCode(true);
    }
    const onClickCloseQrCode = (e) => {
        setOpenQrCode(false);
    }

    return (
        <>
            <div className="flex-col-cont" style={{height: 340, width: '100%'}}>
                <div className="flex-row-cont full-width" style={{justifyContent: 'space-between', height: 40}}>
                    <span style={{color: 'black', fontWeight: 'bold'}}>{applyLang('promptComposeRule')}</span>
                    <Button type="primary" icon={<FormOutlined />} onClick={onClickoOpenQrCode}>{applyLang('labelViewQrCode')}</Button>
                </div>
                <div className="flex-row-cont full-width" style={{justifyContent: 'flex-start', height: 300}}>
                    <div className="full-height" style={{width: '29%', overflowY: 'auto'}}>
                        <Space direction='vertical' size='small' style={{height: '100%', width: '100%'}}>
                            {teaUnitList.map(teaUnit => {
                                return (
                                    <div key={teaUnit.teaUnitCode} style={{height: 50, width: '99%', borderRadius: 5, backgroundColor: teaUnit.backgroundColor, color: teaUnit.textColor}} onClick={(e) => onClickTeaUnit(e, teaUnit.teaUnitCode)}>
                                        <span className="flex-row-cont" style={{height: '100%', lineHeight: 1.5, overflowWrap: 'break-word'}}>
                                            {teaUnit.teaUnitName}
                                        </span>
                                    </div>
                                )
                            })}
                        </Space>
                    </div>
                    <div className="full-height" style={{width: '2%'}}>&nbsp;</div>
                    <div className="flex-col-cont full-height" style={{alignItems: 'flex-start', justifyContent: 'flex-start', width: '69%'}}>
                        <Table 
                            columns={toppingAdjustRuleCols} 
                            dataSource={curToppingAdjustRuleList}
                            pagination={false} 
                            size='small' 
                            style={{overflowY: 'auto', height: '100%', width: '100%'}} 
                            rowKey={record => record.toppingCode}/>
                    </div>
                </div>
            </div>

            {openQrCode && (
                <TeaNewUnitQrCode onClose={onClickCloseQrCode} qrCode={qrCode} />
            )}
        </>
        
    );
};

export default TeaNewModalAdjustRulePane;