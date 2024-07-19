import React, { useState } from 'react';
import { Button, Flex, Input, Layout, Modal, Radio, Select, Space, Steps, Table, Col, Row, message, theme } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import SeriesListBlock from '../../components/menuset/SeriesListBlock'
import SeriesNewModal from '../../components/menuset/SeriesNewModal'

const { Content } = Layout;

const SeriesPage = () => {
    // 导航菜单 + 面包屑相关
    const openMenu = ['menuSet'];
    const selectedMenu = ['18'];
    const breadcrumbPath = ['控制台', '菜单', '系列管理'];

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
        setSeriesCode4Edit('');
    }

    // 搜索相关
    var seriesCode4SearchTmp = '';
    const [seriesCode4Search, setSeriesCode4Search] = useState('');
    const onChangeSeriesCode4Search = (e) => {
        seriesCode4SearchTmp = e.target.value;
    }
    var seriesName4SearchTmp = '';
    const [seriesName4Search, setSeriesName4Search] = useState('');
    const onChangeSeriesName4Search = (e) => {
        seriesName4SearchTmp = e.target.value;
    }
    const onClickSearch = () => {
        setSeriesCode4Search(seriesCode4SearchTmp);
        setSeriesName4Search(seriesName4SearchTmp);
    }

    // 表格操作相关
    const [seriesCode4Edit, setSeriesCode4Edit] = useState('');
    const onClickEdit = (selectedSeriesCode)=> {
        setSeriesCode4Edit(selectedSeriesCode);
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
                                            <span>系列编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="物料编码" onClick={onChangeSeriesCode4Search} style={{width: '95%'}}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>系列名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                            <Input placeholder="物料名称" onClick={onChangeSeriesName4Search} style={{width: '95%'}}/>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '80%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont">
                                            <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '80%'}}>新建系列</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <SeriesListBlock seriesCode4Search={seriesCode4Search} seriesName4Search={seriesName4Search} onClickEdit={onClickEdit} />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openNewModal && (
                <SeriesNewModal onClose={onCloseNewModal} seriesCode4Edit={seriesCode4Edit} />
            )}
        </>
    )
};

export default SeriesPage;
