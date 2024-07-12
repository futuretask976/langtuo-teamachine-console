import React, { useEffect, useState } from 'react';
import { InputNumber, Table } from 'antd';

import '../css/common.css';
import { isArray, isNumber } from '../js/common.js';

const TeaNewModalAmtPane = (props) => {
    // 数据初始化相关
    const [actStepList, setActStepList] = useState(isArray(props.actStepList) ? props.actStepList : []);
    const convertToDataSource = () => {
        let dataSource = [];
        actStepList.forEach(stepItem => {
            stepItem.toppingRelList.forEach(toppingItem => {
                dataSource.push({
                    stepIdx: stepItem.stepIdx,
                    toppingName: toppingItem.toppingName,
                    toppingCode: toppingItem.toppingCode,
                    measureUnit: toppingItem.measureUnit,
                    amount: isNumber(toppingItem.amount) ? toppingItem.amount : 0
                });
            })
        });
        return dataSource;
    }


    // 表格操作相关
    const toppingConfigCols = [
        {
            title: '步骤',
            dataIndex: 'stepIdx',
            key: 'stepIdx',
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
            dataIndex: 'amount',
            key: 'amount',
            width: '30%',
            render: (_, { stepIdx, toppingCode, amount }) => (
                <InputNumber min={1} max={9999} onChange={(e) => onChangeAmount(stepIdx, toppingCode, e)} size="small" value={amount}/>
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
    const onChangeAmount = (stepIdx, toppingCode, e) => {
        setActStepList(prev => {
            let tmp = [...prev];
            tmp.forEach(actStep => {
                if (actStep.stepIdx == stepIdx) {
                    actStep.toppingRelList.forEach(toppingRel => {
                        if (toppingRel.toppingCode == toppingCode) {
                            toppingRel.amount = e;
                        }
                    })
                }
            });
            return tmp;
        });
    };
    useEffect(() => {
        props.updateActStepList(actStepList);
    }, [actStepList]);

    return (
        <div className="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div className="flex-row-cont" style={{alignItems: 'flex-start', height: '100%', width: '98%'}}>
                <Table 
                    columns={toppingConfigCols} 
                    dataSource={convertToDataSource(actStepList)} 
                    pagination={false} 
                    scroll={{ y: 350 }} 
                    size='small' 
                    style={{width: '100%'}}
                    rowKey='toppingCode'/>
            </div>
        </div>
    );
};

export default TeaNewModalAmtPane;