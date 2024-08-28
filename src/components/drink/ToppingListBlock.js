import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getTenantCode, getJwtToken, getRespModel, handleRespError, isRespSuccess } from '../../js/common.js';

const ToppingListBlock = (props) => {
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
        let url = genGetUrlByParams('/drinkset/topping/search', {
            tenantCode: getTenantCode(),
            toppingCode: props.toppingCode4Search,
            toppingName: props.toppingName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
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
                    ite.actions = ["edit", "delete"];
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
    }, [props.toppingCode4Search, props.toppingName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '物料编码',
            dataIndex: 'toppingCode',
            key: 'toppingCode',
            width: '20%'
        },
        {
            title: '物料名称',
            dataIndex: 'toppingName',
            key: 'toppingName',
            width: '20%'
        },
        {
            title: '物料单位',
            dataIndex: 'measureUnit',
            key: 'measureUnit',
            width: '10%',
            render: (measureUnit) => measureUnit == 0 ? '克' : '毫升'
        },
        {
            title: '转速（档）',
            dataIndex: 'flowSpeed',
            key: 'flowSpeed',
            width: '10%',
            render: (flowSpeed) => flowSpeed
        },
        {
            title: '保质期',
            dataIndex: 'validHourPeriod',
            key: 'validHourPeriod',
            width: '10%'
        },
        {
            title: '清洗周期',
            dataIndex: 'cleanHourPeriod',
            key: 'cleanHourPeriod',
            width: '10%'
        },
        {
            title: '物料状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 1 ? '启用' : '禁用'
        },
        {
            title: '操作',
            key: 'actions',
            width: '10%',
            render: (_, { toppingCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + toppingCode} onClick={(e) => onClickEdit(e, toppingCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + toppingCode} onClick={(e) => onClickDelete(e, toppingCode)}>删除</a>
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
    const onClickEdit = (e, toppingCode) => {
        props.onClickEdit(toppingCode);
    }
    const onClickDelete = (e, toppingCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/topping/{segment}/{segment}/delete', [getTenantCode(), toppingCode]);
        axios.delete(url, {
            // withCredentials: true, // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                fetchListData();
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

export default ToppingListBlock;

