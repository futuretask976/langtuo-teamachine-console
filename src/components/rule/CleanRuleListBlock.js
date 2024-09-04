import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode } from '../../js/common.js';
import { get, del } from '../../js/request.js';

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
        get('/ruleset/clean/search', {  
            tenantCode: getTenantCode(),
            cleanRuleCode: props.cleanRuleCode4Search,
            cleanRuleName: props.cleanRuleName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(resp => {
            let model = resp.model;
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
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.cleanRuleCode4Search, props.cleanRuleName4Search, pageNum]);

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'cleanRuleCode',
            key: 'cleanRuleCode'
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
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
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
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/ruleset/clean/delete', {
            tenantCode: getTenantCode(),
            cleanRuleCode: cleanRuleCode
        }).then(resp => {
            if (resp.success) {
                alert('删除成功');
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
                rowKey={record=>record.id} />
        </div>
    )
};

export default CleanRuleListBlock;

