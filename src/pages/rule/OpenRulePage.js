import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OpenRuleListBlock from '../../components/rule/OpenRuleListBlock'
import OpenRuleNewModal from '../../components/rule/OpenRuleNewModal'

const { Content } = Layout;

const OpenRulePage = (props) => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['ruleSet'];
    const selectedMenu = ['openRuleMgt'];
    const breadcrumbPath = ['控制台', '食安规则', '营业准备管理'];

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
        setOpenRuleCode4Edit('');
    }

    // 搜索相关
    const [openRuleCode4Search, setOpenRuleCode4Search] = useState('');
    const [openRuleName4Search, setOpenRuleName4Search] = useState('');
    var openRuleCode4SearchTmp = '';
    var openRuleName4SearchTmp = '';
    const onClickSearch = () => {
        setOpenRuleCode4Search(openRuleCode4SearchTmp);
        setOpenRuleName4Search(openRuleName4SearchTmp);
    }

    // 表格操作相关
    const [openRuleCode4Edit, setOpenRuleCode4Edit] = useState('');
    const onClickEdit = (selectedOpenRuleCode)=> {
        setOpenRuleCode4Edit(selectedOpenRuleCode);
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
                                        <div className="flex-row-cont" style={{ justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规则编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont">
                                            <Input placeholder="规则编码" onChange={(e) => openRuleCode4SearchTmp = e.target.value}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规则名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont">
                                            <Input placeholder="规则名称" onChange={(e) => openRuleName4SearchTmp = e.target.value}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '80%'}}>新建规则</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <OpenRuleListBlock openRuleCode4Search={openRuleCode4Search} openRuleName4Search={openRuleName4Search} onClickEdit={onClickEdit}/>
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <OpenRuleNewModal modalTitle='新建规则' openRuleCode4Edit={openRuleCode4Edit} onClose={onCloseNewModal}/>
            )}
        </>
    )
};

export default OpenRulePage;
