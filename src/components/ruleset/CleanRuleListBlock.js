import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs } from '../../js/common.js';

const CleanRuleListBlock = (props) => {
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
        let url = genGetUrlByParams('/ruleset/clean/search', {
            tenantCode: 'tenant_001',
            cleanRuleCode: props.cleanRuleCode4Search,
            cleanRuleName: props.cleanRuleName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setPageNum(response.data.model.pageNum);
                setPageSize(response.data.model.pageSize);
                setTotal(response.data.model.total);
                setList((prev => {
                    let tmp = [];
                    response.data.model.list.forEach(function(ite) {
                        ite.key = ite.id;
                        ite.actions = ["edit", "delete", "dispatch"];
                        tmp.push(ite);
                    });
                    return tmp;
                }));
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.cleanRuleCode4Search, props.cleanRuleName4Search, pageNum]);

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'cleanRuleCode',
            key: 'cleanRuleCode',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '规则名称',
            dataIndex: 'cleanRuleName',
            key: 'cleanRuleName',
        },
        {
            title: '是否提前提醒',
            dataIndex: 'permitRemind',
            key: 'permitRemind',
            render: (permitRemind) => permitRemind == 1 ? '启用' : '禁用',
        },
        {
            title: '是否允许批量',
            dataIndex: 'permitBatch',
            key: 'permitBatch',
            render: (permitBatch) => permitBatch == 1 ? '启用' : '禁用',
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, { cleanRuleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + cleanRuleCode} onClick={(e) => onClickEdit(e, cleanRuleCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + cleanRuleCode} onClick={(e) => onClickDelete(e, cleanRuleCode)}>删除</a>
                        );
                    }
                    if (action == 'dispatch') {
                        return (
                            <a key={action + '_' + cleanRuleCode} onClick={(e) => onClickDispatch(e, cleanRuleCode)}>分发</a>
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
    const onClickEdit = (e, cleanRuleCode) => {
        props.onClickEdit(cleanRuleCode);
    }
    const onClickDispatch = (e, cleanRuleCode) => {
        props.onClickDispatch(cleanRuleCode);
    }
    const onClickDelete = (e, cleanRuleCode) => {
        let url = genGetUrlBySegs('/ruleset/clean/{segment}/{segment}/delete', ['tenant_001', cleanRuleCode]);
        axios.delete(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                fetchListData();
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
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
                rowKey={record=>record.id} />
        </div>
    )
};

export default CleanRuleListBlock;

