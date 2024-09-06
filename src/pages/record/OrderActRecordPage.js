import React, { useEffect, useState } from 'react';
import { Button, Select, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode } from '../../js/common.js';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OrderActRecordListBlock from '../../components/record/OrderActRecordListBlock'
import OrderActRecordViewModal from '../../components/record/OrderActRecordViewModal'

const OrderActRecordPage = (props) => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '动作记录', '补料记录管理'];

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
            <OrderActRecordListBlock shopGroupCode4Search={shopGroupCode4Search} shopCode4Search={shopCode4Search} onClickView={onClickView}/>

            {openViewModal && (
                <OrderActRecordViewModal modalTitle='查看明细' idempotentMark4View={idempotentMark4View} onClose={onCloseViewModal}/>
            )}
        </>
    )
};

export default OrderActRecordPage;
