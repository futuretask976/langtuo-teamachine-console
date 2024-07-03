import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

const MachineDeployListBlock = (props) => {
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
        let url = 'http://localhost:8080/teamachine/machine/deploy/search?tenantCode=tenant_001&deployCode=' + props.deployCode4Search + '&shopName=' + props.shopName4Search + '&state=' + props.state4Search + '&pageNum=' + pageNum + '&pageSize=' + pageSize;
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
    }, [props.deployCode4Search, props.shopName4Search, props.state4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '部署码',
            dataIndex: 'modelCode',
            key: 'modelCode',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '归属门店',
            dataIndex: 'shopName',
            key: 'shopName',
        },
        {
            title: '设备型号',
            dataIndex: 'modelCode',
            key: 'modelCode',
        },
        {
            title: '部署状态',
            dataIndex: 'state',
            key: 'state',
            render: (state) => state == 0 ? '未部署' : '已部署'
        },
        {
            title: '生成时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
        },
        {
            title: '操作',
            key: 'actions',
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
        let url = 'http://localhost:8080/teamachine/machine/deploy/tenant_001/' + deployCode + '/delete';
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

export default MachineDeployListBlock;

