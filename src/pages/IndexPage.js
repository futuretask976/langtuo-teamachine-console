import React from 'react';
import { Flex, Layout, Col, Row } from 'antd';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import FooterBar from '../components/FooterBar'

import ColumnChart from '../components/ColumnChart'
import IndexTableBlock from '../components/IndexTableBlock'
import IndexListBlock from '../components/IndexListBlock'
import LineChart from '../components/LineChart'

const { Content } = Layout;

const layoutStyle = {
    overflow: 'hidden',
    width: 'calc(100% - 5px)',
    maxWidth: 'calc(100% - 5px)',
    justifyContent: 'center',
    border: '0px solid blue'
};

export default function IndexPage() {
    const selectedMenu = ['1'];
    const breadcrumbPath = ['控制台', '概况'];

    return (
        <Flex gap="middle" justify="center" wrap="wrap">
            <Layout style={layoutStyle}>
                <HeaderBar />
                <Layout style={{ border: '0px solid red' }}>
                    <SiderMenu selectedMenu={selectedMenu} />
                    <Layout style={{ border: '0px solid yellow' }}>
                        <Content style={{ width: '100%', paddingLeft: 5, paddingRight: 5 }}>
                            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                            <LineChart />
                            &nbsp;
                            <ColumnChart />
                            &nbsp;
                            <Row gutter={[16, 24]}>
                                <Col className="gutter-row" span={8}>
                                    <IndexListBlock />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <IndexListBlock />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <IndexListBlock />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <IndexListBlock />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <IndexListBlock />
                                </Col>
                                <Col className="gutter-row" span={8}>
                                    <IndexListBlock />
                                </Col>
                            </Row>
                            <div>&nbsp;</div>
                            <IndexTableBlock />
                        </Content>
                    </Layout>
                </Layout>
                <FooterBar />
            </Layout>
        </Flex>
    )
};
