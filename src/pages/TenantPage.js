import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Table, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import ClientListBlock from '../components/ClientListBlock'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;
const { TextArea } = Input;

const TenantPage = () => {
    const openMenu = ['userSub'];
    const selectedMenu = ['3'];
    const breadcrumbPath = ['控制台', '用户', '商户管理'];
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSearch = () => {
        alert("onSearch");
    };

    const onCreate = () => {
        showTitleModal();
    };
    
    const showTitleModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
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
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>商户名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="商户名称" />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#fff', height: '100%'}}>
                                            <span>联系人名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="联系人名称" />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onCreate}>新建商户</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <ClientListBlock />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            <Modal
                centered
                open={open}
                title="新建角色"
                onOk={handleOk}
                onCancel={handleCancel}
                width={500}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        提交
                    </Button>,
                ]}
            >
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 410, width: '100%'}}>
                    <div style={{height: 410, width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={10}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>商户名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <Input placeholder="商户名称" />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{height: 20, width: '100%'}}>
                            <Col className="gutter-row" span={22}>
                                &nbsp;
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={10}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>联系人名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <Input placeholder="联系人名称" />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{height: 20, width: '100%'}}>
                            <Col className="gutter-row" span={22}>
                                &nbsp;
                            </Col>
                        </Row> 
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={10}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>联系人电话：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <Input placeholder="联系人电话" />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{height: 20, width: '100%'}}>
                            <Col className="gutter-row" span={22}>
                                &nbsp;
                            </Col>
                        </Row> 
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={10}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>商户超级管理员登录名：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <Input placeholder="商户超级管理员登录名" />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{height: 20, width: '100%'}}>
                            <Col className="gutter-row" span={22}>
                                &nbsp;
                            </Col>
                        </Row> 
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={10}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>商户超级管理员登录密码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <Input placeholder="商户超级管理员登录密码" />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{height: 20, width: '100%'}}>
                            <Col className="gutter-row" span={22}>
                                &nbsp;
                            </Col>
                        </Row> 
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={10}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                                    <span>备注：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                     <TextArea rows={5} placeholder="备注" maxLength={200} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Modal>
        </>
    )
};

export default TenantPage;
