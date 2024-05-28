import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { forEach, groupBy } from 'lodash-es';

const ColumnChart = () => {
    let [data, setData] = useState([]);
  
    let asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/antfincdn/8elHX%26irfq/stack-column-data.json')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
        });
    };
  
    useEffect(() => {
        asyncFetch();
    }, []);
  
    let annotations = [];
    forEach(groupBy(data, 'year'), (values, k) => {
        let value = values.reduce((a, b) => a + b.value, 0);
        annotations.push({
            type: 'text',
            data: [k, value],
            style: {
                textAlign: 'center',
                fontSize: 14,
                fill: 'rgba(0,0,0,0.85)',
                text: `${value}`,
                textBaseline: 'bottom',
                position: 'top',
            },
            xField: 'year',
            yField: 'value',
            tooltip: false,
        });
    });
  
    let config = {
        data,
        xField: 'year',
        yField: 'value',
        stack: true,
        colorField: 'type',
        label: {
            text: 'value',
            textBaseline: 'bottom',
            position: 'inside',
        },
        annotations,
    };
    return (
        <div style={{backgroundColor: '#fff', height: 200}}>
            <Column {...config} />
        </div>
    )
};

export default ColumnChart;

