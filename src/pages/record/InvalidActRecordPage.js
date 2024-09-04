import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Button, Flex, Layout, Select, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

import HeaderBar from '../../components/HeaderBar'
import SiderMenu from '../../components/SiderMenu'
import FooterBar from '../../components/FooterBar'
import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import InvalidActRecordListBlock from '../../components/record/InvalidActRecordListBlock'
import InvalidActRecordViewModal from '../../components/record/InvalidActRecordViewModal'
import { handleRespError } from '../../js/common';

const { Content } = Layout;

const InvalidActRecordPage = (props) => {
    // 路由组件
    const navigate = useNavigate();

    // 导航菜单 + 面包屑相关
    const openMenu = ['recordSet'];
    const selectedMenu = ['invalidActRecordMgt'];
    const breadcrumbPath = ['控制台', '动作记录', '废料记录管理'];

    // 页面样式相关
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    // 数据初始化
    const [shopList4Select, setShopList4Select] = useState([]);
    const [shopGroupList4Select, setShopGroupList4Select] = useState([]);
    const fetchShopList4Select = () => {
        get('/shopset/shop/listbyadminorg', {
            tenantCode: getTenantCode()
        }).then(resp => {
            let shopList = Array.from(resp.model);
            setShopList4Select((prev => {
                let shopListTmp = [{
                    label: '全部',
                    value: ''
                }];
                shopList.forEach(item => {
                    shopListTmp.push({
                        label: item.shopName,
                        value: item.shopCode
                    });
                });
            }));
        });
    }
    const fetchShopGroupList4Select = () => {
        get('/shopset/shop/group/listbyadminorg', {
            tenantCode: getTenantCode()
        }).then(resp => {
            let shopGroupList = Array.from(resp.model);
            setShopGroupList4Select((prev => {
                let shopGroupListTmp = [{
                    label: '全部',
                    value: ''
                }];
                shopGroupList.forEach(item => {
                    shopGroupListTmp.push({
                        label: item.shopGroupName,
                        value: item.shopGroupCode
                    });
                })
                return shopGroupListTmp;
            }));
        });
    }
    useEffect(() => {
        fetchShopList4Select();
        fetchShopGroupList4Select();
    }, []);

    // 新建对话框相关
    const [openViewModal, setOpenViewModal] = useState(false);
    const onCloseViewModal = () => {
        setOpenViewModal(false);
        setIdempotentMark4View('');
    }

    // 搜索相关
    const [shopGroupCode4SearchTmp, setShopGroupCode4SearchTmp] = useState('');
    const [shopCode4SearchTmp, setShopCode4SearchTmp] = useState('');
    const [shopGroupCode4Search, setShopGroupCode4Search] = useState('');
    const [shopCode4Search, setShopCode4Search] = useState('');
    const onClickSearch = () => {
        setShopGroupCode4Search(shopGroupCode4SearchTmp);
        setShopCode4Search(shopCode4SearchTmp);
    }

    // 表格操作相关
    const [idempotentMark4View, setIdempotentMark4View] = useState('');
    const onClickView = (selectedIdempotentMark)=> {
        setIdempotentMark4View(selectedIdempotentMark);
        setOpenViewModal(true);
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
                                <Row style={{backgroundColor: '#FFFFFF'}}>&nbsp;</Row>
                                <Row style={{backgroundColor: '#FFFFFF'}}>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{ justifyContent: 'flex-end', height: '100%'}}>
                                            <span>店铺组编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <Select
                                            value={shopGroupCode4SearchTmp}
                                            style={{width: '95%'}}
                                            onChange={(e) => setShopGroupCode4SearchTmp(e)}
                                            options={shopGroupList4Select}
                                        />
                                    </Col>
                                    <Col className="gutter-row" span={2}>
                                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                            <span>店铺编码：</span>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={4}>
                                        <Select
                                            value={shopCode4SearchTmp}
                                            style={{width: '95%'}}
                                            onChange={(e) => setShopCode4SearchTmp(e)}
                                            options={shopList4Select}
                                        />
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div className="flex-row-cont" style={{height: '100%'}}>
                                            <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                                        </div>
                                    </Col>
                                    <Col className="gutter-row" span={9}>
                                        &nbsp;
                                    </Col>
                                </Row>
                                <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
                                <div>&nbsp;</div>
                                <InvalidActRecordListBlock shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search} onClickView={onClickView}/>
                            </Content>
                        </Layout>
                    </Layout>
                    <FooterBar />
                </Layout>
            </Flex>

            {openViewModal && (
                <InvalidActRecordViewModal modalTitle='查看明细' idempotentMark4View={idempotentMark4View} onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default InvalidActRecordPage;
