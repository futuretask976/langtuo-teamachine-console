import React from 'react';
import { DatePicker, Button, Input, Layout, Flex, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import FooterBar from '../components/FooterBar'
import SearchTableBlock from '../components/SearchTableBlock'

const { Content } = Layout;
const { RangePicker } = DatePicker;

const layoutStyle = {
    borderRadius: 5,
    overflow: 'hidden',
    width: 'calc(90% - 5px)',
    maxWidth: 'calc(90% - 5px)',
    justifyContent: 'center',
};

const SearchPage = () => {
    const selectedMenu = ['3'];
    const breadcrumbPath = ['主页', '搜索'];

    return (
        <Flex gap="middle" justify="center" wrap="wrap">
            <Layout style={layoutStyle}>
                <HeaderBar />
                <Layout style={{ borderRadius: 0, border: '0px solid blue' }}>
                    <SiderMenu selectedMenu={selectedMenu} />
                    <Layout>
                        <Content style={{ margin: '5px 5px', borderRadius: 0, border: '0px solid red' }}>
                            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>
                                <Col className="gutter-row" span={2}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%', justifyContent: 'flex-end'}}><span>地址：</span></div>
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%'}}><Input placeholder="地址" />&nbsp;&nbsp;</div>
                                </Col>
                                <Col className="gutter-row" span={2}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%', justifyContent: 'flex-end'}}><span>名称：</span></div>
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%'}}><Input placeholder="名称" />&nbsp;&nbsp;</div>
                                </Col>
                                <Col className="gutter-row" span={2}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%', justifyContent: 'flex-end'}}><span>关键字：</span></div>
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%'}}><Input placeholder="关键字" />&nbsp;&nbsp;</div>
                                </Col>
                                <Col className="gutter-row" span={2}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%', justifyContent: 'flex-end'}}><span>是否选中：</span></div>
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%'}}><Input placeholder="是否选中" />&nbsp;&nbsp;</div>
                                </Col>
                            </Row>
                            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>
                                <Col className="gutter-row" span={2}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%', justifyContent: 'flex-end'}}><span>性别：</span></div>
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%'}}><Input placeholder="性别" />&nbsp;&nbsp;</div>
                                </Col>
                                <Col className="gutter-row" span={2}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%', justifyContent: 'flex-end'}}><span>时间范围：</span></div>
                                </Col>
                                <Col className="gutter-row" span={4}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%'}}><RangePicker />&nbsp;&nbsp;</div>
                                </Col>
                            </Row>
                            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>
                                <Col className="gutter-row" span={24}>
                                    <div style={{alignItems: 'center', backgroundColor: '#fff', display: 'flex', height: '100%', justifyContent: 'flex-end'}}><Button type="primary" icon={<SearchOutlined />}>Search</Button>&nbsp;&nbsp;</div>
                                </Col>
                            </Row>
                            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                            <div>&nbsp;</div>
                            <SearchTableBlock />
                        </Content>
                    </Layout>
                </Layout>
                <FooterBar />
            </Layout>
        </Flex>
    )
};

export default SearchPage;
