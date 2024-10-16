import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const WarningRuleListBlock = (props) => {
    // 样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);

    // 初始化动作相关
    const fetchListData = () => {
        get('/ruleset/warning/search', {  
            tenantCode: getTenantCode(),
            warningRuleCode: props.warningRuleCode4Search,
            warningRuleName: props.warningRuleName4Search,
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
            title: applyLang('labelRuleCode'),
            dataIndex: 'warningRuleCode',
            key: 'warningRuleCode',
            width: '30%'
        },
        {
            title: applyLang('labelRuleName'),
            dataIndex: 'warningRuleName',
            key: 'warningRuleName',
            width: '30%'
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
            render: (_, { warningRuleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + warningRuleCode} onClick={(e) => onClickEdit(e, warningRuleCode)}>{applyLang('labelEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + warningRuleCode} onClick={(e) => onClickDelete(e, warningRuleCode)}>{applyLang('labelDel')}</a>
                        );
                    }
                    if (action == 'dispatch') {
                        return (
                            <a key={action + '_' + warningRuleCode} onClick={(e) => onClickDispatch(e, warningRuleCode)}>{applyLang('labelDispatch')}</a>
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
    const onClickEdit = (e, warningRuleCode) => {
        props.onClickEdit(warningRuleCode);
    }
    const onClickDispatch = (e, warningRuleCode) => {
        props.onClickDispatch(warningRuleCode);
    }
    const onClickDelete = (e, warningRuleCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/ruleset/warning/delete', {
            tenantCode: getTenantCode(),
            warningRuleCode: warningRuleCode
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
                rowKey={record=>record.warningRuleCode} />
        </div>
    )
};

export default WarningRuleListBlock;

