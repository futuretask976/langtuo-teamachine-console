import React from 'react';

import { theme, Space, Table, Tag } from 'antd';

const RoleListBlock = () => {
    let {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    let columns = [
        {
            title: '配方编码',
            dataIndex: 'toppingCode',
            key: 'toppingCode',
        },
        {
            title: '配方名称',
            dataIndex: 'toppingName',
            key: 'toppingName',
        },
        {
            title: '配方类型',
            dataIndex: 'toppingType',
            key: 'toppingType',
        },
        {
            title: '配方状态',
            dataIndex: 'toppingStat',
            key: 'toppingStat',
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
            toppingCode: '123456',
            toppingName: '奶茶三兄弟',
            toppingType: '自研',
            toppingStat: '启用',
            gmtCreated: '2024-10-22 20:00:00',
            actions: ['编辑', '删除'],
        },
        {
            key: '2',
            toppingCode: '123456',
            toppingName: '菠萝奶茶',
            toppingType: '自研',
            toppingStat: '启用',
            gmtCreated: '2024-10-22 20:00:00',
            actions: ['编辑', '删除'],
        },
        {
            key: '3',
            toppingCode: '123456',
            toppingName: '香蕉牛奶',
            toppingType: '自研',
            toppingStat: '启用',
            gmtCreated: '2024-10-22 20:00:00',
            actions: ['编辑', '删除'],
        },
        {
            key: '4',
            toppingCode: '123456',
            toppingName: '草莓牛奶',
            toppingType: '自研',
            toppingStat: '启用',
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

export default RoleListBlock;

