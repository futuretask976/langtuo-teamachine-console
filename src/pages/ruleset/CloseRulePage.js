import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import CloseRuleListBlock from '../../components/ruleset/CloseRuleListBlock'
import CloseRuleNewModal from '../../components/ruleset/CloseRuleNewModal'

const { Content } = Layout;

const CloseRulePage = (props) => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['ruleSet'];
    const selectedMenu = ['closeRuleMgt'];
    const breadcrumbPath = ['控制台', '食安规则', '打烊准备管理'];

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
        setCloseRuleCode4Edit('');
    }

    // 搜索相关
    var closeRuleCode4SearchTmp = '';
    const [closeRuleCode4Search, setCloseRuleCode4Search] = useState('');
    const onChangeCloseRuleCode4Search = (e) => {
        closeRuleCode4SearchTmp = e.target.value;
    }
    var closeRuleName4SearchTmp = '';
    const [closeRuleName4Search, setCloseRuleName4Search] = useState('');
    const onChangeCloseRuleName4Search = (e) => {
        closeRuleName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setCloseRuleCode4Search(closeRuleCode4SearchTmp);
        setCloseRuleName4Search(closeRuleName4SearchTmp);
    }

    // 表格操作相关
    const [closeRuleCode4Edit, setCloseRuleCode4Edit] = useState('');
    const onClickEdit = (selected)=> {
        setCloseRuleCode4Edit(selected);
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
                                            <Input placeholder="规则编码" onChange="onChangeCloseRuleCode4Search"/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规则名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont">
                                            <Input placeholder="规则名称" onChange="onChangeCloseRuleName4Search"/>
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
                                <CloseRuleListBlock closeRuleCode4Search={closeRuleCode4Search} closeRuleName4Search={closeRuleName4Search} onClickEdit={onClickEdit}/>
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <CloseRuleNewModal modalTitle='新建规则' closeRuleCode4Edit={closeRuleCode4Edit} onClose={onCloseNewModal}/>
            )}
        </>
    )
};

export default CloseRulePage;
