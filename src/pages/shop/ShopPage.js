import React, { useState } from 'react';
import { Button, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ShopListBlock from '../../components/shop/ShopListBlock'
import ShopNewModal from '../../components/shop/ShopNewModal'

const ShopPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '店铺', '店铺管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setShopCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [shopName4Search, setShopName4Search] = useState('');
    const [shopGroupName4Search, setShopGroupName4Search] = useState('');
    var shopName4SearchTmp = '';
    var shopGroupName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidName(shopGroupName4SearchTmp, false)) {
            alert('店铺组名称不符合规则');
            return;
        }
        if (!isValidName(shopName4SearchTmp, false)) {
            alert('店铺名称不符合规则');
            return;
        }

        setShopName4Search(shopName4SearchTmp);
        setShopGroupName4Search(shopGroupName4SearchTmp);
    }

    // 表格操作相关
    const [shopCode4Edit, setShopCode4Edit] = useState('');
    const onClickEdit = (selectedShopCode)=> {
        setShopCode4Edit(selectedShopCode);
        setOpenNewModal(true);
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#fff'}}>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>店铺名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="店铺名称" onChange={(e) => shopName4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>店铺组名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="店铺组名称" onChange={(e) => shopGroupName4SearchTmp = e.target.value} style={{width: '95%'}} />
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
                <Col className="gutter-row" span={6}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <ShopListBlock key={refreshListKey} shopName4Search={shopName4Search} shopGroupName4Search={shopGroupName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <ShopNewModal onClose={onCloseNewModal} shopCode4Edit={shopCode4Edit} />
            )}
        </>
    )
};

export default ShopPage;
