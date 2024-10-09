import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
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
            title: '机器编码',
            dataIndex: 'machineCode',
            key: 'machineCode',
            width: '20%'
        },
        {
            title: '茶品名称',
            dataIndex: 'teaName',
            key: 'teaName',
            width: '15%'
        },
        {
            title: '店铺编码',
            dataIndex: 'shopCode',
            key: 'shopCode',
            width: '15%'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? '未制作' : state == 1 ? '制作中' : state == 2 ? '已制作' : state == 3 ? '有异常' : '已取消'
        },
        {
            title: '外部订单号',
            dataIndex: 'outerOrderId',
            key: 'outerOrderId',
            width: '15%'
        },
        {
            title: '下单时间',
            dataIndex: 'orderGmtCreated',
            key: 'orderGmtCreated',
            width: '15%',
            render: (orderGmtCreated) => new Date(orderGmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '10%',
            render: (_, { shopGroupCode, idempotentMark, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'view') {
                        return (
                            <a key={action + '_' + idempotentMark} onClick={(e) => onClickView(e, shopGroupCode, idempotentMark)}>查看</a>
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

export default OrderActRecordListBlock;

