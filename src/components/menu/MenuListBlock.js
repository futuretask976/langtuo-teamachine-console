import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const MenuListBlock = (props) => {
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

    // 表格展示数据相关
    const columns = [
        {
            title: '菜单编码',
            dataIndex: 'menuCode',
            key: 'menuCode',
            width: '30%'
        },
        {
            title: '菜单名称',
            dataIndex: 'menuName',
            key: 'menuName',
            width: '30%'
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '25%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '15%',
            render: (_, { menuCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + menuCode} onClick={(e) => onClickEdit(e, menuCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + menuCode} onClick={(e) => onClickDelete(e, menuCode)}>删除</a>
                        );
                    }
                    if (action == 'dispatch') {
                        return (
                            <a key={action + '_' + menuCode} onClick={(e) => onClickDispatch(e, menuCode)}>分发</a>
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
    const onClickEdit = (e, menuCode) => {
        props.onClickEdit(menuCode);
    }
    const onClickDispatch = (e, menuCode) => {
        props.onClickDispatch(menuCode);
    }
    const onClickDelete = (e, menuCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/menuset/menu/delete', {
            tenantCode: getTenantCode(),
            menuCode: menuCode
        }).then(resp => {
            if (resp.success) {
                alert('删除成功！');
                fetchListData();
            } else {
                alert('删除失败：' + resp.errorMsg)
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

