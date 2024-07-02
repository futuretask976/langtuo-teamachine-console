import React, { useEffect, useState } from 'react';
import { theme, Space, Table, Tag } from 'antd';
import axios from 'axios';

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
    const fetchShopGroupListData = () => {
        let url = 'http://localhost:8080/teamachine/shop/group/search?tenantCode=tenant_001&shopGroupName=' + props.shopGroupName4Search + '&pageNum=' + pageNum + '&pageSize=' + pageSize;
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
        fetchShopGroupListData();
    }, [props.shopGroupName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '店铺组名称',
            dataIndex: 'shopGroupName',
            key: 'shopGroupName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '店铺组编码',
            dataIndex: 'shopGroupCode',
            key: 'shopGroupCode',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
        },
        {
            title: '店铺数量',
            dataIndex: 'shopCnt',
            key: 'shopCnt',
        },
        {
            title: '操作',
            key: 'actions',
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
    let data = list;
    data.forEach(function(ite) {
        ite.key = ite.shopGroupCode;
        ite.actions = ["edit", "delete"];
    });

    // 表格操作数据相关
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, shopGroupCode) => {
        props.onClickEdit(shopGroupCode);
    }
    const onClickDelete = (e, shopGroupCode) => {
        let url4Delete = 'http://localhost:8080/teamachine/shop/group/tenant_001/' + shopGroupCode + '/delete';
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
                dataSource={data}
                rowKey={record=>record.id} />
        </div>
    )
};

export default ShopGroupListBlock;

