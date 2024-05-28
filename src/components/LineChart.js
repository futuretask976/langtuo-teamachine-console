import React from 'react';
import { Line } from '@ant-design/plots';

const LineChart = () => {
    console.log("container: ", document.getElementById('lineChartContainer'));
    console.log("container: ", document.documentElement.clientWidth);
    // 假设容器的宽度为 500px
    const containerWidth = document.documentElement.clientWidth;
    // 假设你想要将线宽设置为容器宽度的 20%
    const lineChartWidth = containerWidth * 0.75;

    let data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 }
    ];
    let config = {
        data,
        xField: 'year',
        yField: 'value',
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
        xAxis: {
            line: {style: { stroke: '#0A122E' }},
            label: {
                style: {
                    stroke: '#0A122E',
                    fontWeight: 100,
                }
            }
        }
    };

    return (
        <div id='lineChartContainer' style={{backgroundColor: '#fff', height: 200, width: '100%', border: '0px solid pink'}}>
            <Line width={lineChartWidth} {...config} />
        </div>
    )
};

export default LineChart;

