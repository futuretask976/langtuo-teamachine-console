import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Space, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray, isValidCode } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import MachineListBlock from '../../components/device/MachineListBlock'
import MachineNewModal from '../../components/device/MachineNewModal'

const MachinePage = () => {
    // 面包屑相关
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelDeviceSet'), applyLang('labelMachineMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setMachineCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [shopList4Select, setShopList4Select] = useState();
    const [machineCode4Search, setMachineCode4Search] = useState();
    const [screenCode4Search, setScreenCode4Search] = useState();
    const [elecBoardCode4Search, setElecBoardCode4Search] = useState();
    const [shopCode4Search, setShopCode4Search] = useState(null);
    const [machineCode4Edit, setMachineCode4Edit] = useState();

    // 初始化定义
    const fetchShopList4Select = () => {
        get('/shopset/shop/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData == undefined) {
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
        if (!isValidCode(machineCode4Search, false)) {
            alert(applyLang("msgMachineCodeInvalid"));
            return;
        }
        if (!isValidCode(screenCode4Search, false)) {
            alert(applyLang("msgScreenCodeInvalid"));
            return;
        }
        if (!isValidCode(elecBoardCode4Search, false)) {
            alert(applyLang("msgElecBoardCodeInvalid"));
            return;
        }
        if (!isValidCode(shopCode4Search, false)) {
            alert(applyLang("msgShopNameInvalid"));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedMachineCode)=> {
        setMachineCode4Edit(selectedMachineCode);
        setOpenNewModal(true);
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
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang("promptMachineCode")}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang("labelMachineCode")} allowClear onChange={(e) => setMachineCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang("promptScreenCode")}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang("labelScreenCode")} allowClear onChange={(e) => setScreenCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang("promptElecBoardCode")}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang("labelElecBoardCode")} allowClear onChange={(e) => setElecBoardCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang("labelBeginSearch")}</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang("promptShopName")}</span>
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
                        <Col className="gutter-row full-height" span={17}>
                            &nbsp;
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 700}}>
                    <MachineListBlock key={refreshListKey} machineCode4Search={machineCode4Search} screenCode4Search={screenCode4Search} elecBoardCode4Search={elecBoardCode4Search} shopCode4Search={shopCode4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <MachineNewModal onClose={onCloseNewModal} machineCode4Edit={machineCode4Edit} />
            )}
        </>
    )
};

export default MachinePage;
