import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const MachineListBlock = (props) => {
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
        get('/deviceset/machine/search', {
            machineCode: props.machineCode4Search,
            screenCode: props.screenCode4Search,
            elecBoardCode: props.elecBoardCode4Search,
            shopCode: props.shopCode4Search,
            pageNum: pageNum,
            pageSize: pageSize,
            tenantCode: getTenantCode()
        }).then(resp => {
            let model = resp.model;
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            setList((prev => {
                return model.list
            }));
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.machineCode4Search, props.screenCode4Search, props.elecBoardCode4Search, props.shopCode4Search, pageNum]);

    // 表格展示数据相关
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
                            <a id={action + '_' + machineCode} onClick={(e) => onClickEdit(e, machineCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + machineCode} onClick={(e) => onClickDelete(e, machineCode)}>删除</a>
                        );
                    }
                })}
                </Space>
            ),
        }
    ];
    let data = list;
    data.forEach(function(ite) {
        ite.key = ite.modelCode;
        ite.actions = ["edit", "delete"];
    });

    // 表格操作数据相关
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
                dataSource={data}
                rowKey={record=>record.id} />
        </div>
    )
};

export default MachineListBlock;

