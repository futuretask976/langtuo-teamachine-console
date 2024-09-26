import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TenantListBlock from '../../components/user/TenantListBlock'
import TenantNewModal from '../../components/user/TenantNewModal'

const TenantPage = () => {
    // 面包屑定义
    const breadcrumbPath = ['控制台', '用户', '商户管理'];
    
    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onClickNew = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setTenantCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }
    
    // 数据定义
    const [tenantName4Search, setTenantName4Search] = useState();
    const [contactPerson4Search, setContactPerson4Search] = useState();
    const [tenantCode4Edit, setTenantCode4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidName(tenantName4Search, false)) {
            alert('商户名称不符合规则');
            return;
        }
        if (!isValidName(contactPerson4Search, false)) {
            alert('联系人名称不符合规则');
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedTenantCode)=> {
        setTenantCode4Edit(selectedTenantCode);
        setOpenNewModal(true);
    }

    // 刷新定义
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <Space className="full-square" direction="vertical" size={15}>
                <div className='flex-row-cont' style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 40}}>
                    <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                </div>
                <div className='flex-col-cont full-width' style={{alignItems: 'center', background: '#FFFFFF', height: 50}}>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>商户名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="商户名称" allowClear onChange={(e) => setTenantName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>联系人名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="联系人名称" allowClear onChange={(e) => setContactPerson4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onClickNew} style={{width: '90%'}}>新建商户</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <TenantListBlock key={refreshListKey} tenantName4Search={tenantName4Search} contactPerson4Search={contactPerson4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>            

            {openNewModal && (
                <TenantNewModal onClose={onCloseNewModal} tenantCode4Edit={tenantCode4Edit} />
            )}
        </>
    )
};

export default TenantPage;
