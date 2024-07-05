import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Table, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ToppingListBlock from '../components/ToppingListBlock'
import ToppingNewModal from '../components/ToppingNewModal'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;

const ToppingPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['drinkSet'];
    const selectedMenu = ['13'];
    const breadcrumbPath = ['控制台', '饮品', '物料管理'];

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
        setToppingCode4Edit('');
    }

    // 搜索相关
    var toppingCode4SearchTmp = '';
    const [toppingCode4Search, setToppingCode4Search] = useState('');
    const onChangeToppingCode4Search = (e) => {
        toppingCode4SearchTmp = e.target.value;
    }
    var toppingName4SearchTmp = '';
    const [toppingName4Search, setToppingName4Search] = useState('');
    const onChangeToppingName4Search = (e) => {
        toppingName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setToppingCode4Search(toppingCode4SearchTmp);
        setToppingName4Search(toppingName4SearchTmp);
    }

    // 表格操作相关
    const [toppingCode4Edit, setToppingCode4Edit] = useState('');
    const onClickEdit = (selectedToppingCode)=> {
        setToppingCode4Edit(selectedToppingCode);
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
                                            <span>物料编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="物料编码" onClick={onChangeToppingCode4Search} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>物料名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="物料名称" onClick={onChangeToppingName4Search} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal}>新建物料</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <ToppingListBlock toppingCode4Search={toppingCode4Search} toppingName4Search={toppingName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <ToppingNewModal onClose={onCloseNewModal} toppingCode4Edit={toppingCode4Edit} />
            )}
        </>
    )
};

export default ToppingPage;
