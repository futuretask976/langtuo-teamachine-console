import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isArray, isValidCode } from '../../js/common.js';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import MachineListBlock from '../../components/device/MachineListBlock'
import MachineNewModal from '../../components/device/MachineNewModal'

const MachinePage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '设备', '机器管理'];

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
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setMachineCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [machineCode4Search, setMachineCode4Search] = useState('');
    const [screenCode4Search, setScreenCode4Search] = useState('');
    const [elecBoardCode4Search, setElecBoardCode4Search] = useState('');
    const [shopCode4Search, setShopCode4Search] = useState('');
    const [shopCode4SearchTmp, setShopCode4SearchTmp] = useState('');
    let machineCode4SearchTmp = '';
    let screenCode4SearchTmp = '';
    let elecBoardCode4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(machineCode4SearchTmp, false)) {
            alert('机器编码不符合规则');
            return;
        }
        if (!isValidCode(screenCode4SearchTmp, false)) {
            alert('屏幕编码不符合规则');
            return;
        }
        if (!isValidCode(elecBoardCode4SearchTmp, false)) {
            alert('电控板编码不符合规则');
            return;
        }
        if (!isValidCode(shopCode4SearchTmp, false)) {
            alert('店铺名称不符合规则');
            return;
        }

        setMachineCode4Search(machineCode4SearchTmp);
        setScreenCode4Search(screenCode4SearchTmp);
        setElecBoardCode4Search(elecBoardCode4SearchTmp);
        setShopCode4Search(shopCode4SearchTmp);
    }

    // 表格操作相关
    const [machineCode4Edit, setMachineCode4Edit] = useState('');
    const onClickEdit = (selectedMachineCode)=> {
        setMachineCode4Edit(selectedMachineCode);
        setOpenNewModal(true);
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
                        <span>机器编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={5}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="机器编码" onChange={(e) => machineCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>屏幕编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={5}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="屏幕编码" onChange={(e) => screenCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>控制板编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={5}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="控制板编码" onChange={(e) => elecBoardCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff'}}>&nbsp;</Row>
            <Row style={{backgroundColor: '#fff'}}>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>店铺名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={5}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Select
                            value={shopCode4SearchTmp}
                            style={{width: '95%'}}
                            onChange={(e) => setShopCode4SearchTmp(e)}
                            options={shopList4Select}
                        />
                    </div>
                </Col>
                <Col className="gutter-row" span={17}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <MachineListBlock key={refreshListKey} machineCode4Search={machineCode4Search} screenCode4Search={screenCode4Search} elecBoardCode4Search={elecBoardCode4Search} shopCode4Search={shopCode4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <MachineNewModal onClose={onCloseNewModal} machineCode4Edit={machineCode4Edit} />
            )}
        </>
    )
};

export default MachinePage;
