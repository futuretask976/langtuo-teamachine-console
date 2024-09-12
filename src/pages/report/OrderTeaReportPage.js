import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Select, Col, Row } from 'antd';
import { HighlightOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import '../../css/common.css';
import { dateToYMDHMS, getTenantCode, getYesterday, isArray } from '../../js/common.js';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OrderTeaReportListBlock from '../../components/report/OrderTeaReportListBlock'
import OrderTeaReportGenModal from '../../components/report/OrderTeaReportGenModal'

const OrderTeaReportPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '日常报表', '订单-茶品报表'];

    // 数据初始化
    const [shopList4Select, setShopList4Select] = useState([]);
    const [shopGroupList4Select, setShopGroupList4Select] = useState([]);
    const fetchShopListByShopGroupCode = (selectedShopGruopCode) => {
        get('/shopset/shop/list', {
            tenantCode: getTenantCode(),
            shopGroupCode: selectedShopGruopCode
        }).then(respData => {
            setShopList4Select((prev => {
                let shopList = [{
                    label: '全部',
                    value: ''
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopList.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                }
                return shopList;
            }));
            setShopCode4Search('');
        });
    }
    const fetchShopList4Select = () => {
        get('/shopset/shop/listbyadminorg', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setShopList4Select((prev => {
                let shopList = [{
                    label: '全部',
                    value: ''
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopList.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                }
                return shopList;
            }));
        });
    }
    const fetchShopGroupList4Select = () => {
        get('/shopset/shop/group/listbyadminorg', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setShopGroupList4Select((prev => {
                let shopGroupList = [{
                    label: '全部',
                    value: ''
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopGroupList.push({
                            label: item.shopGroupName,
                            value: item.shopGroupCode
                        });
                    });
                }
                return shopGroupList;
            }));
        });
    }
    useEffect(() => {
        fetchShopList4Select();
        fetchShopGroupList4Select();
    }, []);

    // 新建对话框相关
    const [openViewModal, setOpenViewModal] = useState(false);
    const onCloseViewModal = () => {
        setOpenViewModal(false);
    }

    // 搜索相关
    const [orderCreatedDay, setOrderCreatedDay] = useState(dayjs(getYesterday()).format('YYYY-MM-DD'));
    const [shopGroupCode4Search, setShopGroupCode4Search] = useState('');
    const [shopCode4Search, setShopCode4Search] = useState('');
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
                    <div className="flex-row-cont" style={{ justifyContent: 'flex-end', height: '100%'}}>
                        <span>店铺组编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <Select
                        value={shopGroupCode4Search}
                        style={{width: '95%'}}
                        onChange={(e) => {
                            setShopGroupCode4Search(e);
                            fetchShopListByShopGroupCode(e);
                        }}
                        options={shopGroupList4Select}
                    />
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>店铺编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <Select
                        value={shopCode4Search}
                        style={{width: '95%'}}
                        onChange={(e) => setShopCode4Search(e)}
                        options={shopList4Select}
                    />
                </Col>
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
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <OrderTeaReportListBlock key={refreshListKey} orderCreatedDay={orderCreatedDay} shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search}/>

            {openViewModal && (
                <OrderTeaReportGenModal onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default OrderTeaReportPage;
