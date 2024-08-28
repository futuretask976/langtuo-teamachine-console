import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getTenantCode, getJwtToken, getRespModel, handleRespError, isRespSuccess } from '../../js/common.js';

const SeriesListBlock = (props) => {
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
        let url = genGetUrlByParams('/menuset/series/search', {
            tenantCode: getTenantCode(),
            seriesCode: props.seriesCode4Search,
            seriesName: props.seriesName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
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
                model.list.forEach(function(ite) {
                    ite.key = ite.id;
                    ite.actions = ["edit", "delete"];
                    tmp.push(ite);
                });
                return tmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.seriesCode4Search, props.seriesName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '系列编码',
            dataIndex: 'seriesCode',
            key: 'seriesCode',
            width: '25%'
        },
        {
            title: '系列名称',
            dataIndex: 'seriesName',
            key: 'seriesName',
            width: '25%'
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '25%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '25%',
            render: (_, { seriesCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + seriesCode} onClick={(e) => onClickEdit(e, seriesCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + seriesCode} onClick={(e) => onClickDelete(e, seriesCode)}>删除</a>
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
    const onClickEdit = (e, seriesCode) => {
        props.onClickEdit(seriesCode);
    }
    const onClickDelete = (e, seriesCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        let url = genGetUrlBySegs('/menuset/series/{segment}/{segment}/delete', [getTenantCode(), seriesCode]);
        axios.delete(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
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
                rowKey={record=>record.id} />
        </div>
    )
};

export default SeriesListBlock;

