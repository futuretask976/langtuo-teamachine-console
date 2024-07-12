import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../css/common.css';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import TeaListBlock from '../components/TeaListBlock'
import TeaNewModal from '../components/TeaNewModal'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;

const TeaPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['drinkSet'];
    const selectedMenu = ['15'];
    const breadcrumbPath = ['控制台', '饮品', '茶品类型管理'];

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
        setTeaCode4Edit('');
    }

    // 搜索相关
    var teaCode4SearchTmp = '';
    const [teaCode4Search, setTeaCode4Search] = useState('');
    const onChangeTeaCode4Search = (e) => {
        teaCode4SearchTmp = e.target.value;
    }
    var teaName4SearchTmp = '';
    const [teaName4Search, setTeaName4Search] = useState('');
    const onChangeTeaName4Search = (e) => {
        teaName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setTeaCode4Search(teaCode4SearchTmp);
        setTeaName4Search(teaName4SearchTmp);
    }

    // 表格操作相关
    const [teaCode4Edit, setTeaCode4Edit] = useState('');
    const onClickEdit = (selectedTeaCode)=> {
        setTeaCode4Edit(selectedTeaCode);
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
                                            <span>茶品编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="茶品编码" onChange={onChangeTeaCode4Search} style={{width: '95%'}} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>茶品名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="茶品名称" onChange={onChangeTeaName4Search} style={{width: '95%'}} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '80%'}}>新建茶品</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <TeaListBlock teaCode4Search={teaCode4Search} teaName4Search={teaName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <TeaNewModal onClose={onCloseNewModal} teaCode4Edit={teaCode4Edit} />
            )}
        </>
    )
};

export default TeaPage;
