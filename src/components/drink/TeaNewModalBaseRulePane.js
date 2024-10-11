import React, { useEffect, useState } from 'react';
import { InputNumber, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';

const TeaNewModalBaseRulePane = (props) => {
    // 数据定义
    const [toppingBaseRuleList, setToppingBaseRuleList] = useState(props.toppingBaseRuleList4Edit == undefined ? [] : props.toppingBaseRuleList4Edit);

    // 动作定义
    useEffect(() => {
        props.updateToppingBaseRuleList(toppingBaseRuleList);
    }, [toppingBaseRuleList]);

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
    const onChangeBaseAmount = (stepIndex, toppingCode, baseAmount) => {
        setToppingBaseRuleList(prev => {
            let tmp = [...prev];
            tmp.forEach(toppingBaseRule => {
                if (toppingBaseRule.stepIndex == stepIndex && toppingBaseRule.toppingCode == toppingCode) {
                    toppingBaseRule.baseAmount = baseAmount;
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
                    dataSource={toppingBaseRuleList} 
                    pagination={false} 
                    scroll={{ y: 275 }} 
                    size='small' 
                    style={{width: '100%'}}
                    rowKey='toppingCode'/>
            </div>
        </div>
    );
};

export default TeaNewModalBaseRulePane;