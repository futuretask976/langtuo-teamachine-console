import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const DeployListBlock = (props) => {
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
        get('/deviceset/deploy/search', {
            deployCode: props.deployCode4Search,
            machineCode: '',
            shopCode: props.shopCode4Search,
            state: props.state4Search,
            tenantCode: getTenantCode(),
            pageNum: pageNum,
            pageSize: pageSize
        }).then(respData => {
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
    }, [props.deployCode4Search, props.shopCode4Search, props.state4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '部署码',
            dataIndex: 'deployCode',
            key: 'deployCode',
            width: '25%'
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
            width: '15%'
        },
        {
            title: '部署状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? '未部署' : '已部署'
        },
        {
            title: '生成时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '15%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '20%',
            render: (_, { deployCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + deployCode} onClick={(e) => onClickEdit(e, deployCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + deployCode} onClick={(e) => onClickDelete(e, deployCode)}>删除</a>
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
    const onClickEdit = (e, deployCode) => {
        props.onClickEdit(deployCode);
    }
    const onClickDelete = (e, deployCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/deviceset/deploy/delete', {
            tenantCode: getTenantCode(),
            deployCode: deployCode
        }).then(respData => {
            if (respData.success) {
                alert('删除成功');
                fetchListData();
            } else {
                alert('删除失败：' + respData.errorMsg)
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
                rowKey={record=>record.id} />
        </div>
    )
};

export default DeployListBlock;

