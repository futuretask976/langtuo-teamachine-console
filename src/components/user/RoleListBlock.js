import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const RoleListBlock = (props) => {
    // 样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);

    // 初始化动作相关
    const fetchListData = async () => {
        get('/userset/role/search', {  
            tenantCode: getTenantCode(),
            roleName: props.roleName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(resp => {
            let model = resp.model;
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            setList((prev => {
                let tmp = [];
                if (isArray(model.list)) {
                    model.list.forEach(ite => {
                        ite.key = ite.id;
                        ite.actions = ["edit", "delete"];
                        tmp.push(ite);
                    });
                }
                return tmp;
            }));
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.roleName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode',
            width: '25%'
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            width: '20%'
        },
        {
            title: '用户数',
            dataIndex: 'adminCount',
            key: 'adminCount',
            width: '10%'
        },
        {
            title: '系统预留',
            dataIndex: 'sysReserved',
            key: 'sysReserved',
            width: '10%',
            render: (sysReserved) => 1 == sysReserved ? '是' : '否'
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '20%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '15%',
            render: (_, { roleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + roleCode} onClick={(e) => onClickEdit(e, roleCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + roleCode} onClick={(e) => onClickDelete(e, roleCode)}>删除</a>
                        );
                    }
                })}
                </Space>
            ),
        },
    ];

    // 表格操作数据相关
    const onClickEdit = (e, roleCode) => {
        props.onClickEdit(roleCode);
    }
    const onClickDelete = (e, roleCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/userset/role/delete', {
            tenantCode: getTenantCode(),
            roleCode: roleCode
        }).then(resp => {
            if (resp.success) {
                alert('删除成功');
                fetchListData();
            } else {
                alert('删除失败：' + resp.errorMsg)
            }
        });
    }

    return (
        <div style={{ background: colorBgContainer, height: '100%' }}>
            <Table
                pagination={{
                    pageNum,
                    total,
                    pageSize,
                    onChange: (page) => setPageNum(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record => record.roleCode} />
        </div>
    )
};

export default RoleListBlock;

