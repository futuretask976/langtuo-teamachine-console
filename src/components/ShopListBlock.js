import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { TEAMACHINE_HOST_URL, genGetUrlByParams, genGetUrlBySegs } from '../js/common.js';

const ShopListBlock = (props) => {
    // 样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const fetchShopListData = () => {
        let url = genGetUrlByParams(TEAMACHINE_HOST_URL, '/shop/search', {
            tenantCode: 'tenant_001',
            shopName: props.shopName4Search,
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
        fetchShopListData();
    }, [props.shopName4Search, props.shopGroupName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '店铺编码',
            dataIndex: 'shopCode',
            key: 'shopCode',
            width: '20%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '店铺名称',
            dataIndex: 'shopName',
            key: 'shopName',
            width: '20%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '20%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '店铺组名称',
            dataIndex: 'shopGroupName',
            key: 'shopGroupName',
            width: '20%'
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (_, { shopCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + shopCode} onClick={(e) => onClickEdit(e, shopCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + shopCode} onClick={(e) => onClickDelete(e, shopCode)}>删除</a>
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
    const onClickEdit = (e, shopCode) => {
        props.onClickEdit(shopCode);
    }
    const onClickDelete = (e, shopCode) => {
        let url4Delete = 'http://localhost:8080/teamachine/shop/tenant_001/' + shopCode + '/delete';
        axios.delete(url4Delete, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                alert("删除成功")
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

export default ShopListBlock;

