import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const TeaListBlock = (props) => {
    // 样式定义
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 数据定义
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);

    // 动作定义
    const fetchListData = () => {
        get('/drinkset/tea/search', {
            tenantCode: getTenantCode(),
            teaCode: props.teaCode4Search,
            teaName: props.teaName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(respData => {
            if (respData == undefined) {
                return;
            }
            let model = respData.model;
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            setList((prev => {
                let tmp = [];
                if (isArray(model.list)) {
                    model.list.forEach(function(ite) {
                        ite.actions = ["edit", "delete"];
                        tmp.push(ite);
                    });
                }
                return tmp;
            }));
            
        });
    }
    useEffect(() => {
        fetchListData();
    }, [pageNum]);

    // 表格定义
    const columns = [
        {
            title: '茶品编码',
            dataIndex: 'teaCode',
            key: 'teaTypeCode',
            width: '25%'
        },
        {
            title: '茶品名称',
            dataIndex: 'teaName',
            key: 'teaTypeName',
            width: '25%'
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
            width: '15%',
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
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, teaCode) => {
        props.onClickEdit(teaCode);
    }
    const onClickDelete = (e, teaCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/drinkset/tea/delete', {
            tenantCode: getTenantCode(),
            teaCode: teaCode
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgDelSucceed'));
                fetchListData();
            } else {
                alert(applyLang('msgDelFailed') + respData.errorMsg)
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
                rowKey={record => record.teaCode}/>
        </div>
    )
};

export default TeaListBlock;

