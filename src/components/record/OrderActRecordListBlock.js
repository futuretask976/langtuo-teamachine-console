import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isArray, getTenantCode, isBlankStr } from '../../js/common.js';
import { get } from '../../js/request.js';

const OrderActRecordListBlock = (props) => {
    // 样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);

    // 初始化动作
    const fetchListData = () => {
        if (isBlankStr(props.shopGroupCode4Search)) {
            return;
        }

        get('/recordset/order/search', {  
            tenantCode: getTenantCode(),
            shopGroupCode: props.shopGroupCode4Search,
            shopCode: props.shopCode4Search,
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
                        ite.actions = ["view"];
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

    let columns = [
        {
            title: applyLang('labelMachineCode'),
            dataIndex: 'machineCode',
            key: 'machineCode',
            width: '20%'
        },
        {
            title: applyLang('labelTeaName'),
            dataIndex: 'teaName',
            key: 'teaName',
            width: '15%'
        },
        {
            title: applyLang('labelShopCode'),
            dataIndex: 'shopCode',
            key: 'shopCode',
            width: '15%'
        },
        {
            title: applyLang('labelState'),
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? applyLang('labelWaitting') : state == 1 ? applyLang('labelProducing') : state == 2 ? applyLang('labelProduced') : state == 3 ? applyLang('labelAbnormal') : applyLang('labelCancelled')
        },
        {
            title: applyLang('labelOuterOrderId'),
            dataIndex: 'outerOrderId',
            key: 'outerOrderId',
            width: '15%'
        },
        {
            title: applyLang('labelOrderGmtCreated'),
            dataIndex: 'orderGmtCreated',
            key: 'orderGmtCreated',
            width: '15%',
            render: (orderGmtCreated) => new Date(orderGmtCreated).toLocaleString()
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '10%',
            render: (_, { shopGroupCode, idempotentMark, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'view') {
                        return (
                            <a key={action + '_' + idempotentMark} onClick={(e) => onClickView(e, shopGroupCode, idempotentMark)}>{applyLang('labelOpeView')}</a>
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
    const onClickView = (e, shopGroupCode, idempotentMark) => {
        props.onClickView(shopGroupCode, idempotentMark);
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
                rowKey={record=>record.idempotentMark} />
        </div>
    )
};

export default OrderActRecordListBlock;

