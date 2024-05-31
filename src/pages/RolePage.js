import React from 'react';
import { Button, Input, Layout, Flex, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import RoleListBlock from '../components/RoleListBlock'
import FooterBar from '../components/FooterBar'


const { Content } = Layout;

const layoutStyle = {
    height: 1000,
    overflow: 'hidden',
    width: 'calc(100% - 5px)',
    maxWidth: 'calc(100% - 5px)',
    border: '0px solid red',
};

const RolePage = () => {
    const selectedMenu = ['5'];
    const breadcrumbPath = ['控制台', '用户', '角色'];

    return (
        <Flex gap="middle" justify="center" wrap="wrap">
            <Layout style={layoutStyle}>
                <HeaderBar />
                <Layout>
                    <SiderMenu selectedMenu={selectedMenu} />
                    <Layout>
                        <Content style={{ margin: '0px 5px 0px 5px' }}>
                            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
                            <Row style={{backgroundColor: '#fff'}}>
                                <Col className="gutter-row" span={2}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                        <span>角色名称：</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                        <Input placeholder="角色名称" />&nbsp;&nbsp;
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                        <Button type="primary" icon={<SearchOutlined />}>开始搜索</Button>&nbsp;&nbsp;
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                        <Button type="primary" icon={<FormOutlined />}>新建角色</Button>&nbsp;&nbsp;
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    &nbsp;
                                </Col>
                            </Row>
                            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                            <div>&nbsp;</div>
                            <RoleListBlock />
                        </Content>
                    </Layout>
                </Layout>
                <FooterBar />
            </Layout>
        </Flex>
    )
};

export default RolePage;
