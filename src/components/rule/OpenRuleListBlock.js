import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getRespModel, getJwtToken, getTenantCode, handleRespError, isBlankArray, isRespSuccess } from '../../js/common.js';

const OpenRuleListBlock = (props) => {
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
        let url = genGetUrlByParams('/ruleset/open/search', {
            tenantCode: getTenantCode(),
            openRuleCode: props.openRuleCode4Search,
            openRuleName: props.openRuleName4Search,
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
                        ite.actions = ["edit", "delete"];
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
    }, [props.openRuleCode4Search, props.openRuleName4Search, pageNum]);

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'openRuleCode',
            key: 'openRuleCode'
        },
        {
            title: '规则名称',
            dataIndex: 'openRuleName',
            key: 'openRuleName',
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
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, { openRuleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + openRuleCode} onClick={(e) => onClickEdit(e, openRuleCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + openRuleCode} onClick={(e) => onClickDelete(e, openRuleCode)}>删除</a>
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
    const onClickEdit = (e, openRuleCode) => {
        props.onClickEdit(openRuleCode);
    }
    const onClickDelete = (e, openRuleCode) => {
        let url = genGetUrlBySegs('/ruleset/open/{segment}/{segment}/delete', ['tenant_001', openRuleCode]);
        axios.delete(url, {
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

export default OpenRuleListBlock;

