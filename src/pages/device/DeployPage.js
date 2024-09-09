import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Col, Row } from 'antd';
import { AuditOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray, isValidCode } from '../../js/common.js';
import { get } from '../../js/request.js';
import { get4Export } from '../../js/request4Export.js'

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import DeployListBlock from '../../components/device/DeployListBlock'
import DeployNewModal from '../../components/device/DeployNewModal'

const DeployPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '设备', '预部署管理'];

    // 数据初始化
    const [shopList4Select, setShopList4Select] = useState([]);
    const fetchShopList4Select = () => {
        get('/shopset/shop/listbyadminorg', {
            tenantCode: getTenantCode()
        }).then(respData => {
            setShopList4Select((prev => {
                let shopListTmp = [{
                    label: '全部',
                    value: ''
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        shopListTmp.push({
                            label: item.shopName,
                            value: item.shopCode
                        });
                    });
                }
                return shopListTmp;
            }));
        });
    }
    useEffect(() => {
        fetchShopList4Select();
    }, []);

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setDeployCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [deployCode4Search, setDeployCode4Search] = useState('');
    const [shopCode4Search, setShopCode4Search] = useState('');
    const [shopCode4SearchTmp, setShopCode4SearchTmp] = useState('');
    const [state4Search, setState4Search] = useState('');
    const [state4SearchTmp, setState4SearchTmp] = useState('');
    let deployCode4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(deployCode4SearchTmp, false)) {
            alert('部署编码不符合规则');
            return;
        }
        if (!isValidCode(shopCode4SearchTmp, false)) {
            alert('店铺名称不符合规则');
            return;
        }
        if (!isValidCode(state4SearchTmp, false)) {
            alert('状态不符合规则');
            return;
        }

        setDeployCode4Search(deployCode4SearchTmp);
        setShopCode4Search(shopCode4SearchTmp);
        setState4Search(state4SearchTmp);
    }

    // 表格操作相关
    const [deployCode4Edit, setDeployCode4Edit] = useState('');
    const onClickEdit = (selectedDeployCode)=> {
        setDeployCode4Edit(selectedDeployCode);
        setOpenNewModal(true);
    }
    const onExportByExcel = ()=> {
        get4Export('/deviceset/deploy/export', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            const url4Export = window.URL.createObjectURL(new Blob([respData]));
            const link4Export = document.createElement('a');
            link4Export.href = url4Export;
            link4Export.setAttribute('download', 'export.xlsx');
            document.body.appendChild(link4Export);
            link4Export.click();
            document.body.removeChild(link4Export);
        });
    }

    // 刷新列表相关
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#fff'}}>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>部署编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="部署编码" onChange={(e) => deployCode4SearchTmp = e.target.value}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>店铺名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Select
                            value={shopCode4SearchTmp}
                            style={{width: '95%'}}
                            onChange={(e) => setShopCode4SearchTmp(e)}
                            options={shopList4Select}
                        />
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>部署状态：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Select
                            value={state4SearchTmp}
                            style={{width: '95%'}}
                            onChange={(e) => setState4SearchTmp(e)}
                            options={[
                                {
                                    label: '全部',
                                    value: ''
                                },
                                {
                                    label: '已部署',
                                    value: '1'
                                }, {
                                    label: '未部署',
                                    value: '0'
                                }
                            ]}
                        />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建部署码</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#fff'}}>
                <Col className="gutter-row" span={21}>
                    &nbsp;
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<AuditOutlined />} onClick={onExportByExcel} style={{width: '90%'}}>导出</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <DeployListBlock key={refreshListKey} deployCode4Search={deployCode4Search} shopCode4Search={shopCode4Search} state4Search={state4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <DeployNewModal onClose={onCloseNewModal} deployCode4Edit={deployCode4Edit} />
            )}
        </>
    )
};

export default DeployPage;
