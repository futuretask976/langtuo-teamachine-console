import React, { useEffect, useState } from 'react';
import { InputNumber, Table } from 'antd';

import '../../css/common.css';
import { isArray, isNumber } from '../../js/common.js';

const TeaNewModalBaseRulePane = (props) => {
    // 数据定义
    const [actStepList, setActStepList] = useState(() => {
        if (isArray(props.actStepList4Edit)) {
            return props.actStepList4Edit;
        }
        return [];
    });

    // 动作定义
    const convertToDataSource = () => {
        let dataSource = [];
        actStepList.forEach(actStep => {
            actStep.toppingBaseRuleList.forEach(toppingBaseRule => {
                dataSource.push({
                    stepIndex: actStep.stepIndex,
                    toppingName: toppingBaseRule.toppingName,
                    toppingCode: toppingBaseRule.toppingCode,
                    measureUnit: toppingBaseRule.measureUnit,
                    baseAmount: toppingBaseRule.baseAmount
                });
            })
        });
        return dataSource;
    };
    useEffect(() => {
        props.updateActStepList(actStepList);
    }, [actStepList]);

    // 表格定义
    const toppingConfigCols = [
        {
            title: '步骤',
            dataIndex: 'stepIndex',
            key: 'stepIndex',
            width: '10%'
        },
        {
            title: '物料',
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '40%'
        },
        {
            title: '标准量',
            dataIndex: 'baseAmount',
            key: 'baseAmount',
            width: '30%',
            render: (_, { stepIndex, toppingCode, baseAmount }) => (
                <InputNumber min={0} max={9999} onChange={(e) => onChangeBaseAmount(stepIndex, toppingCode, e)} size="small" value={baseAmount}/>
            ),
        },
        {
            title: '单位',
            dataIndex: 'measureUnit',
            key: 'measureUnit',
            width: '20%',
            render: (_, { measureUnit }) => (
                <span>{measureUnit == 0 ? '克' : '毫升'}</span>
            ),
        }
    ];
    const onChangeBaseAmount = (stepIndex, toppingCode, amount) => {
        setActStepList(prev => {
            let tmp = [...prev];
            tmp.forEach(actStep => {
                if (actStep.stepIndex == stepIndex) {
                    actStep.toppingBaseRuleList.forEach(toppingBaseRule => {
                        if (toppingBaseRule.toppingCode == toppingCode) {
                            toppingBaseRule.baseAmount = amount;
                        }
                    })
                }
            });
            return tmp;
        });
    };

    return (
        <div className="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{alignItems: 'flex-start', height: '100%', width: '98%'}}>
                <Table 
                    columns={toppingConfigCols} 
                    dataSource={convertToDataSource()} 
                    pagination={false} 
                    scroll={{ y: 350 }} 
                    size='small' 
                    style={{width: '100%'}}
                    rowKey='toppingCode'/>
            </div>
        </div>
    );
};

export default TeaNewModalBaseRulePane;