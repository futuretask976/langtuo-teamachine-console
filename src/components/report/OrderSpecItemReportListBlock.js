import React, { useEffect, useState } from 'react';
import { theme, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isArray, getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

const OrderSpecItemReportListBlock = (props) => {
    // 样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const fetchListData = () => {
        get('/reportset/order/specitemreport/search', {  
            tenantCode: getTenantCode(),
            orderCreatedDay: props.orderCreatedDay,
            shopGroupCode: props.shopGroupCode4Search,
            shopCode: props.shopCode4Search,
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
            title: applyLang('labelCalcTime'),
            dataIndex: 'orderCreatedDay',
            key: 'orderCreatedDay',
            width: '20%'
        },
        {
            title: applyLang('labelSpecItemCode'),
            dataIndex: 'specItemCode',
            key: 'specItemCode',
            width: '20%'
        },
        {
            title: applyLang('labelAmount'),
            dataIndex: 'amount',
            key: 'amount',
            width: '20%'
        }
    ];

    // 表格操作数据相关
    const onChangePage = (page) => {
        setPageNum(page);
    }

    return (
        <div className='full-square' style={{ background: colorBgContainer, height: '100%' }}>
            <Table
                pagination={{
                    pageNum,
                    total,
                    pageSize,
                    onChange: (page)=>onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record => record.orderCreatedDay + '_' + record.specItemCode}
                size='small'
                title={() => <span style={{fontWeight: 'bold'}}>{applyLang('labelOrderSpecData')}</span>}/>
        </div>
    )
};

export default OrderSpecItemReportListBlock;

