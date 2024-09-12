import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ShopGroupListBlock from '../../components/shop/ShopGroupListBlock'
import ShopGroupNewModal from '../../components/shop/ShopGroupNewModal'

const ShopGroupPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '店铺', '店铺组管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setShopGroupCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [shopGroupName4Search, setShopGroupName4Search] = useState('');
    const onClickSearch = () => {
        if (!isValidName(shopGroupName4Search, false)) {
            alert('店铺组名称不符合规则');
            return;
        }
        refreshList();
    }

    // 表格操作相关
    const [shopGroupCode4Edit, setShopGroupCode4Edit] = useState('');
    const onClickEdit = (selectedShopGroupCode)=> {
        setShopGroupCode4Edit(selectedShopGroupCode);
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
                        <span>店铺组名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="店铺组名称" allowClear onChange={(e) => setShopGroupName4Search(e.target.value)} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建门店组</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <ShopGroupListBlock key={refreshListKey} shopGroupName4Search={shopGroupName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <ShopGroupNewModal onClose={onCloseNewModal} shopGroupCode4Edit={shopGroupCode4Edit} />
            )}
        </>
    )
};

export default ShopGroupPage;
