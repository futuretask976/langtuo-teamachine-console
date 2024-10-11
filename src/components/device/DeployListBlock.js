import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const DeployListBlock = (props) => {
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
        get('/deviceset/deploy/search', {
            deployCode: props.deployCode4Search,
            machineCode: '',
            shopCode: props.shopCode4Search,
            state: props.state4Search,
            tenantCode: getTenantCode(),
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
                        if (ite.state == 0) {
                            ite.actions = ["edit", "delete"];
                        } else {
                            ite.actions = [];
                        }
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
            title: '部署码',
            dataIndex: 'deployCode',
            key: 'deployCode',
            width: '20%'
        },
        {
            title: '机器编码',
            dataIndex: 'machineCode',
            key: 'machineCode',
            width: '20%'
        },
        {
            title: '归属门店',
            dataIndex: 'shopName',
            key: 'shopName',
            width: '15%'
        },
        {
            title: '设备型号',
            dataIndex: 'modelCode',
            key: 'modelCode',
            width: '20%'
        },
        {
            title: '部署状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? '未部署' : '已部署'
        },
        {
            title: '操作',
            key: 'actions',
            width: '15%',
            render: (_, { deployCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + deployCode} onClick={(e) => onClickEdit(e, deployCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + deployCode} onClick={(e) => onClickDelete(e, deployCode)}>删除</a>
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
    const onClickEdit = (e, deployCode) => {
        props.onClickEdit(deployCode);
    }
    const onClickDelete = (e, deployCode) => {
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/deviceset/deploy/delete', {
            tenantCode: getTenantCode(),
            deployCode: deployCode
        }).then(respData => {
            if (respData.success) {
                alert('删除成功！');
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
                    onChange: (page) => onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record=>record.deployCode} />
        </div>
    )
};

export default DeployListBlock;

