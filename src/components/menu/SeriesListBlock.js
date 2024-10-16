import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const SeriesListBlock = (props) => {
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
        get('/menuset/series/search', {  
            tenantCode: getTenantCode(),
            seriesCode: props.seriesCode4Search,
            seriesName: props.seriesName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(respData => {
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
            title: applyLang('labelSeriesCode'),
            dataIndex: 'seriesCode',
            key: 'seriesCode',
            width: '30%'
        },
        {
            title: applyLang('labelSeriesName'),
            dataIndex: 'seriesName',
            key: 'seriesName',
            width: '30%'
        },
        {
            title: applyLang('labelGmtCreated'),
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '25%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '15%',
            render: (_, { seriesCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + seriesCode} onClick={(e) => onClickEdit(e, seriesCode)}>{applyLang('labelEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + seriesCode} onClick={(e) => onClickDelete(e, seriesCode)}>{applyLang('labelDel')}</a>
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
    const onClickEdit = (e, seriesCode) => {
        props.onClickEdit(seriesCode);
    }
    const onClickDelete = (e, seriesCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/menuset/series/delete', {
            tenantCode: getTenantCode(),
            seriesCode: seriesCode
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
                rowKey={record=>record.seriesCode} />
        </div>
    )
};

export default SeriesListBlock;

