import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getRespModel, getJwtToken, getTenantCode, handleRespError, isBlankArray, isRespSuccess } from '../../js/common.js';

const DrainRuleListBlock = (props) => {
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
        let url = genGetUrlByParams('/ruleset/drain/search', {
            tenantCode: getTenantCode(),
            drainRuleCode: props.drainRuleCode4Search,
            drainRuleName: props.drainRuleName4Search,
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
                        ite.actions = ["edit", "delete", "dispatch"];
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
    }, [props.drainRuleCode4Search, props.drainRuleName4Search, pageNum]);

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'drainRuleCode',
            key: 'drainRuleCode'
        },
        {
            title: '规则名称',
            dataIndex: 'drainRuleName',
            key: 'drainRuleName',
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
            render: (_, { drainRuleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + drainRuleCode} onClick={(e) => onClickEdit(e, drainRuleCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + drainRuleCode} onClick={(e) => onClickDelete(e, drainRuleCode)}>删除</a>
                        );
                    }
                    if (action == 'dispatch') {
                        return (
                            <a key={action + '_' + drainRuleCode} onClick={(e) => onClickDispatch(e, drainRuleCode)}>分发</a>
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
    const onClickEdit = (e, drainRuleCode) => {
        props.onClickEdit(drainRuleCode);
    }
    const onClickDispatch = (e, drainRuleCode) => {
        props.onClickDispatch(drainRuleCode);
    }
    const onClickDelete = (e, drainRuleCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        let url = genGetUrlBySegs('/ruleset/drain/{segment}/{segment}/delete', [getTenantCode(), drainRuleCode]);
        axios.delete(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert('删除成功');
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

export default DrainRuleListBlock;

