import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const MenuListBlock = (props) => {
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
        get('/menuset/menu/search', {  
            tenantCode: getTenantCode(),
            menuCode: props.menuCode4Search,
            menuName: props.menuName4Search,
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
                        ite.actions = ["edit", "delete", "dispatch"];
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
            title: applyLang('labelMenuCode'),
            dataIndex: 'menuCode',
            key: 'menuCode',
            width: '30%'
        },
        {
            title: applyLang('labelMenuName'),
            dataIndex: 'menuName',
            key: 'menuName',
            width: '30%'
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
            render: (_, { menuCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + menuCode} onClick={(e) => onClickEdit(e, menuCode)}>{applyLang('labelEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + menuCode} onClick={(e) => onClickDelete(e, menuCode)}>{applyLang('labelDel')}</a>
                        );
                    }
                    if (action === 'dispatch') {
                        return (
                            <a key={action + '_' + menuCode} onClick={(e) => onClickDispatch(e, menuCode)}>{applyLang('labelDispatch')}</a>
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
    const onClickEdit = (e, menuCode) => {
        props.onClickEdit(menuCode);
    }
    const onClickDispatch = (e, menuCode) => {
        props.onClickDispatch(menuCode);
    }
    const onClickDelete = (e, menuCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/menuset/menu/delete', {
            tenantCode: getTenantCode(),
            menuCode: menuCode
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
                rowKey={record=>record.menuCode} />
        </div>
    )
};

export default MenuListBlock;

