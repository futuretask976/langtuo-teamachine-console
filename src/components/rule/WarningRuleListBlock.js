import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankArray, genGetUrlByParams, genGetUrlBySegs, getJwtToken, getRespModel, getTenantCode, handleRespError, isRespSuccess } from '../../js/common.js';

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
        let url = genGetUrlByParams('/ruleset/warning/search', {
            tenantCode: getTenantCode(),
            warningRuleCode: props.warningRuleCode4Search,
            warningRuleName: props.warningRuleName4Search,
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
    }, [props.warningRuleCode4Search, props.warningRuleName4Search, pageNum]);

    let columns = [
        {
            title: '规则编码',
            dataIndex: 'warningRuleCode',
            key: 'warningRuleCode'
        },
        {
            title: '规则名称',
            dataIndex: 'warningRuleName',
            key: 'warningRuleName',
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
            render: (_, { warningRuleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + warningRuleCode} onClick={(e) => onClickEdit(e, warningRuleCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + warningRuleCode} onClick={(e) => onClickDelete(e, warningRuleCode)}>删除</a>
                        );
                    }
                    if (action == 'dispatch') {
                        return (
                            <a key={action + '_' + warningRuleCode} onClick={(e) => onClickDispatch(e, warningRuleCode)}>分发</a>
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
        let url = genGetUrlBySegs('/ruleset/warning/{segment}/{segment}/delete', [getTenantCode(), warningRuleCode]);
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

export default WarningRuleListBlock;

