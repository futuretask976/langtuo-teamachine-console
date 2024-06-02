import React from 'react';

import { theme, Space, Table, Tag } from 'antd';

const OrgStrucListBlock = () => {
    let {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    let columns = [
        {
            title: '组织架构名称',
            dataIndex: 'orgStrucVal',
            key: 'orgStrucVal',
        },
        {
            title: '上级节点',
            dataIndex: 'parentOrgStrucVal',
            key: 'parentOrgStrucVal',
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
        },
    ];
    
    let data = [
        {
            key: '1',
            orgStrucVal: '总公司',
            parentOrgStrucVal: '无',
            gmtCreated: '2024-10-22 20:00:00',
        },
        {
            key: '2',
            orgStrucVal: '上海分公司',
            parentOrgStrucVal: '总公司',
            gmtCreated: '2024-10-22 20:00:00',
        },
        {
            key: '3',
            orgStrucVal: '江苏省分公司',
            parentOrgStrucVal: '总公司',
            gmtCreated: '2024-10-22 20:00:00',
        },
        {
            key: '4',
            orgStrucVal: '苏州市分公司',
            parentOrgStrucVal: '江苏省分公司',
            gmtCreated: '2024-10-22 20:00:00',
        }
    ];

    return (
        <div style={{ background: colorBgContainer, height: '100%' }}>
            <Table columns={columns} dataSource={data} />
        </div>
    )
};

export default OrgStrucListBlock;

