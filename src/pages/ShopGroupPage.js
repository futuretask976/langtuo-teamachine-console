import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Select, Space, Table, TreeSelect, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

import '../css/common.css';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ShopGroupListBlock from '../components/ShopGroupListBlock'
import ShopGroupNewModal from '../components/ShopGroupNewModal'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;
const { TextArea } = Input;

const ShopGroupPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['storeSub'];
    const selectedMenu = ['7'];
    const breadcrumbPath = ['控制台', '店铺', '店铺组管理'];

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
        setShopGroupCode4Edit('');
    }

    // 搜索相关
    var shopGroupName4SearchTmp = '';
    const [shopGroupName4Search, setShopGroupName4Search] = useState('');
    const onChangeShopGroupName4Search = (e) => {
        shopGroupName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setShopGroupName4Search(shopGroupName4SearchTmp);
    }

    // 表格操作相关
    const [shopGroupCode4Edit, setShopGroupCode4Edit] = useState('');
    const onClickEdit = (selectedShopGroupCode)=> {
        setShopGroupCode4Edit(selectedShopGroupCode);
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
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>店铺组名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="店铺组名称" onChange={onChangeShopGroupName4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal}>新建管理员</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <ShopGroupListBlock shopGroupName4Search={shopGroupName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <ShopGroupNewModal onClose={onCloseNewModal} shopGroupCode4Edit={shopGroupCode4Edit} />
            )}
        </>
    )
};

export default ShopGroupPage;
