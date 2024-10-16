import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankStr } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const AccuracyTplListBlock = (props) => {
    // 样式定义
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 数据定义
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);

    // 动作定义
    const fetchListData = () => {
        get('/drinkset/accuracy/search', {
            tenantCode: getTenantCode(),
            templateCode: props.templateCode4Search,
            templateName: props.templateName4Search,
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
                        ite.actions = ["edit", "delete"];
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

    // 表格定义
    const columns = [
        {
            title: applyLang('labelTemplateCode'),
            dataIndex: 'templateCode',
            key: 'templateCode',
            width: '30%'
        },
        {
            title: applyLang('labelTemplateName'),
            dataIndex: 'templateName',
            key: 'templateName',
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
            render: (_, { templateCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + templateCode} onClick={(e) => onClickEdit(e, templateCode)}>{applyLang('labelEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + templateCode} onClick={(e) => onClickDelete(e, templateCode)}>{applyLang('labelDel')}</a>
                        );
                    }
                })}
                </Space>
            ),
        },
    ];
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, specCode) => {
        props.onClickEdit(specCode);
    }
    const onClickDelete = (e, templateCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/drinkset/accuracy/delete', {
            tenantCode: getTenantCode(),
            templateCode: templateCode
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
                rowKey={record=>record.templateCode} />
        </div>
    )
};

export default AccuracyTplListBlock;

