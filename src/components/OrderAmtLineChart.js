import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';

import { isArray, getTenantCode } from '../js/common.js';
import { get } from '../js/request.js';

const OrderAmtLineChart = () => {
    // 数据定义
    const [orderAmtData, setOrderAmtData] = useState();

    // 初始化动作
    const fetchOrderAmtData = () => {
        get('/summarychart/orderamt', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setOrderAmtData(prev => {
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
        fetchOrderAmtData();
    }, []);

    const config = {
        // data: [
        //     { year: '1991', value: 3 },
        //     { year: '1992', value: 4 },
        //     { year: '1993', value: 3.5 },
        //     { year: '1994', value: 5 },
        //     { year: '1995', value: 4.9 },
        //     { year: '1996', value: 6 },
        //     { year: '1997', value: 7 },
        //     { year: '1998', value: 9 },
        //     { year: '1999', value: 13 },
        // ],
        data: orderAmtData,
        xField: 'orderCreatedDay',
        yField: 'amount',
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    };

    // 页面刷新
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshChart = () => {
        setRefreshKey(refreshKey + 1);
    };
    useEffect(() => {
        refreshChart();
    }, [orderAmtData]);

    return (
        <div style={{height: '95%', width: '100%', border: '0px solid pink'}}>
            {isArray(orderAmtData) && (
                <Line {...config} key={'orderAmtLineChart_' + refreshKey}/>
            )}
        </div>
        
    )
};

export default OrderAmtLineChart;

