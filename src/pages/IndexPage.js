import React from 'react';
import { Col, Row } from 'antd';

import BreadcrumbBlock from "../components/BreadcrumbBlock"

import ColumnChart from '../components/ColumnChart'
import IndexTableBlock from '../components/IndexTableBlock'
import IndexListBlock from '../components/IndexListBlock'
import LineChart from '../components/LineChart'

export default function IndexPage() {
    const breadcrumbPath = ['控制台', '概况'];

    return (
        <>
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
        </>
    )
};
