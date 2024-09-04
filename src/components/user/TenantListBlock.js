import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const TenantListBlock = (props) => {
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
    const fetchListData = () => {
        get('/userset/tenant/search', {  
            tenantName: props.tenantName4Search,
            contactPerson: props.contactPerson4Search,
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
                    model.list.forEach(function(ite) {
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
    }, [props.tenantName4Search, props.contactPerson4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '商户编码',
            dataIndex: 'tenantCode',
            key: 'tenantCode',
            width: '15%'
        },
        {
            title: '商户名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
            width: '15%'
        },
        {
            title: '联系人名称',
            dataIndex: 'contactPerson',
            key: 'contactPerson',
            width: '20%',
        },
        {
            title: '联系人电话',
            dataIndex: 'contactPhone',
            key: 'contactPhone',
            width: '20%'
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
            width: '10%',
            render: (_, { tenantCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + tenantCode} onClick={(e) => onClickEdit(e, tenantCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + tenantCode} onClick={(e) => onClickDelete(e, tenantCode)}>删除</a>
                        );
                    }
                })}
                </Space>
            ),
        }
    ];
    
    // 表格操作数据相关
    const onClickEdit = (e, tenantCode) => {
        props.onClickEdit(tenantCode);
    }
    const onClickDelete = (e, tenantCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/userset/tenant/delete', {
            tenantCode: tenantCode
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
                rowKey={record => record.tenantCode} />
        </div>
    )
};

export default TenantListBlock;

