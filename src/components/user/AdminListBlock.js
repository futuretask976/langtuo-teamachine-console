import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const AdminListBlock = (props) => {
    // 样式定义
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 数据定义
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState();

    // 动作定义
    const fetchListData = () => {
        get('/userset/admin/search', {  
            tenantCode: getTenantCode(),
            loginName: props.loginName4Search,
            roleCode: props.roleCode4Search,
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
                    model.list.forEach(ite => {
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
            title: applyLang('labelLoginName'),
            dataIndex: 'loginName',
            key: 'loginName',
            width: '25%'
        },
        {
            title: applyLang('labelRoleName'),
            dataIndex: 'roleName',
            key: 'roleName',
            width: '20%'
        },
        {
            title: applyLang('labelOrgName'),
            dataIndex: 'orgName',
            key: 'orgName',
            width: '20%'
        },
        {
            title: applyLang('labelGmtCreated'),
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '20%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '15%',
            render: (_, { loginName, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + loginName} onClick={(e) => onClickEdit(e, loginName)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + loginName} onClick={(e) => onClickDelete(e, loginName)}>{applyLang('labelOpeDel')}</a>
                        );
                    }
                })}
                </Space>
            ),
        },
    ];
    const onClickEdit = (e, loginName) => {
        props.onClickEdit(loginName);
    }
    const onClickDelete = (e, loginName) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/deviceset/machine/delete', {
            tenantCode: getTenantCode(),
            loginName: loginName
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
                    onChange: (page) => setPageNum(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record => record.loginName} />
        </div>
    )
};

export default AdminListBlock;

