import React, { useEffect, useState } from 'react';
import { InputNumber, Select, Space, Table } from 'antd';

import '../css/common.css';

const TeaNewModalUnitPane = (props) => {
    // 状态变量初始化相关
    const [teaUnitList, setTeaUnitList] = useState([]);
    const [toppingAdjustList, setToppingAdjustList] = useState([]);

    // 规格项组合初始化相关
    const doGenTeaUnitList = (specItemLists, index, combo, resultList) => {
        if (combo == null || combo == undefined) {
            combo = [];
        }
        if (index == specItemLists.length) {
            let specItemListTmp = [];
            let unitCode = '';
            let unitName = '';
            combo.forEach(f => {
                specItemListTmp.push(f);
                unitCode = unitCode + '-' + f.specItemCode;
                unitName = unitName + '-' + f.specItemName;
            })
            resultList.push({
                teaUnitCode: unitCode.slice(1),
                teaUnitName: unitName.slice(1),
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
        setTeaUnitList(prev => {
            return teaUnitListTmp;
        });
    }
    useEffect(() => {
        genTeaUnitList();
    }, [props.specList4Edit]);

    // 物料调整初始化相关
    const genToppingAdjustList = () => {
        let adjustList = [];
        props.actStepList4Edit.forEach(actStep => {
            actStep.toppingRelList.forEach(toppingRel => {
                adjustList.push({
                    stepIdx: actStep.stepIdx,
                    toppingName: toppingRel.toppingName,
                    toppingCode: toppingRel.toppingCode,
                    measureUnit: toppingRel.measureUnit,
                    amount: toppingRel.amount
                });
            })
        });
        setToppingAdjustList(prev => {
            return adjustList;
        });
    }
    useEffect(() => {
        genToppingAdjustList();
    }, [props.actStepList4Edit]);
    

    // TeaUnit 操作
    const onClickTeaUnit = (e, teaUnitCode) => {
        setTeaUnitList(prev => {
            let tmp = [];
            teaUnitList.forEach(item => {
                if (item.teaUnitCode == teaUnitCode) {
                    item.backgroundColor = '#145CFE';
                    item.textColor = 'white';
                    item.selected = 1;
                } else {
                    item.backgroundColor = 'white';
                    item.textColor = '#818181';
                    item.selected = 0;
                }
                tmp.push(item);
            });
            return tmp;
        })
    }

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
            dataIndex: 'adjustMethod',
            key: 'adjustMode',
            width: '15%',
            render: (_, {}) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
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
                />
            ),
        },
        {
            title: '方式',
            dataIndex: 'adjustUnit',
            key: 'adjustUnit',
            width: '15%',
            render: (_, { }) => (
                <Select
                    size="small"
                    style={{width: '100%'}}
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
                />
            ),
        },
        {
            title: '数值',
            dataIndex: 'adjustAmount',
            key: 'adjustAmount',
            width: '20%',
            render: (_, { toppingCode }) => (
                <InputNumber min={1} max={10000} defaultValue={0} onChange={(e) => onAdjustNumChange(e, toppingCode)} size="small" />
            ),
        },
        {
            title: '实际用量',
            dataIndex: 'actualAmount',
            key: 'actualAmount',
            width: '15%',
            render: (_, { amount }) => (
                <span>{amount}</span>
            ),
        }
    ]
    const onAdjustNumChange = (e, toppingCode) => {
        console.log('$$$$$ TeaNewModalUnitPane#onAdjustNumChange e=' + e + ", toppingCode=" + toppingCode);
    }

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
                        dataSource={toppingAdjustList} 
                        size='small' 
                        style={{width: '100%'}} 
                        rowKey='toppingCode'/>
                </div>
            </div>
        </div>
    );
};

export default TeaNewModalUnitPane;