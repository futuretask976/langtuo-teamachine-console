import React, { useState } from 'react';
import { Button, DatePicker, Space, Col, Row } from 'antd';
import { HighlightOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import '../../css/common.css';
import { getYesterday } from '../../js/common.js';

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
            <Space className="full-square" direction="vertical" size={15}>
                <div className='flex-row-cont' style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 40}}>
                    <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                </div>
                <div className='flex-col-cont full-width' style={{alignItems: 'center', background: '#FFFFFF', height: 50}}>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>日期选择：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD',
                                        type: 'mask',
                                    }}
                                    onChange={(e, dateString) => setOrderCreatedDay(dateString)}
                                    style={{width: '100%'}}
                                    value={dayjs(orderCreatedDay, 'YYYY-MM-DD')}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<HighlightOutlined />} onClick={(e) => setOpenViewModal(true)} style={{width: '90%'}}>生成报表</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <OrderAmtReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay}/>
                </div>
            </Space>

            {openViewModal && (
                <OrderAmtReportGenModal onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default OrderAmtReportPage;
