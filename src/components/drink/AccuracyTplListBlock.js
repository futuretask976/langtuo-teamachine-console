import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, isBlankStr, getJwtToken, getRespModel, getTenantCode, handleRespError, isRespSuccess } from '../../js/common.js';

const AccuracyTplListBlock = (props) => {
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
        let url = genGetUrlByParams('/drinkset/accuracy/search', {
            tenantCode: getTenantCode(),
            templateCode: isBlankStr(props.templateCode4Search) ? '' : props.templateCode4Search,
            templateName: isBlankStr(props.templateName4Search) ? '' : props.templateName4Search,
            pageNum: pageNum,
            pageSize: pageSize
        });
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setPageNum(model.pageNum);
            setPageSize(model.pageSize);
            setTotal(model.total);
            setList((prev => {
                let tmp = [];
                model.list.forEach(function(ite) {
                    ite.key = ite.id;
                    ite.actions = ["edit", "delete"];
                    tmp.push(ite);
                });
                return tmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.templateCode4Search, props.templateName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '模板编码',
            dataIndex: 'templateCode',
            key: 'templateCode',
            width: '20%'
        },
        {
            title: '模板名称',
            dataIndex: 'templateName',
            key: 'templateName',
            width: '20%'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? '禁用' : '启用'
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '40%',
            render: (gmtCreated) => new Date(gmtCreated).toLocaleString()
        },
        {
            title: '操作',
            key: 'actions',
            width: '10%',
            render: (_, { templateCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a id={action + '_' + templateCode} onClick={(e) => onClickEdit(e, templateCode)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a id={action + '_' + templateCode} onClick={(e) => onClickDelete(e, templateCode)}>删除</a>
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
    const onClickEdit = (e, specCode) => {
        props.onClickEdit(specCode);
    }
    const onClickDelete = (e, specCode) => {
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/accuracy/{segment}/{segment}/delete', [getTenantCode(), specCode]);
        axios.delete(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                fetchListData();
            }
        })
        .catch(error => {
            handleRespError(error);
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
                rowKey={record=>record.templateCode} />
        </div>
    )
};

export default AccuracyTplListBlock;

