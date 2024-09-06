import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TenantListBlock from '../../components/user/TenantListBlock'
import TenantNewModal from '../../components/user/TenantNewModal'

const TenantPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '用户', '商户管理'];
    
    // 新建型号对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onClickNew = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setTenantCode4Edit('');
        refreshList();
    }
    
    // 搜索相关
    const [tenantName4Search, setTenantName4Search] = useState('');
    const [contactPerson4Search, setContactPerson4Search] = useState('');
    var tenantName4SearchTmp = '';
    var contactPerson4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidName(tenantName4SearchTmp, false)) {
            alert('商户名称不符合规则');
            return;
        }
        if (!isValidName(contactPerson4SearchTmp, false)) {
            alert('联系人名称不符合规则');
            return;
        }

        setTenantName4Search(tenantName4SearchTmp);
        setContactPerson4Search(contactPerson4SearchTmp);
    }

    // 表格操作相关
    const [tenantCode4Edit, setTenantCode4Edit] = useState('');
    const onClickEdit = (selectedTenantCode)=> {
        setTenantCode4Edit(selectedTenantCode);
        setOpenNewModal(true);
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
                        <span>商户名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="商户名称" onChange={(e) => tenantName4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>联系人名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="联系人名称" onChange={(e) => contactPerson4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onClickNew} style={{width: '90%'}}>新建商户</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={6}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <TenantListBlock key={refreshListKey} tenantName4Search={tenantName4Search} contactPerson4Search={contactPerson4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <TenantNewModal onClose={onCloseNewModal} tenantCode4Edit={tenantCode4Edit} />
            )}
        </>
    )
};

export default TenantPage;
