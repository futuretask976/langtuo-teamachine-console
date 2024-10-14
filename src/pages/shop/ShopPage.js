import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray, isValidCode, isValidName } from '../../js/common';
import { applyLang } from '../../i18n/i18n';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ShopListBlock from '../../components/shop/ShopListBlock'
import ShopNewModal from '../../components/shop/ShopNewModal'

const ShopPage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelShopSet'), applyLang('labelShopMgt')];

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
    const [shopGroupCode4Search, setShopGroupCode4Search] = useState('');
    const [shopCode4Edit, setShopCode4Edit] = useState();

    // 动作定义
    const fetchShopGroupList4Select = () => {
        get('/shopset/shop/group/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setShopGroupList4Select((prev => {
                let shopGroupList = [{
                    label: applyLang('labelAll'),
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
            alert(applyLang('msgShopGroupNameInvalid'));
            return;
        }
        if (!isValidName(shopName4Search, false)) {
            alert(applyLang('msgShopNameInvalid'));
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
                                <span>{applyLang('promptShopGroup')}</span>
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
                        <Col className="gutter-row" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptShopName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelShopName')} allowClear onChange={(e) => setShopName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang('labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={3}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{applyLang('labelNew')}</Button>
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
