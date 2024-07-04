import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { TEAMACHINE_HOST_URL, genGetUrlByParams, genGetUrlBySegs } from '../js/common.js';

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
    const fetchListData = () => {
        let url = genGetUrlByParams(TEAMACHINE_HOST_URL, '/tenant/search', {
            tenantName: props.tenantName4Search,
            contactPerson: props.contactPerson4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setPageNum(response.data.model.pageNum);
                setPageSize(response.data.model.pageSize);
                setTotal(response.data.model.total);
                setList((prev => {
                    let tmp = [];
                    response.data.model.list.forEach(function(ite) {
                        ite.key = ite.id;
                        ite.actions = ["edit", "delete"];
                        tmp.push(ite);
                    });
                    return tmp;
                }));
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
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
            width: '15%',
            render: (text) => <a>{text}</a>
        },
        {
            title: '商户名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
            width: '15%',
            render: (text) => <a>{text}</a>
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '20%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
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
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, tenantCode) => {
        props.onClickEdit(tenantCode);
    }
    const onClickDelete = (e, tenantCode) => {
        let url = genGetUrlBySegs(TEAMACHINE_HOST_URL, '/tenant', [
            tenantCode,
            'delete'
        ]);
        axios.delete(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                fetchListData();
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
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
                    onChange: (page)=>onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record=>record.id} />
        </div>
    )
};

export default TenantListBlock;

