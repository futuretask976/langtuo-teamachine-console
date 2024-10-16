import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Space, Col, Row } from 'antd';
import { AuditOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray, isValidCode } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';
import { get } from '../../js/request.js';
import { get4Export } from '../../js/request4Export.js'

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import DeployListBlock from '../../components/device/DeployListBlock'
import DeployNewModal from '../../components/device/DeployNewModal'

const DeployPage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelDeviceSet'), applyLang('labelDeployMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setDeployCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [shopList4Select, setShopList4Select] = useState();
    const [deployCode4Search, setDeployCode4Search] = useState();
    const [shopCode4Search, setShopCode4Search] = useState(null);
    const [state4Search, setState4Search] = useState(null);
    const [deployCode4Edit, setDeployCode4Edit] = useState();

    // 动作定义
    const fetchShopList4Select = () => {
        get('/shopset/shop/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData === undefined) {
                return;
            }
            setShopList4Select((prev => {
                let shopListTmp = [{
                    label: applyLang('labelAll'),
                    value: null
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
    const onClickSearch = () => {
        if (!isValidCode(deployCode4Search, false)) {
            alert(applyLang('msgDeployCodeInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedDeployCode)=> {
        setDeployCode4Edit(selectedDeployCode);
        setOpenNewModal(true);
    }
    const onExportByExcel = ()=> {
        get4Export('/deviceset/deploy/export', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData === undefined) {
                return;
            }
            const url4Export = window.URL.createObjectURL(new Blob([respData]));
            const link4Export = document.createElement('a');
            link4Export.href = url4Export;
            link4Export.setAttribute('download', 'export.xlsx');
            document.body.appendChild(link4Export);
            link4Export.click();
            document.body.removeChild(link4Export);
        });
    }
    useEffect(() => {
        fetchShopList4Select();
    }, []);

    // 刷新定义
    const [refreshListKey, setRefreshListKey] = useState(0);
    const refreshList = () => {
        setRefreshListKey(refreshListKey + 1);
    };

    return (
        <>
            <Space className="full-square" direction="vertical" size={15}>
                <div className='flex-row-cont' style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 40}}>
                    <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                </div>
                <div className='flex-col-cont full-width' style={{alignItems: 'center', background: '#FFFFFF', height: 90}}>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptDeployCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelDeployCode')} allowClear onChange={(e) => setDeployCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptShopName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    value={shopCode4Search}
                                    style={{width: '95%'}}
                                    onChange={(e) => setShopCode4Search(e)}
                                    options={shopList4Select}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptDeployState')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    value={state4Search}
                                    style={{width: '95%'}}
                                    onChange={(e) => setState4Search(e)}
                                    options={[
                                        {
                                            label: applyLang('labelAll'),
                                            value: null
                                        },
                                        {
                                            label: applyLang('labelStateDeployed'),
                                            value: '1'
                                        }, {
                                            label: applyLang('labelStateUnDeployed'),
                                            value: '0'
                                        }
                                    ]}
                                />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang('labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{applyLang('labelNew')}</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row" span={21}>
                            &nbsp;
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<AuditOutlined />} onClick={onExportByExcel} style={{width: '90%'}}>{applyLang('labelExport')}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 700}}>
                    <DeployListBlock key={refreshListKey} deployCode4Search={deployCode4Search} shopCode4Search={shopCode4Search} state4Search={state4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>            

            {openNewModal && (
                <DeployNewModal onClose={onCloseNewModal} deployCode4Edit={deployCode4Edit} />
            )}
        </>
    )
};

export default DeployPage;
