import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode } from '../../js/common.js';
import { get, del } from '../../js/request.js';

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
    const fetchListData = () => {
        get('/shopset/shop/search', {  
            tenantCode: getTenantCode(),
            shopName: props.shopName4Search,
            shopGroupName: props.shopGroupName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(resp => {
            let model = resp.model;
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            setList((prev => {
                let tmp = [];
                model.list.forEach(function(ite) {
                    ite.key = ite.id;
                    ite.actions = ["edit", "delete"];
                    tmp.push(ite);
                });
                return tmp;
            }));
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.shopName4Search, props.shopGroupName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '店铺编码',
            dataIndex: 'shopCode',
            key: 'shopCode',
            width: '20%'
        },
        {
            title: '店铺名称',
            dataIndex: 'shopName',
            key: 'shopName',
            width: '20%'
        },
        {
            title: '店铺组名称',
            dataIndex: 'shopGroupName',
            key: 'shopGroupName',
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
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/shopset/shop/delete', {
            tenantCode: getTenantCode(),
            shopCode: shopCode
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
                    onChange: (page)=>onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record=>record.id} />
        </div>
    )
};

export default ShopListBlock;

