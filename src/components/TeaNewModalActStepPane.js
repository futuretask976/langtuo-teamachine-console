import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Switch, Table, Tabs, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

const { Content } = Layout;
const { TextArea } = Input;

const CleanRuleNewModalActStepPane = (props) => {
    // 步骤表格
    const [toppingActStepTableData, setToppingActTableData] = useState([
        {
            key: '1',
            step: '1',
            toppingSelectedList: [],
            actions: ['编辑', '删除'],
        },
        {
            key: '2',
            step: '1',
            toppingSelectedList: [],
            actions: ['编辑', '删除'],
        }
    ]);
    const toppingActStepTableColumns = [
        {
            title: '步骤',
            dataIndex: 'step',
            key: 'step',
        },
        {
            title: '物料',
            dataIndex: 'materialSelectedList',
            key: 'materialSelectedList',
            render: (_, { materialSelectedList }) => (
                <Select
                    mode="multiple"
                    placeholder="请选择"
                    size="middle"
                    defaultValue={materialSelectedList}
                    style={{width: '100%'}}
                    onChange={onSelectedMaterialChange}
                    options={materialData}
                />
            ),
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, { actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    return (
                        <a>{action}</a>
                    );
                })}
                </Space>
            ),
        },
    ];

    // 物料相关
    const materialData = [
        {
            value: '1',
            label: '牛奶'
        },
        {
            value: '2',
            label: '葡萄果酱'
        },
        {
            value: '3',
            label: '橙汁'
        },
        {
            value: '4',
            label: '咖啡'
        },
        {
            value: '5',
            label: '茉莉花茶'
        },
        {
            value: '6',
            label: '绿茶'
        }
    ];
    const onSelectedMaterialChange = (selectedMaterial) => {
    };

    return (
        <div class="flex-col-cont" style={{height: '100%', width: '100%'}}>
            <div class="flex-row-cont" style={{height: 50, width: '98%'}}>
                <div class="flex-row-cont" style={{justifyContent: 'flex-start', height: '100%', width: '100%'}}>
                    <Button key="back" type="primary" style={{height: 35, width: 80}}>新增</Button>
                </div>
            </div>
            <div class="flex-row-cont" style={{height: '100%', width: '98%'}}>
                <div class="flex-row-cont" style={{alignItems: 'flex-start', height: '100%', width: '100%'}}>
                    <Table columns={toppingActStepTableColumns} dataSource={toppingActStepTableData} size='small' style={{width: '100%'}} />
                </div>
            </div>
        </div>
    );
};

export default CleanRuleNewModalActStepPane;