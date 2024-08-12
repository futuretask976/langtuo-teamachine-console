import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, getRespModel, handleRespError, getTenantCode, getJwtToken, isBlankArray } from '../../js/common.js';

const InvalidActRecordListBlock = (props) => {
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
        let url = genGetUrlByParams('/recordset/invalid/search', {
            tenantCode: getTenantCode(),
            shopGroupCodeList: [props.shopGroupCode4Search],
            shopCodeList: [props.shopCode4Search],
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            if (!isBlankArray(model.list)) {
                setList((prev => {
                    let tmp = [];
                    model.list.forEach(function(ite) {
                        ite.key = ite.id;
                        ite.actions = ["view"];
                        tmp.push(ite);
                    });
                    return tmp;
                }));
            }
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.shopGroupCode4Search, props.shopCode4Search, pageNum]);

    let columns = [
        {
            title: '机器编码',
            dataIndex: 'machineCode',
            key: 'machineCode'
        },
        {
            title: '店铺组名称',
            dataIndex: 'shopGroupName',
            key: 'shopGroupName',
        },
        {
            title: '失效时间',
            dataIndex: 'invalidTime',
            key: 'invalidTime',
            render: (invalidTime) => new Date(invalidTime).toLocaleString()
        },
        {
            title: '物料名称',
            dataIndex: 'toppingName',
            key: 'toppingName'
        },
        {
            title: '管道序号',
            dataIndex: 'pipelineNum',
            key: 'pipelineNum'
        },
        {
            title: '失效数量',
            dataIndex: 'invalidAmount',
            key: 'invalidAmount'
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, { idempotentMark, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'view') {
                        return (
                            <a key={action + '_' + idempotentMark} onClick={(e) => onClickView(e, idempotentMark)}>查看</a>
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

export default InvalidActRecordListBlock;

