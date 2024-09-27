import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray, isValidCode, isValidName } from '../../js/common';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ShopListBlock from '../../components/shop/ShopListBlock'
import ShopNewModal from '../../components/shop/ShopNewModal'

const ShopPage = () => {
    // 面包屑定义
    const breadcrumbPath = ['控制台', '店铺', '店铺管理'];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setShopCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [shopGroupList4Select, setShopGroupList4Select] = useState();
    const [shopName4Search, setShopName4Search] = useState();
    const [shopGroupCode4Search, setShopGroupCode4Search] = useState();
    const [shopCode4Edit, setShopCode4Edit] = useState();

    // 动作定义
    const fetchShopGroupList4Select = () => {
        get('/shopset/shop/group/list', {
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
    const onClickSearch = () => {
        if (!isValidCode(shopGroupCode4Search, false)) {
            alert('店铺组名称不符合规则');
            return;
        }
        if (!isValidName(shopName4Search, false)) {
            alert('店铺名称不符合规则');
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedShopCode)=> {
        setShopCode4Edit(selectedShopCode);
        setOpenNewModal(true);
    }
    useEffect(() => {
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
                        <Col className="gutter-row" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="店铺名称" allowClear onChange={(e) => setShopName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>店铺组名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    value={shopGroupCode4Search}
                                    style={{width: '95%'}}
                                    onChange={(e) => setShopGroupCode4Search(e)}
                                    options={shopGroupList4Select}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建店铺</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <ShopListBlock key={refreshListKey} shopName4Search={shopName4Search} shopGroupCode4Search={shopGroupCode4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <ShopNewModal onClose={onCloseNewModal} shopCode4Edit={shopCode4Edit} />
            )}
        </>
    )
};

export default ShopPage;
