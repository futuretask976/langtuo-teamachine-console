import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OrgListBlock from '../../components/user/OrgListBlock'
import OrgNewModal from '../../components/user/OrgNewModal'

const { Content } = Layout;

const OrgPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['userSet'];
    const selectedMenu = ['orgMgt'];
    const breadcrumbPath = ['控制台', '用户', '组织架构管理'];

    // 页面样式相关
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onClickNew = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setOrgName4Edit('');
        refreshList();
    }
    const [openViewModal, setOpenViewModal] = useState(false);
    const onCloseViewModal = () => {
        setOpenViewModal(false);
    }

    // 搜索相关
    const [orgName4Search, setOrgName4Search] = useState('');
    let orgName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidName(orgName4SearchTmp, false)) {
            alert('组织名称不符合规则');
            return;
        }

        setOrgName4Search(orgName4SearchTmp);
    }

    // 表格操作相关
    const [orgName4Edit, setOrgName4Edit] = useState('');
    const onClickEdit = (selectedOrgName)=> {
        setOrgName4Edit(selectedOrgName);
        setOpenNewModal(true);
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

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
                                            <span>组织名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="组织名称" onChange={(e) => orgName4SearchTmp = e.target.value} style={{width: '95%'}} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onClickNew} style={{width: '90%'}}>新增架构</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={9}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <OrgListBlock key={refreshListKey} orgName4Search={orgName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <OrgNewModal orgName4Edit={orgName4Edit} onClose={onCloseNewModal} />
            )}
        </>
    )
};

export default OrgPage;
