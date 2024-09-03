import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import SpecListBlock from '../../components/drink/SpecListBlock'
import SpecNewModal from '../../components/drink/SpecNewModal'

const { Content } = Layout;

const SpecPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['drinkSet'];
    const selectedMenu = ['specMgt'];
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
        setSpecCode4Edit('');
    }

    // 搜索相关
    const [specCode4Search, setSpecCode4Search] = useState('');
    const [specName4Search, setSpecName4Search] = useState('');
    var specName4SearchTmp = '';
    var specCode4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(specCode4SearchTmp, false)) {
            alert('规格编码不符合规则');
            return;
        }
        if (!isValidName(specName4SearchTmp, false)) {
            alert('规格名称不符合规则');
            return;
        }

        setSpecCode4Search(specCode4SearchTmp);
        setSpecName4Search(specName4SearchTmp);
    }

    // 表格操作相关
    const [specCode4Edit, setSpecCode4Edit] = useState('');
    const onClickEdit = (selectedSpecCode)=> {
        setSpecCode4Edit(selectedSpecCode);
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
                                            <Input placeholder="规格编码" onChange={(e) => specCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>规格名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="规格名称" onChange={(e) => specName4SearchTmp = e.target.value} style={{width: '95%'}}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建规格</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <SpecListBlock specCode4Search={specCode4Search} specName4Search={specName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <SpecNewModal onClose={onCloseNewModal} specCode4Edit={specCode4Edit} />
            )}
        </>
    )
};

export default SpecPage;
