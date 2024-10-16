import React, { useEffect, useState } from 'react';
import { theme, Space, Table } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
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
            if (respData === undefined) {
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
            title: applyLang('labelMachineCode'),
            dataIndex: 'machineCode',
            key: 'machineCode',
            width: '15%'
        },
        {
            title: applyLang('labelMachineName'),
            dataIndex: 'machineName',
            key: 'machineName',
            width: '15%'
        },
        {
            title: applyLang('labelScreenCode'),
            dataIndex: 'screenCode',
            key: 'screenCode',
            width: '15%'
        },
        {
            title: applyLang('labelElecBoardCode'),
            dataIndex: 'elecBoardCode',
            key: 'elecBoardCode',
            width: '15%'
        },
        {
            title: applyLang('labelModelCode'),
            dataIndex: 'modelCode',
            key: 'modelCode',
            width: '10%'
        },
        {
            title: applyLang('labelShopName'),
            dataIndex: 'shopName',
            key: 'shopName',
            width: '10%'
        },
        {
            title: applyLang('labelMachineState'),
            dataIndex: 'state',
            key: 'state',
            width: '10%',
            render: (state) => state == 0 ? applyLang('labelDisabled') : applyLang('labelEnabled')
        },
        {
            title: applyLang('labelOpe'),
            key: 'actions',
            width: '10%',
            render: (_, { machineCode, actions }) => (
                <Space size="middle">
                {actions.map((action) => {
                    if (action === 'edit') {
                        return (
                            <a key={action + '_' + machineCode} onClick={(e) => onClickEdit(e, machineCode)}>{applyLang('labelOpeEdit')}</a>
                        );
                    }
                    if (action === 'delete') {
                        return (
                            <a key={action + '_' + machineCode} onClick={(e) => onClickDelete(e, machineCode)}>{applyLang('labelOpeDel')}</a>
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
        let confirmRtn = window.confirm(applyLang('msgDelRemind'));
        if (!confirmRtn) {
            return;
        }

        del('/deviceset/machine/delete', {
            tenantCode: getTenantCode(),
            machineCode: machineCode
        }).then(resp => {
            if (resp.success) {
                alert(applyLang('msgDelSucceed'));
                fetchListData();
            } else {
                alert(applyLang('msgDelFailed') + resp.errorMsg)
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

