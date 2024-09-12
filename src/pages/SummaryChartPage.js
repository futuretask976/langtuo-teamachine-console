import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';

import { isArray, getTenantCode } from '../js/common.js';
import { get } from '../js/request.js';

import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ShopMachineColumnChart from '../components/ShopMachineColumnChart'
import OrderAmtLineChart from '../components/OrderAmtLineChart'
import DeployPieChart from '../components/DeployPieChart'
import OrgShopBarChart from '../components/OrgShopBarChart'
import TeaAmtByDayLineChart from '../components/TeaAmtByDayLineChart'

export default function SummaryChartPage() {
    const breadcrumbPath = ['控制台', '概况'];

    // 数据定义
    const [teaAmtData, setTeaAmtData] = useState([]);
    const [specItemAmtData, setspecItemAmtData] = useState([]);
    const [toppingAmtData, settoppingAmtData] = useState([]);

    // 初始化动作
    const fetchTeaAmtData = () => {
        get('/summarychart/teaamt', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setTeaAmtData(model);
        });
    }
    const fetchSpecItemAmtData = () => {
        get('/summarychart/specitemamt', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setspecItemAmtData(model);
        });
    }
    const fetchToppingAmtData = () => {
        get('/summarychart/toppingamt', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            settoppingAmtData(model);
        });
    }
    useEffect(() => {
        fetchTeaAmtData();
        fetchSpecItemAmtData();
        fetchToppingAmtData();
    }, []);

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#FFFFFF', height: 25, width: '100%', border: '0px solid green'}}>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={8}>
                    <span>机器部署状态：</span>
                </Col>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={8}>
                    <span>店铺组归属组织架构数量分布：</span>
                </Col>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={8}>
                    <span>店铺机器数量分布：</span>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#FFFFFF', height: 250, width: '100%', border: '0px solid green'}}>
                <Col className="gutter-row" span={8}>
                    <DeployPieChart />
                </Col>
                <Col className="gutter-row" span={8}>
                    <OrgShopBarChart />
                </Col>
                <Col className="gutter-row" span={8}>
                    <ShopMachineColumnChart />
                </Col>
            </Row>
            <Row style={{backgroundColor: '#FFFFFF', height: 25, width: '100%', border: '0px solid green'}}>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={12}>
                    <span>订单数量趋势（过去 14 天）：</span>
                </Col>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={12}>
                    <span>茶品数量趋势（过去 14 天）：</span>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#FFFFFF', height: 250, width: '100%', border: '0px solid green'}}>
                <Col className="gutter-row" span={12}>
                    <OrderAmtLineChart />
                </Col>
                <Col className="gutter-row" span={12}>
                    <TeaAmtByDayLineChart />
                </Col>
            </Row>
            <Row style={{backgroundColor: '#FFFFFF', height: 240, width: '100%', border: '0px solid green'}}>
                <Col className="gutter-row" span={24}>
                    <div className="flex-row-cont" style={{justifyContent: 'space-between', height: '100%', width: '100%'}}>
                        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'flex-start', height: '100%', width: '30%'}}>
                            <div className="flex-row-cont" style={{height: '20%', width: '100%'}}>
                                <span>茶品排行榜（过去 14 天）</span>
                            </div>
                            {teaAmtData.map((teaAmt, index) => (
                                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'space-between', height: '16%', width: '100%', paddingLeft: 5, paddingRight: 5, border: '0px solid blue'}}>
                                    <div><span>{teaAmt.teaName}</span></div>
                                    <div><span>{teaAmt.amount}</span></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'flex-start', height: '100%', width: '30%'}}>
                            <div className="flex-row-cont" style={{height: '20%', width: '100%'}}>
                                <span>规格排行榜（过去 14 天）</span>
                            </div>
                            {specItemAmtData.map((specItemAmt, index) => (
                                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'space-between', height: '16%', width: '100%', paddingLeft: 5, paddingRight: 5, border: '0px solid blue'}}>
                                    <div><span>{specItemAmt.specItemName}</span></div>
                                    <div><span>{specItemAmt.amount}</span></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'flex-start', height: '100%', width: '30%'}}>
                            <div className="flex-row-cont" style={{height: '20%', width: '100%'}}>
                                <span>物料排行榜（过去 14 天）</span>
                            </div>
                            {toppingAmtData.map((toppingAmt, index) => (
                                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'space-between', height: '16%', width: '100%', paddingLeft: 5, paddingRight: 5, border: '0px solid blue'}}>
                                    <div><span>{toppingAmt.toppingName}</span></div>
                                    <div><span>{toppingAmt.amount}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
};
