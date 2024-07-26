import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Table, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import CleanRuleListBlock from '../../components/ruleset/CleanRuleListBlock'
import CleanRuleNewModal from '../../components/ruleset/CleanRuleNewModal'
import CleanRuleDispatchModal from '../../components/ruleset/CleanRuleDispatchModal'

const { Content } = Layout;

const CleanRulePage = (props) => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['ruleSet'];
    const selectedMenu = ['cleanRuleMgt'];
    const breadcrumbPath = ['控制台', '食安规则', '清洗规则管理'];

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
        setCleanRuleCode4Edit('');
    }

    // 分发对话框相关
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onOpenDispatchModal = () => {
        setOpenNewModal(true);
    };
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setCleanRuleCode4Dispatch('');
    }

    // 搜索相关
    var cleanRuleCode4SearchTmp = '';
    const [cleanRuleCode4Search, setCleanRuleCode4Search] = useState('');
    const onChangeCleanRuleCode4Search = (e) => {
        cleanRuleCode4SearchTmp = e.target.value;
    }
    var cleanRuleName4SearchTmp = '';
    const [cleanRuleName4Search, setCleanRuleName4Search] = useState('');
    const onChangeCleanRuleName4Search = (e) => {
        cleanRuleName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setCleanRuleCode4Search(cleanRuleCode4SearchTmp);
        setCleanRuleName4Search(cleanRuleName4SearchTmp);
    }

    // 表格操作相关
    const [cleanRuleCode4Edit, setCleanRuleCode4Edit] = useState('');
    const onClickEdit = (selectedCleanRuleCode)=> {
        setCleanRuleCode4Edit(selectedCleanRuleCode);
        setOpenNewModal(true);
    }
    const [cleanRuleCode4Dispatch, setCleanRuleCode4Dispatch] = useState('');
    const onClickDispatch = (selectedCleanRuleCode)=> {
        setCleanRuleCode4Dispatch(selectedCleanRuleCode);
        setOpenDispatchModal(true);
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
                                            <Input placeholder="规则编码" onChange="onChangeCleanRuleCode4Search"/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规则名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont">
                                            <Input placeholder="规则名称" onChange="onChangeCleanRuleName4Search"/>
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
                                <CleanRuleListBlock cleanRuleCode4Search={cleanRuleCode4Search} cleanRuleName4Search={cleanRuleName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <CleanRuleNewModal modalTitle='新建规则' cleanRuleCode4Edit={cleanRuleCode4Edit} onClose={onCloseNewModal}/>
            )}

            {openDispatchModal && (
                <CleanRuleDispatchModal cleanRuleCode4Dispatch={cleanRuleCode4Dispatch} onClose={onCloseDispatchModal}/>
            )}
        </>
    )
};

export default CleanRulePage;
