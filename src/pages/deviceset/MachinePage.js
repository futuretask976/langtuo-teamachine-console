import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import '../../js/common.js';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import MachineListBlock from '../../components/deviceset/MachineListBlock'
import MachineNewModal from '../../components/deviceset/MachineNewModal'

const { Content } = Layout;

const MachinePage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['deviceSet'];
    const selectedMenu = ['10'];
    const breadcrumbPath = ['控制台', '设备', '机器管理'];

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
        setMachineCode4Edit('');
    }

    // 搜索相关
    var screenCode4SearchTmp = '';
    const [screenCode4Search, setScreenCode4Search] = useState('');
    const onChangeScreenCode4Search = (e) => {
        screenCode4SearchTmp = e.target.value;
    }
    var elecBoardCode4SearchTmp = '';
    const [elecBoardCode4Search, setElecBoardCode4Search] = useState('');
    const onChangeElecBoardCode4Search = (e) => {
        elecBoardCode4SearchTmp = e.target.value;
    }
    var modelCode4SearchTmp = '';
    const [modelCode4Search, setModelCode4Search] = useState('');
    const onChangeModelCode4Search = (e) => {
        modelCode4SearchTmp = e.target.value;
    }
    var shopName4SearchTmp = '';
    const [shopName4Search, setShopName4Search] = useState('');
    const onChangeShopName4Search = (e) => {
        shopName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setScreenCode4Search(screenCode4SearchTmp);
        setElecBoardCode4Search(elecBoardCode4SearchTmp);
        setModelCode4Search(modelCode4SearchTmp);
        setShopName4Search(shopName4SearchTmp);
    }

    // 表格操作相关
    const [machineCode4Edit, setMachineCode4Edit] = useState('');
    const onClickEdit = (selectedMachineCode)=> {
        setMachineCode4Edit(selectedMachineCode);
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
                                            <span>屏幕编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={5}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="屏幕编码" onChange={onChangeScreenCode4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>控制板编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={5}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="控制板编码" onChange={onChangeElecBoardCode4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>机器型号：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={5}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="机器型号" onChange={onChangeModelCode4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
                                <Row style={{backgroundColor: '#fff'}}>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>店铺名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={5}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="店铺名称" onChange={onChangeShopName4Search}/>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={17}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <MachineListBlock screenCode4Search={screenCode4Search} elecBoardCode4Search={elecBoardCode4Search} modelCode4Search={modelCode4Search} shopName4Search={shopName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <MachineNewModal onClose={onCloseNewModal} machineCode4Edit={machineCode4Edit} />
            )}
        </>
    )
};

export default MachinePage;
