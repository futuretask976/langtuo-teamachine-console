import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import DrainRuleListBlock from '../../components/rule/DrainRuleListBlock'
import DrainRuleNewModal from '../../components/rule/DrainRuleNewModal'
import DrainRuleDispatchModal from '../../components/rule/DrainRuleDispatchModal'

const { Content } = Layout;

const DrainRulePage = (props) => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['ruleSet'];
    const selectedMenu = ['drainRuleMgt'];
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
        setDrainRuleCode4Edit('');
    }

    // 分发对话框相关
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setDrainRuleCode4Dispatch('');
    }

    // 搜索相关
    const [drainRuleCode4Search, setDrainRuleCode4Search] = useState('');
    const [drainRuleName4Search, setDrainRuleName4Search] = useState('');
    var drainRuleCode4SearchTmp = '';
    var drainRuleName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(drainRuleCode4SearchTmp)) {
            alert('排空规则编码不符合规则');
            return;
        }
        if (!isValidName(drainRuleName4SearchTmp)) {
            alert('排空规则名称不符合规则');
            return;
        }

        setDrainRuleCode4Search(drainRuleCode4SearchTmp);
        setDrainRuleName4Search(drainRuleName4SearchTmp);
    }

    // 表格操作相关
    const [drainRuleCode4Edit, setDrainRuleCode4Edit] = useState('');
    const onClickEdit = (selectedDrainRuleCode)=> {
        setDrainRuleCode4Edit(selectedDrainRuleCode);
        setOpenNewModal(true);
    }
    const [drainRuleCode4Dispatch, setDrainRuleCode4Dispatch] = useState('');
    const onClickDispatch = (selectedDrainRuleCode)=> {
        setDrainRuleCode4Dispatch(selectedDrainRuleCode);
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
                                            <Input placeholder="规则编码" onChange={(e) => drainRuleCode4SearchTmp = e.target.value}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规则名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont">
                                            <Input placeholder="规则名称" onChange={(e) => drainRuleName4SearchTmp = e.target.value}/>
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
                                <DrainRuleListBlock drainRuleCode4Search={drainRuleCode4Search} drainRuleName4Search={drainRuleName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <DrainRuleNewModal modalTitle='新建规则' drainRuleCode4Edit={drainRuleCode4Edit} onClose={onCloseNewModal}/>
            )}

            {openDispatchModal && (
                <DrainRuleDispatchModal drainRuleCode4Dispatch={drainRuleCode4Dispatch} onClose={onCloseDispatchModal}/>
            )}
        </>
    )
};

export default DrainRulePage;
