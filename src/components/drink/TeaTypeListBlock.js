import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const TeaTypeListBlock = (props) => {
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
        get('/drinkset/tea/type/search', {
            tenantCode: getTenantCode(),
            teaTypeCode: props.teaTypeCode4Search,
            teaTypeName: props.teaTypeName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(respData => {
            if (respData === undefined) {
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
                        ite.key = ite.id;
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
            title: applyLang('labelTeaTypeCode'),
            dataIndex: 'teaTypeCode',
            key: 'teaTypeCode',
            width: '25%'
        },
        {
            title: applyLang('labelTeaTypeName'),
            dataIndex: 'teaTypeName',
            key: 'teaTypeName',
            width: '25%'
        },
        {
            title: applyLang('labelTeaCnt'),
            dataIndex: 'teaCount',
            key: 'teaCount',
            width: '15%'
        },
        {
            title: applyLang('labelGmtCreated'),
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '20%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '15%',
            render: (_, { teaTypeCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + teaTypeCode} onClick={(e) => onClickEdit(e, teaTypeCode)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + teaTypeCode} onClick={(e) => onClickDelete(e, teaTypeCode)}>{applyLang('labelOpeDel')}</a>
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
    const onClickEdit = (e, teaTypeCode) => {
        props.onClickEdit(teaTypeCode);
    }
    const onClickDelete = (e, teaTypeCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/drinkset/tea/type/delete', {
            tenantCode: getTenantCode(),
            teaTypeCode: teaTypeCode
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
                rowKey={record=>record.teaTypeCode} />
        </div>
    )
};

export default TeaTypeListBlock;

