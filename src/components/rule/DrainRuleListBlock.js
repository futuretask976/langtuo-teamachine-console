import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isEmptyArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

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

    // 初始化动作
    const fetchListData = () => {
        get('/ruleset/drain/search', {  
            tenantCode: getTenantCode(),
            drainRuleCode: props.drainRuleCode4Search,
            drainRuleName: props.drainRuleName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(respData => {
            if (respData === undefined) {
                return;
            }
            let model = respData.model;
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            if (!isEmptyArray(model.list)) {
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
        });
    }
    useEffect(() => {
        fetchListData();
    }, [pageNum]);

    let columns = [
        {
            title: applyLang('labelRuleCode'),
            dataIndex: 'drainRuleCode',
            key: 'drainRuleCode',
            width: '25%',
        },
        {
            title: applyLang('labelRuleName'),
            dataIndex: 'drainRuleName',
            key: 'drainRuleName',
            width: '25%',
        },
        {
            title: applyLang('labelDefaultRule'),
            dataIndex: 'defaultRule',
            key: 'defaultRule',
            width: '10%',
            render: (defaultRule) => defaultRule === 1 ? applyLang("labelYes") : applyLang("labelNo"),
        },
        {
            title: applyLang('labelGmtCreated'),
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '25%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '15%',
            render: (_, { drainRuleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + drainRuleCode} onClick={(e) => onClickEdit(e, drainRuleCode)}>{applyLang('labelEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + drainRuleCode} onClick={(e) => onClickDelete(e, drainRuleCode)}>{applyLang('labelDel')}</a>
                        );
                    }
                    if (action === 'dispatch') {
                        return (
                            <a key={action + '_' + drainRuleCode} onClick={(e) => onClickDispatch(e, drainRuleCode)}>{applyLang('labelDispatch')}</a>
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
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/ruleset/drain/delete', {
            tenantCode: getTenantCode(),
            drainRuleCode: drainRuleCode
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgDelSucceed'));
                fetchListData();
            } else {
                alert(applyLang('msgDelFailed') + respData.errorMsg)
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
                rowKey={record=>record.drainRuleCode} />
        </div>
    )
};

export default DrainRuleListBlock;

