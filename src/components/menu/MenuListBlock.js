import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getRespErrorMsg, getRespModel, getTenantCode, getJwtToken, handleRespError, isRespSuccess } from '../../js/common.js';

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
    const fetchListData = () => {
        let url = genGetUrlByParams('/menuset/menu/search', {
            tenantCode: getTenantCode(),
            menuCode: props.menuCode4Search,
            menuName: props.menuName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            setList((prev => {
                let tmp = [];
                model.list.forEach(function(ite) {
                    ite.key = ite.id;
                    ite.actions = ["edit", "delete", "dispatch"];
                    tmp.push(ite);
                });
                return tmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.menuCode4Search, props.menuName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '菜单编码',
            dataIndex: 'menuCode',
            key: 'menuCode',
            width: '25%'
        },
        {
            title: '菜单名称',
            dataIndex: 'menuName',
            key: 'menuName',
            width: '25%'
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
            width: '25%',
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

        let url = genGetUrlBySegs('/menuset/menu/{segment}/{segment}/delete', [getTenantCode(), menuCode]);
        axios.delete(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert('删除成功');
                fetchListData();
            } else {
                alert('删除失败：' + getRespErrorMsg(response))
            }
        })
        .catch(error => {
            handleRespError(error);
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
                rowKey={record=>record.id} />
        </div>
    )
};

export default MenuListBlock;

