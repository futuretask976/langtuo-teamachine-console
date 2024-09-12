import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';

import { isArray, getTenantCode } from '../js/common.js';
import { get } from '../js/request.js';
  
const ShopMachineColumnChart = () => {
    // 数据定义
    const [shopMachineData, setshopMachineData] = useState();

    // 初始化动作
    const fetchShopMachineData = () => {
        get('/summarychart/shopmachine', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setshopMachineData(prev => {
                let tmp = [];
                if (isArray(model)) {
                    model.forEach(item => {
                        tmp.push({
                            type: item.shopName,
                            value: item.amount
                        });
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchShopMachineData();
    }, []);

    const config = {
        // data: [
        //     { type: '1-3秒', value: 0.16 },
        //     { type: '4-10秒', value: 0.125 },
        //     { type: '11-30秒', value: 0.24 },
        //     { type: '31-60秒', value: 0.19 },
        //     { type: '1-3分', value: 0.22 },
        //     { type: '3-10分', value: 0.05 },
        //     { type: '10-30分', value: 0.01 },
        //     { type: '30+分', value: 0.015 },
        // ],
        data: shopMachineData,
        xField: 'type',
        yField: 'value',
        style: {
            fill: ({ type }) => {
            if (type === '10-30分' || type === '30+分') {
                return '#22CBCC';
            }
            return '#2989FF';
            },
      },
      label: {
            text: (originData) => {
            const val = parseFloat(originData.value);
            if (val < 0.05) {
                return (val * 100).toFixed(1) + '%';
            }
            return '';
            },
            offset: 10,
      },
      legend: false,
    };

    // 页面刷新
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshChart = () => {
        setRefreshKey(refreshKey + 1);
    };
    useEffect(() => {
        refreshChart();
    }, [shopMachineData]);
    
    return (
        <div style={{height: '95%', width: '100%', border: '0px solid pink'}}>
            {isArray(shopMachineData) && (
                <Column {...config} key={'shopMachineColumnChart_' + refreshKey}/>
            )}
        </div>
    )
};

export default ShopMachineColumnChart;

