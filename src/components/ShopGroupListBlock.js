import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs } from '../js/common.js';

const ShopGroupListBlock = (props) => {
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
        let url = genGetUrlByParams('/shop/group/search', {
            tenantCode: 'tenant_001',
            shopGroupName: props.shopGroupName4Search,
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
    }, [props.shopGroupName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '店铺组编码',
            dataIndex: 'shopGroupCode',
            key: 'shopGroupCode',
            width: '20%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '店铺组名称',
            dataIndex: 'shopGroupName',
            key: 'shopGroupName',
            width: '20%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '店铺数量',
            dataIndex: 'shopCnt',
            key: 'shopCnt',
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
            width: '20%',
            render: (_, { shopGroupCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + shopGroupCode} onClick={(e) => onClickEdit(e, shopGroupCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + shopGroupCode} onClick={(e) => onClickDelete(e, shopGroupCode)}>删除</a>
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
    const onClickEdit = (e, shopGroupCode) => {
        props.onClickEdit(shopGroupCode);
    }
    const onClickDelete = (e, shopGroupCode) => {
        let url = genGetUrlBySegs('/shop/group/{segment}/{segment}/delete', ['tenant_001', shopGroupCode]);
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

export default ShopGroupListBlock;

