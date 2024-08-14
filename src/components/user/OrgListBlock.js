import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, getRespModel, handleRespError, isRespSuccess, getJwtToken, getTenantCode, isArray } from '../../js/common.js';

const OrgListBlock = (props) => {
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
        let url = genGetUrlByParams('/userset/org/search', {
            tenantCode: getTenantCode(),
            orgName: props.orgName4Search,
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
                if (isArray(model.list)) {
                    model.list.forEach(function(ite) {
                        ite.key = ite.orgName;
                        delete ite.children;
                        ite.actions = ["edit", "delete"];
                        tmp.push(ite);
                    });
                }
                return tmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchListData();
    }, [props.orgName4Search, pageNum]);

    // 表格展示数据相关
    const columns = [
        {
            title: '组织架构名称',
            dataIndex: 'orgName',
            key: 'orgName',
            width: '30%'
        },
        {
            title: '上级节点',
            dataIndex: 'parentOrgName',
            key: 'parentOrgName',
            width: '30%'
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
            render: (_, { orgName, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action == 'edit') {
                        return (
                            <a key={action + '_' + orgName} onClick={(e) => onClickEdit(e, orgName)}>编辑</a>
                        );
                    }
                    if (action == 'delete') {
                        return (
                            <a key={action + '_' + orgName} onClick={(e) => onClickDelete(e, orgName)}>删除</a>
                        );
                    }
                })}
                </Space>
            ),
        },
    ];

    // 表格操作数据相关
    const onClickEdit = (e, orgName) => {
        props.onClickEdit(orgName);
    }
    const onClickDelete = (e, orgName) => {
        let url = genGetUrlBySegs('/userset/org/{segment}/{segment}/delete', ['tenant_001', orgName]);
        axios.delete(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert('删除成功');
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
                    onChange: (page) => setPageNum(page),
                }}
                columns={columns} 
                dataSource={list}
                rowKey={record => record.orgName} />
        </div>
    )
};

export default OrgListBlock;

