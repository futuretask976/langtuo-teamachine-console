import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const ToppingListBlock = (props) => {
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
        get('/drinkset/topping/search', {
            tenantCode: getTenantCode(),
            toppingCode: props.toppingCode4Search,
            toppingName: props.toppingName4Search,
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
            title: applyLang('labelToppingCode'),
            dataIndex: 'toppingCode',
            key: 'toppingCode',
            width: '20%'
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
            render: (state) => state == 1 ? applyLang('labelEnabled') : applyLang('labelDisabled')
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '10%',
            render: (_, { toppingCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + toppingCode} onClick={(e) => onClickEdit(e, toppingCode)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + toppingCode} onClick={(e) => onClickDelete(e, toppingCode)}>{applyLang('labelOpeDel')}</a>
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
    const onClickEdit = (e, toppingCode) => {
        props.onClickEdit(toppingCode);
    }
    const onClickDelete = (e, toppingCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/drinkset/topping/delete', {
            tenantCode: getTenantCode(),
            toppingCode: toppingCode
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
                rowKey={record=>record.toppingCode} />
        </div>
    )
};

export default ToppingListBlock;

