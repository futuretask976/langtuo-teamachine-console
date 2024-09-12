import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';

import { isArray, getTenantCode } from '../js/common.js';
import { get } from '../js/request.js';

const DeployPieChart = () => {
    // 数据定义
    const [deployData, setdeployData] = useState();

    // 初始化动作
    const fetchDeployData = () => {
        get('/summarychart/deploy', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setdeployData(prev => {
                let tmp = [];
                if (isArray(model)) {
                    model.forEach(item => {
                        tmp.push({
                            type: item.state == 0 ? '未部署' : '已部署',
                            value: item.amount
                        });
                    });
                }
                return tmp;
            });
        });
    }
    useEffect(() => {
        fetchDeployData();
    }, []);


    const config = {
        // data: [
        //     { type: '分类一', value: 27 },
        //     { type: '分类二', value: 25 },
        // ],
        data: deployData,
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };

    // 页面刷新
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshChart = () => {
        setRefreshKey(refreshKey + 1);
    };
    useEffect(() => {
        refreshChart();
    }, [deployData]);

    return (
        <div style={{height: '95%', width: '100%', border: '0px solid pink'}}>
            {isArray(deployData) && (
                <Pie {...config} key={'deployPieChart_' + refreshKey}/>
            )}
        </div>
    )
};

export default DeployPieChart;

