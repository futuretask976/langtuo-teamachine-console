import React, { useEffect, useState } from 'react';
import { Button, Flex, Input, Layout, Modal, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import TenantListBlock from '../components/TenantListBlock'
import TenantNewModal from '../components/TenantNewModal'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;
const { TextArea } = Input;

const TenantPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['userSub'];
    const selectedMenu = ['3'];
    const breadcrumbPath = ['控制台', '用户', '商户管理'];

    // 页面样式相关
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };
    
    // 新建型号对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onClickNew = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setTenantCode4Edit('');
    }
    
    // 搜索相关
    var tenantNameTmp = '';
    const [tenantName4Search, setTenantName4Search] = useState('');
    const onChangeTenantName4Search = (e) => {
        tenantNameTmp = e.target.value;
    }
    var contactPersonTmp = '';
    const [contactPerson4Search, setContactPerson4Search] = useState('');
    const onChangeContactPerson4Search = (e) => {
        contactPersonTmp = e.target.value;
    }
    const onSearch = () => {
        setTenantName4Search(tenantNameTmp);
        setContactPerson4Search(contactPersonTmp);
    }

    // 表格操作相关
    const [tenantCode4Edit, setTenantCode4Edit] = useState('');
    const onClickEdit = (selectedTenantCode)=> {
        setTenantCode4Edit(selectedTenantCode);
        setOpenNewModal(true);
    }

    return (
        <>
            <Flex gap="middle" justify="center" wrap="wrap">
                <Layout style={layoutStyle}>
                    <HeaderBar />
                    <Layout>
                        <SiderMenu openMenu={openMenu} selectedMenu={selectedMenu} />
                        <Layout>
                            <Content style={{ margin: '0px 5px 0px 5px' }}>
                                <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                                <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
                                <Row style={{backgroundColor: '#fff'}}>
                                    <Col className="gutter-row" span={2}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>商户名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="商户名称" onChange={onChangeTenantName4Search} />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>联系人名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="联系人名称" onChange={onChangeContactPerson4Search} />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onClickNew}>新建商户</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <TenantListBlock tenantName4Search={tenantName4Search} contactPerson4Search={contactPerson4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <TenantNewModal onClose={onCloseNewModal} tenantCode4Edit={tenantCode4Edit} />
            )}
        </>
    )
};

export default TenantPage;
