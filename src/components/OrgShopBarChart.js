import React, { useEffect, useState } from 'react';
import { Bar } from '@ant-design/plots';

import { isArray, getTenantCode } from '../js/common.js';
import { get } from '../js/request.js';
  
const OrgShopBarChart = () => {
    // 数据定义
    const [orgShopData, setOrgShopData] = useState();

    // 初始化动作
    const fetchOrgShopData = () => {
        get('/summarychart/orgshop', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setOrgShopData(prev => {
                let tmp = [];
                if (isArray(model)) {
                    model.forEach(item => {
                        tmp.push(item);
                    });
                }
                console.log('$$$$$ fetchOrgShopData tmp=', tmp);
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchOrgShopData();
    }, []);

    const config = {
        data: orgShopData,
        xField: 'orgName',
        yField: 'amount',
        sort: {
            reverse: true,
        },
        // label: {
        //     text: 'amount',
        //     formatter: '.1%',
        //     style: {
        //         textAlign: (d) => (+d.frequency > 0.008 ? 'right' : 'start'),
        //         fill: (d) => (+d.frequency > 0.008 ? '#fff' : '#000'),
        //         dx: (d) => (+d.frequency > 0.008 ? -5 : 5),
        //     },
        // },
        // axis: {
        //     y: {
        //         labelFormatter: '.0%',
        //     },
        // },
    };

    // 页面刷新
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshChart = () => {
        setRefreshKey(refreshKey + 1);
    };
    useEffect(() => {
        refreshChart();
    }, [orgShopData]);
    
    return (
        <div style={{height: '95%', width: '100%', border: '0px solid pink'}}>
            {isArray(orgShopData) && (
                <Bar {...config} key={'orgShopBarChart_' + refreshKey}/>
            )}
        </div>
    )
};

export default OrgShopBarChart;

