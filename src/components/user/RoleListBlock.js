import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getRespModel, handleRespError, isRespSuccess, getJwtToken, getTenantCode, isArray } from '../../js/common.js';

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
    const fetchListData = async () => {
        let url = genGetUrlByParams('/userset/role/search', {
            tenantCode: getTenantCode(),
            roleName: props.roleName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
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
        })
        .catch(error => {
            handleRespError(error);
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
            dataIndex: 'adminUserCnt',
            key: 'adminUserCnt',
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
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, roleCode) => {
        props.onClickEdit(roleCode);
    }
    const onClickDelete = (e, roleCode) => {
        let url = genGetUrlBySegs('/userset/role/{segment}/{segment}/delete', ['tenant_001', roleCode]);
        axios.delete(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert('删除成功');
                fetchListData();
            }
        })
        .catch(error => {
            handleRespError(error);
        });
    }

    return (
        <div style={{ background: colorBgContainer, height: '100%' }}>
            <Table
                pagination={{
                    pageNum,
                    total,
                    pageSize,
                    onChange: (page)=>onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record=>record.id} />
        </div>
    )
};

export default RoleListBlock;

