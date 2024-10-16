import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const ShopListBlock = (props) => {
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
        get('/shopset/shop/search', {  
            tenantCode: getTenantCode(),
            shopName: props.shopName4Search,
            shopGroupCode: props.shopGroupCode4Search,
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
            title: applyLang('labelShopCode'),
            dataIndex: 'shopCode',
            key: 'shopCode',
            width: '25%'
        },
        {
            title: applyLang('labelShopName'),
            dataIndex: 'shopName',
            key: 'shopName',
            width: '20%'
        },
        {
            title: '店铺组名称',
            dataIndex: 'shopGroupName',
            key: 'shopGroupName',
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
            width: '15%',
            render: (_, { shopCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + shopCode} onClick={(e) => onClickEdit(e, shopCode)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + shopCode} onClick={(e) => onClickDelete(e, shopCode)}>{applyLang('labelOpeDel')}</a>
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
    const onClickEdit = (e, shopCode) => {
        props.onClickEdit(shopCode);
    }
    const onClickDelete = (e, shopCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/shopset/shop/delete', {
            tenantCode: getTenantCode(),
            shopCode: shopCode
        }).then(resp => {
            if (resp.success) {
                alert(applyLang('msgDelSucceed'));
                fetchListData();
            } else {
                alert(applyLang('msgDelFailed') + resp.errorMsg)
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
                rowKey={record=>record.shopCode} />
        </div>
    )
};

export default ShopListBlock;

