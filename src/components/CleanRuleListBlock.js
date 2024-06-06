import React from 'react';

import { theme, Space, Table, Tag } from 'antd';

const CleanRuleListBlock = () => {
    let {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'ruleCode',
            key: 'ruleCode',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '规则名称',
            dataIndex: 'ruleName',
            key: 'ruleName',
        },
        {
            title: '清洗步骤',
            dataIndex: 'cleanStepCnt',
            key: 'cleanStepCnt',
        },
        {
            title: '是否提前提醒',
            dataIndex: 'isRemind',
            key: 'isRemind',
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
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
    
    let data = [
        {
            key: '1',
            ruleCode: '123456',
            ruleName: '营业规则',
            cleanStepCnt: 3,
            isRemind: '提醒',
            gmtCreated: '2024-10-22 20:00:00',
            actions: ['编辑', '删除'],
        },
        {
            key: '1',
            ruleCode: '123456',
            ruleName: '打烊规则',
            cleanStepCnt: 3,
            isRemind: '提醒',
            gmtCreated: '2024-10-22 20:00:00',
            actions: ['编辑', '删除'],
        }
    ];

    return (
        <div style={{ background: colorBgContainer, height: '100%' }}>
            <Table columns={columns} dataSource={data} />
        </div>
    )
};

export default CleanRuleListBlock;

