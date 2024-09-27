import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Select, Space, Col, Row } from 'antd';
import { HighlightOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import '../../css/common.css';
import { getTenantCode, getYesterday, isArray } from '../../js/common.js';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OrderSpecItemReportListBlock from '../../components/report/OrderSpecItemReportListBlock'
import OrderSpecItemReportGenModal from '../../components/report/OrderSpecItemReportGenModal'

const OrderToppingReportPage = () => {
    // 面包屑定义
    const breadcrumbPath = ['控制台', '日常报表', '订单-规格项报表'];

    // 对话框定义
    const [openViewModal, setOpenViewModal] = useState(false);
    const onCloseViewModal = () => {
        setOpenViewModal(false);
    }

    // 数据定义
    const [shopList4Select, setShopList4Select] = useState([]);
    const [shopGroupList4Select, setShopGroupList4Select] = useState([]);
    const [orderCreatedDay, setOrderCreatedDay] = useState(dayjs(getYesterday()).format('YYYY-MM-DD'));
    const [shopGroupCode4Search, setShopGroupCode4Search] = useState('');
    const [shopCode4Search, setShopCode4Search] = useState('');

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
                    label: '全部',
                    value: ''
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
            setShopCode4Search('');
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
                    label: '全部',
                    value: ''
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
                    label: '全部',
                    value: ''
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
                                <span>店铺组编码：</span>
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
                                <span>店铺编码：</span>
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
                    <OrderSpecItemReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay} shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search}/>
                </div>
            </Space>            

            {openViewModal && (
                <OrderSpecItemReportGenModal onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default OrderToppingReportPage;
