import React from 'react';

import { theme, Space, Table, Tag } from 'antd';

const RoleListBlock = () => {
    let {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    let columns = [
        {
            title: '商户名称',
            dataIndex: 'clientName',
            key: 'roleName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
        },
        {
            title: '联系人名称',
            dataIndex: 'clientContactor',
            key: 'clientContactor',
        },
        {
            title: '联系人电话',
            dataIndex: 'clientPhone',
            key: 'clientPhone',
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
            clientName: '沪上阿姨',
            gmtCreated: '2024-10-22 20:00:00',
            clientContactor: '张三',
            clientPhone: '13699999999',
            actions: ['编辑', '删除'],
        },
        {
            key: '2',
            clientName: '眷茶',
            gmtCreated: '2024-10-22 20:00:00',
            clientContactor: '李四',
            clientPhone: '13699999999',
            actions: ['编辑', '删除'],
        },
        {
            key: '2',
            clientName: '霸王茶姬',
            gmtCreated: '2024-10-22 20:00:00',
            clientContactor: '王五',
            clientPhone: '13699999999',
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

