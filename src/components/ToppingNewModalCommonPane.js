import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, InputNumber, Layout, Modal, Radio, Select, Slider, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const ToppingNewModalCommonPane = (props) => {
    // 标准配方表格
    const tempeMarks = {
        0: '0°C',
        10: '10°C',
        20: '20°C',
        30: {
            style: {
                color: '#f50',
            },
            label: <strong>30°C</strong>,
        },
    };
    const onCommonWeightChange = (newCommonWeight) => {
    };
    const onKeepTempeChange = (newKeepTempe) => {
    };
    const [commonToppingTableData, setCommonToppingTableData] = useState([
        {
            key: '1',
            step: '1',
            materialName: '牛奶',
            commonWeight: 20,
            unit: '克',
            keepTempe: false,
            tempeScope: [10, 20],
        },
        {
            key: '2',
            step: '1',
            materialName: '绿茶',
            commonWeight: 30,
            unit: '克',
            keepTempe: false,
            tempeScope: [15, 25],
        }
    ]);
    const commonToppingTableColumns = [
        {
            title: '步骤',
            dataIndex: 'step',
            key: 'step',
        },
        {
            title: '物料',
            dataIndex: 'materialName',
            key: 'materialName',
        },
        {
            title: '标准量',
            dataIndex: 'commonWeight',
            key: 'commonWeight',
            render: (_, { commonWeight }) => (
                <InputNumber min={1} max={10000} defaultValue={commonWeight} onChange={onCommonWeightChange} size="small" />
            ),
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: '是否需要温度',
            dataIndex: 'keepTempe',
            key: 'keepTempe',
            render: (_, { keepTempe }) => (
                <Checkbox defaultValue={keepTempe} onChange={onKeepTempeChange} size="small">Checkbox</Checkbox>
            ),
        },
        {
            title: '温度范围',
            dataIndex: 'tempeScope',
            key: 'tempeScope',
            render: (_, { tempeScope }) => (
                // <Slider range marks={tempeMarks} defaultValue={tempeScope} size="small" />
                <><InputNumber min={1} max={10000} defaultValue={1} onChange={onCommonWeightChange} size="small" /> - <InputNumber min={1} max={10000} defaultValue={1} onChange={onCommonWeightChange} size="small" /></>
                
            ),
        }
    ];

    return (
        <div class="flex-col-cont" style={{height: '100%', width: '100%', border: '0px solid red'}}>
            <div class="flex-row-cont" style={{height: 50, width: '98%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
                    <Button key="back" type="primary" style={{height: 35, width: 80}}>新增</Button>
                </div>
            </div>
            <div class="flex-row-cont" style={{height: '100%', width: '98%'}}>
                <div class="flex-row-cont" style={{alignItems: 'flex-start', height: '100%', width: '100%'}}>
                    <Table columns={commonToppingTableColumns} dataSource={commonToppingTableData} size='small' style={{width: '100%'}} />
                </div>
            </div>
        </div>
    );
};

export default ToppingNewModalCommonPane;