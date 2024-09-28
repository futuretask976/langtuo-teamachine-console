import React, { useEffect, useState } from 'react';
import { theme, Table } from 'antd';

import '../../css/common.css';
import { isArray, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

const OrderReportListBlock = (props) => {
    // 样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);

    // 初始化动作
    const fetchListData = () => {
        get('/reportset/order/orderreport/search', {  
            tenantCode: getTenantCode(),
            orderCreatedDay: props.orderCreatedDay,
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
            title: '统计时间',
            dataIndex: 'orderCreatedDay',
            key: 'orderCreatedDay',
            width: '25%'
        },
        {
            title: '数量',
            dataIndex: 'amount',
            key: 'amount',
            width: '75%'
        }
    ];

    // 表格操作数据相关
    const onChangePage = (page) => {
        setPageNum(page);
    }

    return (
        <div className='full-square' style={{ background: colorBgContainer }}>
            <Table
                pagination={{
                    pageNum,
                    total,
                    pageSize,
                    onChange: (page)=>onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record=>record.idempotentMark}
                size='small'/>
        </div>
    )
};

export default OrderReportListBlock;

