import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const RoleListBlock = (props) => {
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
    const fetchListData = async () => {
        get('/userset/role/search', {  
            tenantCode: getTenantCode(),
            roleName: props.roleName4Search,
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
            title: applyLang('labelRoleCode'),
            dataIndex: 'roleCode',
            key: 'roleCode',
            width: '25%'
        },
        {
            title: applyLang('labelRoleName'),
            dataIndex: 'roleName',
            key: 'roleName',
            width: '20%'
        },
        {
            title: applyLang('labelAdminCnt'),
            dataIndex: 'adminCount',
            key: 'adminCount',
            width: '10%'
        },
        {
            title: applyLang('labelSysReversed'),
            dataIndex: 'sysReserved',
            key: 'sysReserved',
            width: '10%',
            render: (sysReserved) => 1 == sysReserved ? applyLang('labelYes') : applyLang('labelNo')
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
            render: (_, { roleCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + roleCode} onClick={(e) => onClickEdit(e, roleCode)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + roleCode} onClick={(e) => onClickDelete(e, roleCode)}>{applyLang('labelOpeDel')}</a>
                        );
                    }
                })}
                </Space>
            ),
        },
    ];
    const onClickEdit = (e, roleCode) => {
        props.onClickEdit(roleCode);
    }
    const onClickDelete = (e, roleCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/userset/role/delete', {
            tenantCode: getTenantCode(),
            roleCode: roleCode
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
                rowKey={record => record.roleCode} />
        </div>
    )
};

export default RoleListBlock;

