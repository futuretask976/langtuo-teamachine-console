import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Select, Space, Col, Row } from 'antd';
import { HighlightOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OrderReportListBlock from '../../components/report/OrderReportListBlock'
import OrderTeaReportListBlock from '../../components/report/OrderTeaReportListBlock'
import OrderToppingReportListBlock from '../../components/report/OrderToppingReportListBlock'
import OrderSpecItemReportListBlock from '../../components/report/OrderSpecItemReportListBlock'
import OrderReportGenModal from '../../components/report/OrderReportGenModal'

const OrderReportPage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelReportSet'), applyLang('labelOrderReportMgt')];

    // 对话框定义
    const [openViewModal, setOpenViewModal] = useState(false);
    const onCloseViewModal = () => {
        setOpenViewModal(false);
    }

    // 数据定义
    const [shopList4Select, setShopList4Select] = useState();
    const [shopGroupList4Select, setShopGroupList4Select] = useState();
    const [orderCreatedDay, setOrderCreatedDay] = useState(); // useState(dayjs(getYesterday()).format('YYYY-MM-DD'));
    const [shopGroupCode4Search, setShopGroupCode4Search] = useState(null);
    const [shopCode4Search, setShopCode4Search] = useState(null);

    // 动作定义
    const fetchShopListByShopGroupCode = (selectedShopGruopCode) => {
        get('/shopset/shop/list', {
            tenantCode: getTenantCode(),
            shopGroupCode: selectedShopGruopCode
        }).then(respData => {
            if (respData == undefined) {
                return;
            }
            setShopList4Select((prev => {
                let shopListTmp = [{
                    label: applyLang('labelAll'),
                    value: null
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopListTmp.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                }
                return shopListTmp;
            }));
            setShopCode4Search(null);
        });
    }
    const fetchShopList4Select = () => {
        get('/shopset/shop/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData == undefined) {
                return;
            }
            setShopList4Select((prev => {
                let shopListTmp = [{
                    label: applyLang('labelAll'),
                    value: null
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopListTmp.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                }
                return shopListTmp;
            }));
        });
    }
    const fetchShopGroupList4Select = () => {
        get('/shopset/shop/group/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData == undefined) {
                return;
            }
            setShopGroupList4Select((prev => {
                let shopGroupListTmp = [{
                    label: applyLang('labelAll'),
                    value: null
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopGroupListTmp.push({
                            label: item.shopGroupName,
                            value: item.shopGroupCode
                        });
                    });
                }
                return shopGroupListTmp;
            }));
        });
    }
    const onClickSearch = () => {
        refreshList();
    }
    useEffect(() => {
        fetchShopList4Select();
        fetchShopGroupList4Select();
    }, []);

    // 刷新定义
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
                            <div className="flex-row-cont full-height" style={{ justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptShopGroupName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    value={shopGroupCode4Search}
                                    style={{width: '95%'}}
                                    onChange={(e) => {
                                        setShopGroupCode4Search(e);
                                        fetchShopListByShopGroupCode(e);
                                    }}
                                    options={shopGroupList4Select}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptShopName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    value={shopCode4Search}
                                    style={{width: '95%'}}
                                    onChange={(e) => setShopCode4Search(e)}
                                    options={shopList4Select}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptDatePicker')}</span>
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
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang('labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<HighlightOutlined />} onClick={(e) => setOpenViewModal(true)} style={{width: '90%'}}>{applyLang('labelGenReport')}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="flex-col-cont full-width" style={{alignItems: 'center', height: 740}}>
                    <div className='flex-row-cont full-width' style={{marginBottom: 5, height: '50%'}}>
                        <div className='flex-row-cont full-width' style={{marginRight: 3, height: '100%', width: '100%'}}>
                            <OrderReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay}/>
                        </div>
                        <div className='flex-row-cont full-width' style={{marginLeft: 3, height: '100%', width: '100%'}}>
                            <OrderTeaReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay} shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search}/>
                        </div>
                    </div>
                    <div className='flex-row-cont full-width' style={{marginTop: 5, height: '50%'}}>
                        <div className='flex-row-cont full-width' style={{marginRight: 3, height: '100%', width: '100%'}}>
                            <OrderToppingReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay} shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search}/>
                        </div>
                        <div className='flex-row-cont full-width' style={{marginLeft: 3, height: '100%', width: '100%'}}>
                            <OrderSpecItemReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay} shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search}/>
                        </div>
                    </div>
                </div>
            </Space>

            {openViewModal && (
                <OrderReportGenModal onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default OrderReportPage;
