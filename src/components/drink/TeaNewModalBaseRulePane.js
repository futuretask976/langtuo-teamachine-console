import React, { useEffect, useState } from 'react';
import { InputNumber, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';

const TeaNewModalBaseRulePane = (props) => {
    // 数据定义
    const [toppingBaseRuleList, setToppingBaseRuleList] = useState(props.toppingBaseRuleList4Edit === undefined ? [] : props.toppingBaseRuleList4Edit);

    // 动作定义
    useEffect(() => {
        props.updateToppingBaseRuleList(toppingBaseRuleList);
    }, [toppingBaseRuleList]);

    // 表格定义
    const toppingConfigCols = [
        {
            title: applyLang('labelStep'),
            dataIndex: 'stepIndex',
            key: 'stepIndex',
            width: '10%'
        },
        {
            title: applyLang('labelTopping'),
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '40%'
        },
        {
            title: applyLang('labelBaseAmount'),
            dataIndex: 'baseAmount',
            key: 'baseAmount',
            width: '30%',
            render: (_, { stepIndex, toppingCode, baseAmount }) => (
                <InputNumber min={0} max={9999} onChange={(e) => onChangeBaseAmount(stepIndex, toppingCode, e)} size="small" value={baseAmount}/>
            ),
        },
        {
            title: applyLang('labelMeasureUnit'),
            dataIndex: 'measureUnit',
            key: 'measureUnit',
            width: '20%',
            render: (_, { measureUnit }) => (
                <span>{measureUnit === 0 ? applyLang('labelKg') : applyLang('labelMl')}</span>
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