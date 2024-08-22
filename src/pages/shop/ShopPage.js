import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ShopListBlock from '../../components/shop/ShopListBlock'
import ShopNewModal from '../../components/shop/ShopNewModal'

const { Content } = Layout;

const ShopPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['shopSet'];
    const selectedMenu = ['shopMgt'];
    const breadcrumbPath = ['控制台', '店铺', '店铺管理'];

    // 页面样式相关
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setShopCode4Edit('');
    }

    // 搜索相关
    const [shopName4Search, setShopName4Search] = useState('');
    const [shopGroupName4Search, setShopGroupName4Search] = useState('');
    var shopName4SearchTmp = '';
    var shopGroupName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidName(shopGroupName4SearchTmp)) {
            alert('店铺组名称不符合规则');
            return;
        }
        if (!isValidName(shopName4SearchTmp)) {
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

    return (
        <>
            <Flex gap="middle" justify="center" wrap="wrap">
                <Layout style={layoutStyle}>
                    <HeaderBar />
                    <Layout>
                        <SiderMenu openMenu={openMenu} selectedMenu={selectedMenu} />
                        <Layout>
                            <Content style={{ margin: '0px 5px 0px 5px' }}>
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
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '80%'}}>新建店铺</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <ShopListBlock shopName4Search={shopName4Search} shopGroupName4Search={shopGroupName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <ShopNewModal onClose={onCloseNewModal} shopCode4Edit={shopCode4Edit} />
            )}
        </>
    )
};

export default ShopPage;
