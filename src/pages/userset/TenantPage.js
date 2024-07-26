import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Modal, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TenantListBlock from '../../components/userset/TenantListBlock'
import TenantNewModal from '../../components/userset/TenantNewModal'

const { Content } = Layout;

const TenantPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['userSet'];
    const selectedMenu = ['tenantMgt'];
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
    var tenantName4SearchTmp = '';
    const [tenantName4Search, setTenantName4Search] = useState('');
    const onChangeTenantName4Search = (e) => {
        tenantName4SearchTmp = e.target.value;
    }
    var contactPerson4SearchTmp = '';
    const [contactPerson4Search, setContactPerson4Search] = useState('');
    const onChangeContactPerson4Search = (e) => {
        contactPerson4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setTenantName4Search(tenantName4SearchTmp);
        setContactPerson4Search(contactPerson4SearchTmp);
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
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>商户名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="商户名称" onChange={onChangeTenantName4Search} style={{width: '95%'}} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>联系人名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="联系人名称" onChange={onChangeContactPerson4Search} style={{width: '95%'}} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onClickNew} style={{width: '80%'}}>新建商户</Button>
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
