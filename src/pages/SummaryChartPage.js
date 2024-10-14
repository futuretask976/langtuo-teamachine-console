import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';

import { isArray, getTenantCode } from '../js/common.js';
import { applyLang } from '../i18n/i18n';
import { get } from '../js/request.js';

import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ShopMachineColumnChart from '../components/ShopMachineColumnChart'
import OrderAmtLineChart from '../components/OrderAmtLineChart'
import DeployPieChart from '../components/DeployPieChart'
import OrgShopBarChart from '../components/OrgShopBarChart'
import TeaAmtByDayLineChart from '../components/TeaAmtByDayLineChart'

export default function SummaryChartPage() {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelSummaryChartMgt')];

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
            if (isArray(model)) {
                setTeaAmtData(model);
            }
        });
    }
    const fetchSpecItemAmtData = () => {
        get('/summarychart/specitemamt', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            if (isArray(model)) {
                setspecItemAmtData(model);
            }
        });
    }
    const fetchToppingAmtData = () => {
        get('/summarychart/toppingamt', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            if (isArray(model)) {
                settoppingAmtData(model);
            }
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
                    <span style={{fontWeight: 'bold'}}>{applyLang('promptMachineDeployStateChart')}</span>
                </Col>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={8}>
                    <span style={{fontWeight: 'bold'}}>{applyLang('promptOrgCntByShopChart')}</span>
                </Col>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={8}>
                    <span style={{fontWeight: 'bold'}}>{applyLang('promptMachineCntByShopChart')}</span>
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
                    <span style={{fontWeight: 'bold'}}>{applyLang('promptOrderCntTrendChart')}</span>
                </Col>
                <Col className="gutter-row" style={{paddingLeft: 5}} span={12}>
                    <span style={{fontWeight: 'bold'}}>{applyLang('promptTeaCntTrendChart')}</span>
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
                                <span style={{fontWeight: 'bold'}}>{applyLang('promptTeaRankingList')}</span>
                            </div>
                            {teaAmtData.map((teaAmt, index) => (
                                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'space-between', height: '16%', width: '100%', paddingLeft: 5, paddingRight: 5, border: '0px solid blue'}}>
                                    <div style={{width:"50%"}}><span>{teaAmt.teaName}</span></div>
                                    <div style={{width:"20%"}}>----------</div>
                                    <div style={{textAlign: 'right', width:"30%"}}><span>{teaAmt.amount}</span></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'flex-start', height: '100%', width: '30%'}}>
                            <div className="flex-row-cont" style={{height: '20%', width: '100%'}}>
                                <span style={{fontWeight: 'bold'}}>{applyLang('promptSpecItemRankingList')}</span>
                            </div>
                            {specItemAmtData.map((specItemAmt, index) => (
                                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'space-between', height: '16%', width: '100%', paddingLeft: 5, paddingRight: 5, border: '0px solid blue'}}>
                                    <div style={{width:"50%"}}><span>{specItemAmt.specItemName}</span></div>
                                    <div style={{width:"20%"}}>----------</div>
                                    <div style={{textAlign: 'right', width:"30%"}}><span>{specItemAmt.amount}</span></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-col-cont" style={{alignItems: 'center', justifyContent: 'flex-start', height: '100%', width: '30%'}}>
                            <div className="flex-row-cont" style={{height: '20%', width: '100%'}}>
                                <span style={{fontWeight: 'bold'}}>{applyLang('promptToppingRankingList')}</span>
                            </div>
                            {toppingAmtData.map((toppingAmt, index) => (
                                <div className="flex-row-cont" style={{alignItems: 'center', justifyContent: 'space-between', height: '16%', width: '100%', paddingLeft: 5, paddingRight: 5, border: '0px solid blue'}}>
                                    <div style={{width:"50%"}}><span>{toppingAmt.toppingName}</span></div>
                                    <div style={{width:"20%"}}>----------</div>
                                    <div style={{textAlign: 'right', width:"30%"}}><span>{toppingAmt.amount}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
};
