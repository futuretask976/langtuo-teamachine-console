import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, getJwtToken, getTenantCode, getRespModel, handleRespError, isRespSuccess } from '../../js/common.js';

const ToppingTypeListBlock = (props) => {
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
        let url = genGetUrlByParams('/drinkset/topping/type/search', {
            tenantCode: getTenantCode(),
            toppingTypeCode: props.toppingTypeCode4Search,
            toppingTypeName: props.toppingTypeName4Search,
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
    }, [props.toppingTypeCode4Search, props.toppingTypeName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '物料类型编码',
            dataIndex: 'toppingTypeCode',
            key: 'toppingTypeCode',
            width: '20%'
        },
        {
            title: '物料类型名称',
            dataIndex: 'toppingTypeName',
            key: 'toppingTypeName',
            width: '20%'
        },
        {
            title: '物料数量',
            dataIndex: 'shopCnt',
            key: 'shopCnt',
            width: '20%'
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '20%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (_, { toppingTypeCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + toppingTypeCode} onClick={(e) => onClickEdit(e, toppingTypeCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + toppingTypeCode} onClick={(e) => onClickDelete(e, toppingTypeCode)}>删除</a>
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
    const onClickEdit = (e, toppingTypeCode) => {
        props.onClickEdit(toppingTypeCode);
    }
    const onClickDelete = (e, toppingTypeCode) => {
        let url = genGetUrlBySegs('/drinkset/topping/type/{segment}/{segment}/delete', [getTenantCode(), toppingTypeCode]);
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

export default ToppingTypeListBlock;

