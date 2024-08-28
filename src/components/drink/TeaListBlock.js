import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getRespModel, handleRespError, isRespSuccess, getJwtToken, getTenantCode, isArray } from '../../js/common.js';

const TeaListBlock = (props) => {
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
        let url = genGetUrlByParams('/drinkset/tea/search', {
            tenantCode: getTenantCode(),
            teaCode: props.teaCode4Search,
            teaName: props.teaName4Search,
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
            if (isArray(model.list)) {
                setList((prev => {
                    let tmp = [];
                    model.list.forEach(function(ite) {
                        ite.actions = ["edit", "delete"];
                        tmp.push(ite);
                    });
                    return tmp;
                }));
            }
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.teaCode4Search, props.teaName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '茶品编码',
            dataIndex: 'teaCode',
            key: 'teaTypeCode',
            width: '20%'
        },
        {
            title: '茶品名称',
            dataIndex: 'teaName',
            key: 'teaTypeName',
            width: '20%'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? '禁用' : '启用'
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
            render: (_, { teaCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + teaCode} onClick={(e) => onClickEdit(e, teaCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + teaCode} onClick={(e) => onClickDelete(e, teaCode)}>删除</a>
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
    const onClickEdit = (e, teaCode) => {
        props.onClickEdit(teaCode);
    }
    const onClickDelete = (e, teaCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/tea/{segment}/{segment}/delete', [getTenantCode(), teaCode]);
        axios.delete(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
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
                rowKey='id' />
        </div>
    )
};

export default TeaListBlock;

