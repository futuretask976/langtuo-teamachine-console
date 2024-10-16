import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isArray, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

const SupplyActRecordListBlock = (props) => {
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
        get('/recordset/supply/search', {  
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
            title: applyLang('labelShopCode'),
            dataIndex: 'shopCode',
            key: 'shopCode',
            width: '20%'
        },
        {
            title: applyLang('labelSupplyTime'),
            dataIndex: 'supplyTime',
            key: 'supplyTime',
            width: '15%',
            render: (invalidTime) => new Date(invalidTime).toLocaleString()
        },
        {
            title: applyLang('labelToppingCode'),
            dataIndex: 'toppingCode',
            key: 'toppingCode',
            width: '15%'
        },
        {
            title: applyLang('labelPipelineNo'),
            dataIndex: 'pipelineNum',
            key: 'pipelineNum',
            width: '10%'
        },
        {
            title: applyLang('labelSupplyAmount'),
            dataIndex: 'supplyAmount',
            key: 'supplyAmount',
            width: '10%'
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '10%',
            render: (_, { idempotentMark, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'view') {
                        return (
                            <a key={action + '_' + idempotentMark} onClick={(e) => onClickView(e, idempotentMark)}>{applyLang('labelOpeView')}</a>
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
    const onClickView = (e, idempotentMark) => {
        props.onClickView(idempotentMark);
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

export default SupplyActRecordListBlock;

