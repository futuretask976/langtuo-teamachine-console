import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
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

    // 初始化动作
    const fetchListData = () => {
        get('/ruleset/clean/search', {  
            tenantCode: getTenantCode(),
            cleanRuleCode: props.cleanRuleCode4Search,
            cleanRuleName: props.cleanRuleName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(respData => {
            if (respData == undefined) {
                return;
            }
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

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'cleanRuleCode',
            key: 'cleanRuleCode',
            width: '25%'
        },
        {
            title: '规则名称',
            dataIndex: 'cleanRuleName',
            key: 'cleanRuleName',
            width: '25%'
        },
        {
            title: '提前提醒',
            dataIndex: 'permitRemind',
            key: 'permitRemind',
            width: '10%',
            render: (permitRemind) => permitRemind == 1 ? '启用' : '禁用',
        },
        {
            title: '允许批量',
            dataIndex: 'permitBatch',
            key: 'permitBatch',
            width: '10%',
            render: (permitBatch) => permitBatch == 1 ? '启用' : '禁用',
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '15%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '15%',
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
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/ruleset/clean/delete', {
            tenantCode: getTenantCode(),
            cleanRuleCode: cleanRuleCode
        }).then(resp => {
            if (resp.success) {
                alert(applyLang('msgDelSucceed'));
                fetchListData();
            } else {
                alert(applyLang('msgDelFailed') + resp.errorMsg)
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
                rowKey={record=>record.cleanRuleCode} />
        </div>
    )
};

export default CleanRuleListBlock;

