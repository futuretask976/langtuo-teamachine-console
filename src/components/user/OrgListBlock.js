import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray, isBlankObj } from '../../js/common.js';
import { get, del } from '../../js/request.js';

import OrgTree from './OrgTree'

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

    // 初始化动作相关
    const fetchListData = () => {
        get('/userset/org/search', {  
            tenantCode: getTenantCode(),
            orgName: props.orgName4Search,
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
                        ite.key = ite.orgName;
                        delete ite.children;
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
        fetchListByDepth();
    }, [pageNum]);

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
                    if (orgName == '总公司') {
                        return;
                    } else {
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
        let confirmRtn = window.confirm("删除是不可恢复的，确认要删除吗？");
        if (!confirmRtn) {
            return;
        }

        del('/userset/org/delete', {
            tenantCode: getTenantCode(),
            orgName: orgName
        }).then(respData => {
            if (respData.success) {
                alert('删除成功');
                fetchListData();
                fetchListByDepth();
            } else {
                alert('删除失败：' + respData.errorMsg)
            }
        });
    }

    // 数据初始化相关
    const [orgStrucTree, setOrgStrucTree] = useState();
    const fetchListByDepth = () => {
        get('/userset/org/listbydepth', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData == undefined) {
                return;
            }
            let model = respData.model;
            setOrgStrucTree(prev => {
                let orgStrucTreeTmp = [];
                orgStrucTreeTmp.push(convertOrgNode(model));
                return orgStrucTreeTmp;
            })
        });
    }
    useEffect(() => {
        fetchListByDepth();
    }, []);

    const convertOrgNode = (orgNode) => {
        let childrenTmp = [];
        if (!isBlankObj(orgNode) && isArray(orgNode.children)) {
            orgNode.children.forEach(item => {
                childrenTmp.push(convertOrgNode(item));
            })
        }

        let treeNode = {
            key: orgNode.orgName,
            parentKey: orgNode.parentOrgName,
            isEditable: false,
            children: childrenTmp
        };
        return treeNode;
    }

    return (
        <div className="flex-row-cont" style={{height: '100%', width: '100%'}}>
            <div className="flex-col-cont full-height" style={{alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#FFFFFF', width: '24.5%'}}>
                <OrgTree orgStrucTree={orgStrucTree} />
            </div>
            <div style={{width: '0.5%'}}>&nbsp;</div>
            <div className="full-height" style={{ background: colorBgContainer, width: '75%'}}>
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
        </div>
        
    )
};

export default OrgListBlock;

