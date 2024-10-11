import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const SpecListBlock = (props) => {
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
        get('/drinkset/spec/search', {
            tenantCode: getTenantCode(),
            specCode: props.specCode4Search,
            specName: props.specName4Search,
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
            title: '规格编码',
            dataIndex: 'specCode',
            key: 'specCode',
            width: '20%'
        },
        {
            title: '规格名称',
            dataIndex: 'specName',
            key: 'specName',
            width: '20%'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? '禁用' : '启用'
        },
        {
            title: '规格项',
            dataIndex: 'specItemList',
            key: 'specItemList',
            width: '40%',
            render: (specItemList) => (
                <Space size="middle">
                {specItemList.map((specItem) => {
                    return (<span key={specItem.specItemCode}>{specItem.specItemName}</span>);
                })}
                </Space>
            )
        },
        {
            title: '操作',
            key: 'actions',
            width: '10%',
            render: (_, { specCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + specCode} onClick={(e) => onClickEdit(e, specCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + specCode} onClick={(e) => onClickDelete(e, specCode)}>删除</a>
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
    const onClickEdit = (e, specCode) => {
        props.onClickEdit(specCode);
    }
    const onClickDelete = (e, specCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/drinkset/spec/delete', {
            tenantCode: getTenantCode(),
            specCode: specCode
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
                rowKey={record => record.specCode}/>
        </div>
    )
};

export default SpecListBlock;

