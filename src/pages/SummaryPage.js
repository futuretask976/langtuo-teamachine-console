import React from 'react';
import { Col, Row } from 'antd';

import BreadcrumbBlock from "../components/BreadcrumbBlock"

import ColumnChart from '../components/ColumnChart'
import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'

export default function SummaryPage() {
    const breadcrumbPath = ['控制台', '概况'];

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#FFFFFF', height: 250, width: '100%', border: '1px solid green'}}>
                <Col className="gutter-row" span={12}>
                    <div style={{height: '100%', width: '100%', border: '1px solid pink'}}>
                        <PieChart />
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    <div style={{height: '100%', width: '100%', border: '1px solid pink'}}>
                        <ColumnChart />
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#FFFFFF', height: 250, width: '100%', border: '1px solid green'}}>
                <Col className="gutter-row" span={24}>
                    <div style={{height: '100%', width: '100%', border: '1px solid pink'}}>
                        <LineChart />
                    </div>
                </Col>
            </Row>
        </>
    )
};
