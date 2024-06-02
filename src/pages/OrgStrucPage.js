import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Input, Layout, Modal, Select, Space, Table, Tree, Col, Row } from 'antd';
import { FormOutlined, MinusCircleOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';

import HeaderBar from '../components/HeaderBar'
import SiderMenu from '../components/SiderMenu'
import BreadcrumbBlock from "../components/BreadcrumbBlock"
import OrgStrucListBlock from '../components/OrgStrucListBlock'
import FooterBar from '../components/FooterBar'

import EditableTree from '../components/EditableTree'

const { Content } = Layout;

const OrgStrucPage = () => {
    const openMenu = ['userSub'];
    const selectedMenu = ['4'];
    const breadcrumbPath = ['控制台', '用户', '组织架构管理'];
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientNameVal, setClientNameVal] = useState();
    const [testTreeData, setTestTreeData] = useState([
        { 
            title: '0-0', 
            key: '0-0', 
            children: [
                { 
                    title: '0-0-0', 
                    key: '0-0-0' 
                }
            ] 
        },
        { 
            title: '0-1', 
            key: '0-1' 
        },
    ]);

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

    const onClientNameChange = (newClientNameVal) => {
        setClientNameVal(newClientNameVal);
    };

    let clientData = [
        {
            value: 'HU_SHANG_A_YI',
            label: '沪上阿姨'
        },
        {
            value: 'JUAN_CHA',
            label: '眷茶'
        },
        {
            value: 'BA_WANG_CHA_JI',
            label: '霸王茶姬'
        }
    ];

    // 添加节点
    const addTestTreeNode = (parentKey, newNode) => {
        let updatedTestTreeData = [...testTreeData];
        const parent = updatedTestTreeData.find((node) => node.key === parentKey);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(newNode);
        } else {
            updatedTestTreeData.push(newNode);
        }
        setTestTreeData(updatedTestTreeData);
    };
    
    // 删除节点
    const removeTestTreeNode = (key) => {
        let updatedTestTreeData = [...testTreeData];
        const nodeIndex = updatedTestTreeData.findIndex((node) => node.key === key);
        if (nodeIndex > -1) {
            updatedTestTreeData.splice(nodeIndex, 1);
            setTestTreeData(updatedTestTreeData);
        }
    };
    
    // 渲染树节点
    const renderTestTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <>
                        <Tree.TreeNode title={item.title} key={item.key}>
                            {renderTestTreeNodes(item.children)}
                            <a>aaaa</a>
                        </Tree.TreeNode>
                    </>
                );
            }
            return (
                <Tree.TreeNode title={'8888'} key={item.key}>
                    <a>bbbb</a>
                </Tree.TreeNode>
            );
        });
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
                                        <Select
                                            defaultValue={clientNameVal}
                                            style={{width: '100%'}}
                                            onChange={onClientNameChange}
                                            options={clientData}
                                        />&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />}>开始搜索</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: '100%'}}>
                                            <Button type="primary" icon={<FormOutlined />} onClick={onCreate}>编辑架构</Button>&nbsp;&nbsp;
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={15}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <OrgStrucListBlock />
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            <Modal
                centered
                open={open}
                title="编辑组织架构"
                onOk={handleOk}
                onCancel={handleCancel}
                width={400}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        提交
                    </Button>,
                ]}
            >
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: 300, width: '100%', border: '1px solid red'}}>
                    <EditableTree />
                </div>
            </Modal>
        </>
    )
};

export default OrgStrucPage;
