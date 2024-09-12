import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Select, Col, Row } from 'antd';
import { HighlightOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import '../../css/common.css';
import { dateToYMDHMS, getTenantCode, getYesterday, isArray } from '../../js/common.js';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OrderAmtReportListBlock from '../../components/report/OrderAmtReportListBlock'
import OrderAmtReportGenModal from '../../components/report/OrderAmtReportGenModal'

const OrderAmtReportPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '日常报表', '订单-数量报表'];

    // 新建对话框相关
    const [openViewModal, setOpenViewModal] = useState(false);
    const onCloseViewModal = () => {
        setOpenViewModal(false);
    }

    // 搜索相关
    const [orderCreatedDay, setOrderCreatedDay] = useState(dayjs(getYesterday()).format('YYYY-MM-DD'));
    const onClickSearch = () => {
        refreshList();
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#FFFFFF'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#FFFFFF'}}>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>日期选择：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <DatePicker
                        format={{
                            format: 'YYYY-MM-DD',
                            type: 'mask',
                        }}
                        onChange={(e, dateString) => setOrderCreatedDay(dateString)}
                        style={{width: '100%'}}
                        value={dayjs(orderCreatedDay, 'YYYY-MM-DD')}
                    />
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont" style={{height: '100%'}}>
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont" style={{height: '100%'}}>
                        <Button type="primary" icon={<HighlightOutlined />} onClick={(e) => setOpenViewModal(true)} style={{width: '90%'}}>生成报表</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <OrderAmtReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay}/>

            {openViewModal && (
                <OrderAmtReportGenModal onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default OrderAmtReportPage;
