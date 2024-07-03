import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Select, Space, Table, TreeSelect, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

import '../css/common.css';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import MachineDeployListBlock from '../components/MachineDeployListBlock'
import MachineDeployNewModal from '../components/MachineDeployNewModal'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;
const { TextArea } = Input;

const MachineDeployPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['deviceSet'];
    const selectedMenu = ['9'];
    const breadcrumbPath = ['控制台', '设备', '预部署管理'];

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
        setDeployCode4Edit('');
    }

    // 搜索相关
    var deployCode4SearchTmp = '';
    const [deployCode4Search, setDeployCode4Search] = useState('');
    const onChangeDeployCode4Search = (e) => {
        deployCode4SearchTmp = e.target.value;
    }
    var shopName4SearchTmp = '';
    const [shopName4Search, setShopName4Search] = useState('');
    const onChangeShopName4Search = (e) => {
        shopName4SearchTmp = e.target.value;
    }
    var state4SearchTmp = '';
    const [state4Search, setState4Search] = useState('');
    const onChangeState4Search = (e) => {
        state4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setDeployCode4Search(deployCode4SearchTmp);
        setShopName4Search(shopName4SearchTmp);
        setState4Search(state4SearchTmp);
    }

    // 表格操作相关
    const [deployCode4Edit, setDeployCode4Edit] = useState('');
    const onClickEdit = (selectedDeployCode)=> {
        setDeployCode4Edit(selectedDeployCode);
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
                                            <span>部署编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="部署编码" onChange={onChangeDeployCode4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>店铺名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="店铺名称" onChange={onChangeShopName4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>部署状态：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="部署状态" onChange={onChangeState4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal}>新建部署码</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <MachineDeployListBlock deployCode4Search={deployCode4Search} shopName4Search={shopName4Search} state4Search={state4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <MachineDeployNewModal onClose={onCloseNewModal} deployCode4Edit={deployCode4Edit} />
            )}
        </>
    )
};

export default MachineDeployPage;
