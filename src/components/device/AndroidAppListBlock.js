import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const AndroidAppListBlock = (props) => {
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
        get('/deviceset/android/app/search', {
            version: props.version4Search,
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

    // 表格定义
    const columns = [
        {
            title: applyLang('labelVersion'),
            dataIndex: 'version',
            key: 'version',
            width: '20%'
        },
        {
            title: applyLang('labelOssPath'),
            dataIndex: 'ossPath',
            key: 'ossPath',
            width: '40%'
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
            width: '20%',
            render: (_, { version, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + version} onClick={(e) => onClickEdit(e, version)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + version} onClick={(e) => onClickDelete(e, version)}>{applyLang('labelOpeDel')}</a>
                        );
                    }
                    if (action == 'dispatch') {
                        return (
                            <a key={action + '_' + version} onClick={(e) => onClickDispatch(e, version)}>{applyLang('labelOpeDispatch')}</a>
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
    const onClickEdit = (e, version) => {
        props.onClickEdit(version);
    }
    const onClickDelete = (e, version) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/deviceset/android/app/delete', {
            tenantCode: getTenantCode(),
            version: version
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgDelSucceed'));
                fetchListData();
            } else {
                alert(applyLang('msgDelFailed') + respData.errorMsg)
            }
        });
    }
    const onClickDispatch = (e, menuCode) => {
        props.onClickDispatch(menuCode);
    }

    return (
        <div style={{ background: colorBgContainer, height: '100%' }}>
            <Table
                pagination={{
                    pageNum,
                    total,
                    pageSize,
                    onChange: (page) => onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record=>record.version} />
        </div>
    )
};

export default AndroidAppListBlock;

