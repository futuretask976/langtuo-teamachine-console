import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Table, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import RoleListBlock from '../components/RoleListBlock'
import FooterBar from '../components/FooterBar'

const { Content } = Layout;

const ToppingPage = () => {
    const openMenu = ['teaSub'];
    const selectedMenu = ['16'];
    const breadcrumbPath = ['控制台', '饮品生产', '配方管理'];
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

    let tableData = [
        {
            opePermGroup: '用户',
            opePermPoints: ['商户管理', '权限点管理', '角色管理', '组织架构管理', '管理员管理']
        },
        {
            opePermGroup: '门店',
            opePermPoints: ['门店组管理', '门店管理']
        },
        {
            opePermGroup: '设备',
            opePermPoints: ['预部署管理', '设备管理', '设备详情管理']
        },
        {
            opePermGroup: '饮品生产',
            opePermPoints: ['物料类型管理', '物料管理', '规格管理', '配方类型管理', '配方管理']
        },
        {
            opePermGroup: '菜单',
            opePermPoints: ['菜单管理', '系列管理', '菜单下发管理']
        },
        {
            opePermGroup: '食安规则',
            opePermPoints: ['营业准备管理', '打烊准备管理', '清洗规则管理', '预警规则管理']
        },
        {
            opePermGroup: '日常报表',
            opePermPoints: ['废料记录管理', '补料记录管理', '清洗记录管理', '订单记录管理']
        }
    ]

    let tableCol = [
        {
            title: '权限分组',
            dataIndex: 'opePermGroup',
            key: 'opePermGroup',
            render: (_, record) => (
                <Checkbox>{record.opePermGroup}</Checkbox>
            ),
        },
        {
            title: '权限点',
            dataIndex: 'opePerm',
            key: 'opePerm',
            render: (_, record) => (
                record.opePermPoints.map((opePermPoint) => {
                    return (
                        <Checkbox>{opePermPoint}</Checkbox>
                    );
                })
            ),
        }
    ];

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
                                            <span>配方名称：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Input placeholder="配方名称" />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onCreate}>新建配方</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <RoleListBlock />
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
                width={1000}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        提交
                    </Button>,
                ]}
            >
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 410, width: '100%'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={2}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <span>角色名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                    <Input placeholder="角色名称" />&nbsp;&nbsp;
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350, width: '100%'}}>
                        <Table columns={tableCol} dataSource={tableData} pagination={false} size={'small'} style={{width: '100%'}} />
                    </div>
                </div>
            </Modal>
        </>
    )
};

export default ToppingPage;
