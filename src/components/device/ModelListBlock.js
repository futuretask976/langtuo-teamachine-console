import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { isArray } from '../../js/common.js';
import { get, del } from '../../js/request.js';

const ModelListBlock = (props) => {
    // 样式相关
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 获取服务端数据相关
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);

    // 初始化动作
    const fetchListData = () => {
        get('/deviceset/model/search', {
            modelCode: props.modelCode4Search,
            pageNum: pageNum,
            pageSize: pageSize
        }).then(respData => {
            let model = respData.model;
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            setList((prev => {
                let tmp = [];
                if (isArray(respData.model.list)) {
                    respData.model.list.forEach(function(ite) {
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

    // 表格展示数据相关
    const columns = [
        {
            title: '型号名称',
            dataIndex: 'modelCode',
            key: 'modelCode',
            width: '35%'
        },
        {
            title: '是否支持同时出料',
            dataIndex: 'enableFlowAll',
            key: 'enableFlowAll',
            width: '25%',
            render: (enableFlowAll) => enableFlowAll == 1 ? '支持' : '不支持'
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '25%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '15%',
            render: (_, { modelCode, actions }) => (
                <Space size="middle">
                    {actions.map((action) => {
                        if (action == 'edit') {
                            return (
                                <a key={action + '_' + modelCode} onClick={(e) => onClickEdit(e, modelCode)}>编辑</a>
                            );
                        }
                        if (action == 'delete') {
                            return (
                                <a key={action + '_' + modelCode} onClick={(e) => onClickDelete(e, modelCode)}>删除</a>
                            );
                        }
                    })}
                </Space>
            )
        }
    ];

    // 表格操作数据相关
    const onChangePage = (page) => {
        setPageNum(page);
    }
    const onClickEdit = (e, modelCode) => {
        props.onClickEdit(modelCode);
    }
    const onClickDelete = (e, modelCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/deviceset/model/delete', {
            modelCode: modelCode
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
                    onChange: (page)=>onChangePage(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record=>record.modelCode} />
        </div>
    )
};

export default ModelListBlock;

