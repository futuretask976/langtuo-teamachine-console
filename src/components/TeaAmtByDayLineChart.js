import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';

import { isArray, getTenantCode } from '../js/common.js';
import { get } from '../js/request.js';

const TeaAmtByDayLineChart = () => {
    // 数据定义
    const [teaAmtByDayData, setTeaAmtByDayData] = useState();

    // 初始化动作
    const fetchTeaAmtByDayData = () => {
        get('/summarychart/teaamtbyday', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setTeaAmtByDayData(prev => {
                let tmp = [];
                if (isArray(model)) {
                    model.forEach(item => {
                        tmp.push(item);
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchTeaAmtByDayData();
    }, []);

    const config = {
        data: teaAmtByDayData,
        xField: (d) => d.orderCreatedDay,
        yField: 'amount',
        sizeField: 'amount',
        shapeField: 'trail',
        legend: { size: false },
        colorField: 'teaCode',
    };

    // 页面刷新
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshChart = () => {
        setRefreshKey(refreshKey + 1);
    };
    useEffect(() => {
        refreshChart();
    }, [teaAmtByDayData]);

    return (
        <div style={{height: '95%', width: '100%', border: '0px solid pink'}}>
            {isArray(teaAmtByDayData) && (
                <Line {...config} key={'teaAmtByDayLineChart_' + refreshKey}/>
            )}
        </div>
        
    )
};

export default TeaAmtByDayLineChart;

