import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import WarningRuleListBlock from '../../components/rule/WarningRuleListBlock'
import WarningRuleNewModal from '../../components/rule/WarningRuleNewModal'
import WarningRuleDispatchModal from '../../components/rule/WarningRuleDispatchModal'

const { Content } = Layout;

const WarningRulePage = (props) => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['ruleSet'];
    const selectedMenu = ['warningRuleMgt'];
    const breadcrumbPath = ['控制台', '食安规则', '预警规则管理'];

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
        setWarningRuleCode4Edit('');
        refreshList();
    }

    // 分发对话框相关
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setWarningRuleCode4Dispatch('');
    }

    // 搜索相关
    var warningRuleCode4SearchTmp = '';
    var warningRuleName4SearchTmp = '';
    const [warningRuleCode4Search, setWarningRuleCode4Search] = useState('');
    const [warningRuleName4Search, setWarningRuleName4Search] = useState('');
    const onClickSearch = () => {
        if (!isValidCode(warningRuleCode4SearchTmp, false)) {
            alert('预警规则编码不符合规则');
            return;
        }
        if (!isValidName(warningRuleName4SearchTmp, false)) {
            alert('预警规则名称不符合规则');
            return;
        }

        setWarningRuleCode4Search(warningRuleCode4SearchTmp);
        setWarningRuleName4Search(warningRuleName4SearchTmp);
    }

    // 表格操作相关
    const [warningRuleCode4Edit, setWarningRuleCode4Edit] = useState('');
    const onClickEdit = (selectedWarningRuleCode)=> {
        setWarningRuleCode4Edit(selectedWarningRuleCode);
        setOpenNewModal(true);
    }
    const [warningRuleCode4Dispatch, setWarningRuleCode4Dispatch] = useState('');
    const onClickDispatch = (selectedWarningRuleCode)=> {
        setWarningRuleCode4Dispatch(selectedWarningRuleCode);
        setOpenDispatchModal(true);
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

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
                                        <Input placeholder="规则编码" onChange={(e) => warningRuleCode4SearchTmp = e.target.value}/>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规则名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <Input placeholder="规则名称" onChange={(e) => warningRuleName4SearchTmp = e.target.value}/>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建规则</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <WarningRuleListBlock key={refreshListKey} warningRuleCode4Search={warningRuleCode4Search} warningRuleName4Search={warningRuleName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <WarningRuleNewModal modalTitle='新建规则' warningRuleCode4Edit={warningRuleCode4Edit} onClose={onCloseNewModal}/>
            )}

            {openDispatchModal && (
                <WarningRuleDispatchModal warningRuleCode4Dispatch={warningRuleCode4Dispatch} onClose={onCloseDispatchModal}/>
            )}
        </>
    )
};

export default WarningRulePage;
