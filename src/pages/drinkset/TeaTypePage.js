import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TeaTypeListBlock from '../../components/drinkset/TeaTypeListBlock'
import TeaTypeNewModal from '../../components/drinkset/TeaTypeNewModal'

const { Content } = Layout;

const TeaTypePage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['drinkSet'];
    const selectedMenu = ['teaTypeMgt'];
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
        setTeaTypeCode4Edit('');
    }

    // 搜索相关
    
    const [teaTypeCode4Search, setTeaTypeCode4Search] = useState('');
    const [teaTypeName4Search, setTeaTypeName4Search] = useState('');
    var teaTypeCode4SearchTmp = '';
    var teaTypeName4SearchTmp = '';
    const onClickSearch = () => {
        setTeaTypeCode4Search(teaTypeCode4SearchTmp);
        setTeaTypeName4Search(teaTypeName4SearchTmp);
    }

    // 表格操作相关
    const [teaTypeCode4Edit, setTeaTypeCode4Edit] = useState('');
    const onClickEdit = (selectedTeaTypeCode)=> {
        setTeaTypeCode4Edit(selectedTeaTypeCode);
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
                                            <span>类型编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="类型编码" onChange={(e) => teaTypeCode4SearchTmp = e.target.value} style={{width: '95%'}} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>类型名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="类型名称" onChange={(e) => teaTypeName4SearchTmp = e.target.value} style={{width: '95%'}} />
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '80%'}}>新建类型</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <TeaTypeListBlock teaTypeCode4Search={teaTypeCode4Search} teaTypeName4Search={teaTypeName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <TeaTypeNewModal onClose={onCloseNewModal} teaTypeCode4Edit={teaTypeCode4Edit} />
            )}
        </>
    )
};

export default TeaTypePage;
