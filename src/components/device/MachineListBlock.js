import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const MachineListBlock = (props) => {
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
        get('/deviceset/machine/search', {
            machineCode: props.machineCode4Search,
            screenCode: props.screenCode4Search,
            elecBoardCode: props.elecBoardCode4Search,
            shopCode: props.shopCode4Search,
            pageNum: pageNum,
            pageSize: pageSize,
            tenantCode: getTenantCode()
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
                        ite.actions = ["edit"];
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
            title: '机器编码',
            dataIndex: 'machineCode',
            key: 'machineCode',
            width: '15%'
        },
        {
            title: '机器名称',
            dataIndex: 'machineName',
            key: 'machineName',
            width: '15%'
        },
        {
            title: '屏幕编码',
            dataIndex: 'screenCode',
            key: 'screenCode',
            width: '15%'
        },
        {
            title: '电控板编码',
            dataIndex: 'elecBoardCode',
            key: 'elecBoardCode',
            width: '15%'
        },
        {
            title: '设备型号',
            dataIndex: 'modelCode',
            key: 'modelCode',
            width: '10%'
        },
        {
            title: '店铺名称',
            dataIndex: 'shopName',
            key: 'shopName',
            width: '10%'
        },
        {
            title: '设备状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? '禁用' : '启用'
        },
        {
            title: '操作',
            key: 'actions',
            width: '10%',
            render: (_, { machineCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + machineCode} onClick={(e) => onClickEdit(e, machineCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + machineCode} onClick={(e) => onClickDelete(e, machineCode)}>删除</a>
                        );
                    }
                })}
                </Space>
            ),
        }
    ];
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, deployCode) => {
        props.onClickEdit(deployCode);
    }
    const onClickDelete = (e, machineCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/deviceset/machine/delete', {
            tenantCode: getTenantCode(),
            machineCode: machineCode
        }).then(resp => {
            if (resp.success) {
                alert('删除成功');
                fetchListData();
            } else {
                alert('删除失败：' + resp.errorMsg)
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
                rowKey={record=>record.machineCode} />
        </div>
    )
};

export default MachineListBlock;

