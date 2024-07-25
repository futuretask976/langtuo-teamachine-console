import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, isBlankArray } from '../../js/common.js';

const CloseRuleListBlock = (props) => {
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
        let url = genGetUrlByParams('/ruleset/close/search', {
            tenantCode: 'tenant_001',
            closeRuleCode: props.closeRuleCode4Search,
            closeRuleName: props.closeRuleName4Search,
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
                if (!isBlankArray(response.data.model.list)) {
                    setList((prev => {
                        let tmp = [];
                        response.data.model.list.forEach(function(ite) {
                            ite.key = ite.id;
                            ite.actions = ["edit", "delete"];
                            tmp.push(ite);
                        });
                        return tmp;
                    }));
                }
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
    }, [props.closeRuleCode4Search, props.closeRuleName4Search, pageNum]);

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'closeRuleCode',
            key: 'closeRuleCode',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '规则名称',
            dataIndex: 'closeRuleName',
            key: 'closeRuleName',
        },
        {
            title: '默认规则',
            dataIndex: 'defaultRule',
            key: 'defaultRule',
            render: (defaultRule) => defaultRule == 1 ? '是' : '不是',
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, { closeRuleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + closeRuleCode} onClick={(e) => onClickEdit(e, closeRuleCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + closeRuleCode} onClick={(e) => onClickDelete(e, closeRuleCode)}>删除</a>
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
    const onClickEdit = (e, closeRuleCode) => {
        props.onClickEdit(closeRuleCode);
    }
    const onClickDelete = (e, closeRuleCode) => {
        let url = genGetUrlBySegs('/ruleset/close/{segment}/{segment}/delete', ['tenant_001', closeRuleCode]);
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

export default CloseRuleListBlock;

