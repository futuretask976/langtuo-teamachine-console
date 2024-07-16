import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ToppingAccuracyTemplateListBlock from '../components/ToppingAccuracyTemplateListBlock'
import ToppingAccuracyTemplateNewModal from '../components/ToppingAccuracyTemplateNewModal'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;

const ToppingAccuracyTemplatePage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['drinkSet'];
    const selectedMenu = ['17'];
    const breadcrumbPath = ['控制台', '饮品', '规格管理'];

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
        setTemplateCode4Edit('');
    }

    // 搜索相关
    var templateCode4SearchTmp = '';
    const [templateCode4Search, setTemplateCode4Search] = useState('');
    const onChangeTemplateCode4Search = (e) => {
        templateCode4SearchTmp = e.target.value;
    }
    var templateName4SearchTmp = '';
    const [templateName4Search, setTemplateName4Search] = useState('');
    const onChangeTemplateName4Search = (e) => {
        templateName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setTemplateCode4Search(templateCode4SearchTmp);
        setTemplateName4Search(templateName4SearchTmp);
    }

    // 表格操作相关
    const [templateCode4Edit, setTemplateCode4Edit] = useState('');
    const onClickEdit = (selectedTemplateCode)=> {
        setTemplateCode4Edit(selectedTemplateCode);
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
                                            <span>规格编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="规格编码" onClick={onChangeTemplateCode4Search} style={{width: '95%'}}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规格名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="规格名称" onClick={onChangeTemplateName4Search} style={{width: '95%'}}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '80%'}}>新建模板</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <ToppingAccuracyTemplateListBlock templateCode4Search={templateCode4Search} templateName4Search={templateName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <ToppingAccuracyTemplateNewModal onClose={onCloseNewModal} templateCode4Edit={templateCode4Edit} />
            )}
        </>
    )
};

export default ToppingAccuracyTemplatePage;
