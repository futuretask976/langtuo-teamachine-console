import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray } from '../../js/common.js';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import DrainActRecordListBlock from '../../components/record/DrainActRecordListBlock'
import DrainActRecordViewModal from '../../components/record/DrainActRecordViewModal'

const DrainActRecordPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '动作记录', '排空记录管理'];

    // 数据定义
    const [shopList4Select, setShopList4Select] = useState();
    const [shopGroupList4Select, setShopGroupList4Select] = useState();
    const [shopGroupCode4Search, setShopGroupCode4Search] = useState();
    const [shopCode4Search, setShopCode4Search] = useState();
    const [idempotentMark4View, setIdempotentMark4View] = useState();

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
    const onClickView = (selectedIdempotentMark)=> {
        setIdempotentMark4View(selectedIdempotentMark);
        setOpenViewModal(true);
    }
    useEffect(() => {
        fetchShopList4Select();
        fetchShopGroupList4Select();
    }, []);

    // 对话框定义
    const [openViewModal, setOpenViewModal] = useState(false);
    const onCloseViewModal = () => {
        setOpenViewModal(false);
        setIdempotentMark4View(undefined);
    }

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
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{height: '100%'}}>
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <DrainActRecordListBlock key={refreshListKey} shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search} onClickView={onClickView}/>
                </div>
            </Space>

            {openViewModal && (
                <DrainActRecordViewModal modalTitle='查看明细' idempotentMark4View={idempotentMark4View} onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default DrainActRecordPage;
