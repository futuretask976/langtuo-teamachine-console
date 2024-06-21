import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

const MachineModelListBlock = (props) => {
    // 对话框样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const fetchData = () => {
        let url = 'http://localhost:8080/teamachine/machine/model/search?modelCode=' + props.modelCode + '&pageNum=' + pageNum + '&pageSize=' + pageSize;
        console.log('$$$$$ MachineModelListBlock#let url=' + url);
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
        fetchData();
    }, [props.modelCode, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '型号名称',
            dataIndex: 'modelCode',
            key: 'modelCode',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '是否支持同时出料',
            dataIndex: 'enableFlowAll',
            key: 'enableFlowAll',
        },
        {
            title: '操作',
            key: 'actions',
            render: (_, { modelCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action}>删除</a>
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
    const onEditRecord = (modelCode) => {
        alert("$$$$$ MachineModelListBlock#onEditRecord modelCode=" + modelCode)
    }
    const onDeleteRecord = (modelCode) => {
        alert("$$$$$ MachineModelListBlock#onDeleteRecord modelCode=" + modelCode)
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

export default MachineModelListBlock;

