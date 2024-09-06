import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { AuditOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isValidCode, isValidName } from '../../js/common.js';
import { get4Export } from '../../js/request4Export.js'

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import DeployListBlock from '../../components/device/DeployListBlock'
import DeployNewModal from '../../components/device/DeployNewModal'

const DeployPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '设备', '预部署管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setDeployCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [deployCode4Search, setDeployCode4Search] = useState('');
    const [shopName4Search, setShopName4Search] = useState('');
    const [state4Search, setState4Search] = useState('');
    var deployCode4SearchTmp = '';
    var shopName4SearchTmp = '';
    var state4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(deployCode4SearchTmp, false)) {
            alert('部署编码不符合规则');
            return;
        }
        if (!isValidCode(shopName4SearchTmp, false)) {
            alert('店铺名称不符合规则');
            return;
        }
        if (!isValidName(state4SearchTmp, false)) {
            alert('状态不符合规则');
            return;
        }

        setDeployCode4Search(deployCode4SearchTmp);
        setShopName4Search(shopName4SearchTmp);
        setState4Search(state4SearchTmp);
    }

    // 表格操作相关
    const [deployCode4Edit, setDeployCode4Edit] = useState('');
    const onClickEdit = (selectedDeployCode)=> {
        setDeployCode4Edit(selectedDeployCode);
        setOpenNewModal(true);
    }
    const onExportByExcel = ()=> {
        get4Export('/deviceset/deploy/export', {  
            tenantCode: getTenantCode()
        }).then(resp => {
            const url4Export = window.URL.createObjectURL(new Blob([resp]));
            const link4Export = document.createElement('a');
            link4Export.href = url4Export;
            link4Export.setAttribute('download', 'export.xlsx');
            document.body.appendChild(link4Export);
            link4Export.click();
            document.body.removeChild(link4Export);
        });
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#fff'}}>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>部署编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="部署编码" onChange={(e) => deployCode4SearchTmp = e.target.value}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>店铺名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="店铺名称" onChange={(e) => shopName4SearchTmp = e.target.value}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>部署状态：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="部署状态" onChange={(e) => state4SearchTmp = e.target.value}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建部署码</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#fff'}}>
                <Col className="gutter-row" span={21}>
                    &nbsp;
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<AuditOutlined />} onClick={onExportByExcel} style={{width: '90%'}}>导出</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <DeployListBlock key={refreshListKey} deployCode4Search={deployCode4Search} shopName4Search={shopName4Search} state4Search={state4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <DeployNewModal onClose={onCloseNewModal} deployCode4Edit={deployCode4Edit} />
            )}
        </>
    )
};

export default DeployPage;
