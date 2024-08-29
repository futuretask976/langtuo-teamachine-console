import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getRespErrorMsg, getJwtToken, getTenantCode, getRespModel, handleRespError, isRespSuccess } from '../../js/common.js';

const TeaTypeListBlock = (props) => {
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
        let url = genGetUrlByParams('/drinkset/tea/type/search', {
            tenantCode: getTenantCode(),
            teaTypeCode: props.teaTypeCode4Search,
            teaTypeName: props.teaTypeName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
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
    }, [props.teaTypeCode4Search, props.teaTypeName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '类型编码',
            dataIndex: 'teaTypeCode',
            key: 'teaTypeCode',
            width: '20%'
        },
        {
            title: '类型名称',
            dataIndex: 'teaTypeName',
            key: 'teaTypeName',
            width: '20%'
        },
        {
            title: '茶品数量',
            dataIndex: 'teaCount',
            key: 'teaCount',
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
            render: (_, { teaTypeCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + teaTypeCode} onClick={(e) => onClickEdit(e, teaTypeCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + teaTypeCode} onClick={(e) => onClickDelete(e, teaTypeCode)}>删除</a>
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
    const onClickEdit = (e, teaTypeCode) => {
        props.onClickEdit(teaTypeCode);
    }
    const onClickDelete = (e, teaTypeCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/tea/type/{segment}/{segment}/delete', [getTenantCode(), teaTypeCode]);
        axios.delete(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert('删除成功');
                fetchListData();
            } else {
                alert('删除失败：' + getRespErrorMsg(response))
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

export default TeaTypeListBlock;

