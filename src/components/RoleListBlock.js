import React from 'react';

import { theme, Space, Table, Tag } from 'antd';

const RoleListBlock = () => {
    let {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    let columns = [
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
        },
        {
            title: '用户数',
            dataIndex: 'adminUserCnt',
            key: 'adminUserCnt',
        },
        {
            title: '是否系统预留',
            dataIndex: 'isReserved',
            key: 'isReserved',
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
            roleName: '系统超级管理员',
            gmtCreated: '2024-10-22 20:00:00',
            adminUserCnt: 1,
            isReserved: '是',
            actions: ['编辑', '删除'],
        },
        {
            key: '1',
            roleName: '商户超级管理员',
            gmtCreated: '2024-10-22 20:00:00',
            adminUserCnt: 3,
            isReserved: '是',
            actions: ['编辑', '删除'],
        },
        {
            key: '1',
            roleName: '饮品研发管理员',
            gmtCreated: '2024-10-22 20:00:00',
            adminUserCnt: 4,
            isReserved: '否',
            actions: ['编辑', '删除'],
        },
        {
            key: '1',
            roleName: '运营管理员',
            gmtCreated: '2024-10-22 20:00:00',
            adminUserCnt: 5,
            isReserved: '否',
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

