import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Table, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ToppingListBlock from '../components/ToppingListBlock'
import ToppingNewModal from '../components/ToppingNewModal'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;
const { TextArea } = Input;

const ToppingPage = () => {
    const openMenu = ['drinkSet'];
    const selectedMenu = ['16'];
    const breadcrumbPath = ['控制台', '饮品生产', '配方管理'];
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    
    
    const [current, setCurrent] = useState(0);
    
    

    

    

    
    // 新建配方对话框相关
    const [openNewToppingModal, setOpenNewToppingModal] = useState(false);
    const onCreateNewToppingModal = () => {
        setOpenNewToppingModal(true);
    };
    const onCloseNewToppingModal = () => {
        setOpenNewToppingModal(false);
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
                                            <span>配方名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="配方名称" />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onCreateNewToppingModal}>新建配方</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <ToppingListBlock />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewToppingModal && (
                <ToppingNewModal onClose={onCloseNewToppingModal} />
            )}
        </>
    )
};

export default ToppingPage;
