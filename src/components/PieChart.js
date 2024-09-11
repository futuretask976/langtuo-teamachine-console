import React from 'react';
import { Pie } from '@ant-design/plots';

const PieChart = () => {
    const config = {
        data: [
            { type: '分类一', value: 27 },
            { type: '分类二', value: 25 },
        ],
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
    return (
        <Pie {...config}/>
    )
};

export default PieChart;

