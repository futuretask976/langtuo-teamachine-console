import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const ToppingTypeListBlock = (props) => {
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
        get('/drinkset/topping/type/search', {
            tenantCode: getTenantCode(),
            toppingTypeCode: props.toppingTypeCode4Search,
            toppingTypeName: props.toppingTypeName4Search,
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
            title: applyLang('labelToppingTypeCode'),
            dataIndex: 'toppingTypeCode',
            key: 'toppingTypeCode',
            width: '20%'
        },
        {
            title: applyLang('labelToppingTypeName'),
            dataIndex: 'toppingTypeName',
            key: 'toppingTypeName',
            width: '20%'
        },
        {
            title: applyLang('labelToppingCnt'),
            dataIndex: 'toppingCount',
            key: 'toppingCount',
            width: '20%'
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
            width: '20%',
            render: (_, { toppingTypeCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + toppingTypeCode} onClick={(e) => onClickEdit(e, toppingTypeCode)}>{applyLang('labelEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + toppingTypeCode} onClick={(e) => onClickDelete(e, toppingTypeCode)}>{applyLang('labelDel')}</a>
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
    const onClickEdit = (e, toppingTypeCode) => {
        props.onClickEdit(toppingTypeCode);
    }
    const onClickDelete = (e, toppingTypeCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/drinkset/topping/type/delete', {
            tenantCode: getTenantCode(),
            toppingTypeCode: toppingTypeCode
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
                rowKey={record=>record.toppingTypeCode} />
        </div>
    )
};

export default ToppingTypeListBlock;

