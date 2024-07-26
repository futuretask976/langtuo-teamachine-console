import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams } from '../../js/common.js';

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
        let url = genGetUrlByParams('/deviceset/machine/search', {
            screenCode: props.screenCode4Search,
            elecBoardCode: props.elecBoardCode4Search,
            modelCode: props.modelCode4Search,
            shopName: props.shopName4Search,
            pageNum: pageNum,
            pageSize: pageSize,
            tenantCode: 'tenant_001'
        });
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setPageNum(response.data.model.pageNum);
                setPageSize(response.data.model.pageSize);
                setTotal(response.data.model.total);
                setList((prev => {
                    return response.data.model.list
                }));
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.screenCode4Search, props.elecBoardCode4Search, props.modelCode4Search, props.shopName4Search, pageNum]);

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
    const onClickDelete = (e, deployCode) => {
        let url = 'http://localhost:8080/teamachine/deviceset/machine/tenant_001/' + deployCode + '/delete';
        axios.delete(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                fetchListData();
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
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

