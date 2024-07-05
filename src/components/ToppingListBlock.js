import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs } from '../js/common.js';

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
    const fetchListData = () => {
        let url = genGetUrlByParams('/drinkset/topping/search', {
            tenantCode: 'tenant_001',
            toppingCode: props.toppingCode4Search,
            toppingName: props.toppingName4Search,
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
    }, [props.toppingCode4Search, props.toppingName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '物料编码',
            dataIndex: 'toppingCode',
            key: 'toppingCode',
            width: '20%',
            render: (text) => <a>{text}</a>
        },
        {
            title: '物料名称',
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '20%'
        },
        {
            title: '物料单位',
            dataIndex: 'measureUnit',
            key: 'measureUnit',
            width: '10%',
            render: (measureUnit) => measureUnit == 0 ? '克' : '毫升'
        },
        {
            title: '转速（档）',
            dataIndex: 'flowSpeed',
            key: 'flowSpeed',
            width: '10%',
            render: (flowSpeed) => flowSpeed
        },
        {
            title: '保质期',
            dataIndex: 'validHourPeriod',
            key: 'validHourPeriod',
            width: '10%'
        },
        {
            title: '清洗周期',
            dataIndex: 'cleanHourPeriod',
            key: 'cleanHourPeriod',
            width: '10%'
        },
        {
            title: '物料状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 1 ? '启用' : '禁用'
        },
        {
            title: '操作',
            key: 'actions',
            width: '10%',
            render: (_, { toppingCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + toppingCode} onClick={(e) => onClickEdit(e, toppingCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + toppingCode} onClick={(e) => onClickDelete(e, toppingCode)}>删除</a>
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
    const onClickEdit = (e, toppingCode) => {
        props.onClickEdit(toppingCode);
    }
    const onClickDelete = (e, toppingCode) => {
        let url = genGetUrlBySegs('/drinkset/topping/{segment}/{segment}/delete', ['tenant_001', toppingCode]);
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

export default RoleListBlock;

