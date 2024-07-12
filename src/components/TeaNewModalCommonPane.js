import React, { useState } from 'react';
import { InputNumber, Table } from 'antd';

import '../css/common.css';
import { isArray } from '../js/common.js';

const TeaNewModalCommonPane = (props) => {
    // 数据初始化相关
    const [actStepList, setActStepList] = useState(isArray(props.actStepList) ? props.actStepList : [
        {
            stepIdx: 1,
            toppingRelList: [
                {
                    toppingCode: 123,
                    toppingName: '芒果酱',
                    measureUnit: 0
                },
                {
                    toppingCode: 456,
                    toppingName: '草莓酱',
                    measureUnit: 1
                },
                {
                    toppingCode: 789,
                    toppingName: '西瓜酱',
                    measureUnit: 0
                }
            ]
        }
    ]);
    const convertToDataSource = () => {
        let dataSource = [];
        actStepList.forEach(stepItem => {
            stepItem.toppingRelList.forEach(toppingItem => {
                dataSource.push({
                    stepIdx: stepItem.stepIdx,
                    toppingName: toppingItem.toppingName,
                    toppingCode: toppingItem.toppingCode,
                    measureUnit: toppingItem.measureUnit
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
            render: (_, { toppingCode, amount }) => (
                <InputNumber min={1} max={9999} onChange={(e) => onChangeAmount(e, toppingCode)} size="small" value={amount}/>
            ),
        },
        {
            title: '单位',
            dataIndex: 'measureUnit',
            key: 'measureUnit',
            width: '20%',
            render: (_, { measureUnit }) => (
                <text>{measureUnit == 0 ? '克' : '毫升'}</text>
            ),
        }
    ];
    const onChangeAmount = (e, toppingCode) => {
        setActStepList(prev => {
            let tmp = [];
            prev.forEach(item => {
                if (item.toppingCode == toppingCode) {
                    item.amount = e;
                }
                tmp.push(item);
            });
            return tmp;
        });
    };

    return (
        <div class="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div class="flex-row-cont" style={{alignItems: 'flex-start', height: '100%', width: '98%'}}>
                <Table columns={toppingConfigCols} dataSource={convertToDataSource(actStepList)} pagination={false} scroll={{ y: 350 }} size='small' style={{width: '100%'}}/>
            </div>
        </div>
    );
};

export default TeaNewModalCommonPane;