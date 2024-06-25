import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

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
    const fetchMachineModelListData = () => {
        let url = 'http://localhost:8080/teamachine/tenant/search?tenantName=' + props.tenantName4Search + '&contactPerson=' + props.contactPerson4Search + '&pageNum=' + pageNum + '&pageSize=' + pageSize;
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setPageNum(response.data.model.pageNum);
                setPageSize(response.data.model.pageSize);
                setTotal(response.data.model.total);
                setList((prev => {
                    return response.data.model.list
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
        fetchMachineModelListData();
    }, [props.tenantName4Search, props.contactPerson4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '商户名称',
            dataIndex: 'tenantName',
            key: 'tenantName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '联系人名称',
            dataIndex: 'contactPerson',
            key: 'contactPerson',
        },
        {
            title: '联系人电话',
            dataIndex: 'contactPhone',
            key: 'contactPhone',
        },
        {
            title: '操作',
            key: 'actions',
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
        },
    ];
    let data = list;
    data.forEach(function(ite) {
        ite.key = ite.modelCode;
        ite.actions = ["edit", "delete"];
    });
    
    // 表格操作数据相关
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, tenantCode) => {
        props.onClickEdit(tenantCode);
    }
    const onClickDelete = (e, tenantCode) => {
        let url = 'http://localhost:8080/teamachine/tenant/' + tenantCode + '/delete';
        axios.delete(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setPageNum(response.data.model.pageNum);
                setPageSize(response.data.model.pageSize);
                setTotal(response.data.model.total);
                setList((prev => {
                    return response.data.model.list
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
                dataSource={data}
                rowKey={record=>record.id} />
        </div>
    )
};

export default TenantListBlock;

