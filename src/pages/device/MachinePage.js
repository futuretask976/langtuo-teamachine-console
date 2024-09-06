import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import MachineListBlock from '../../components/device/MachineListBlock'
import MachineNewModal from '../../components/device/MachineNewModal'

const MachinePage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '设备', '机器管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setMachineCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [screenCode4Search, setScreenCode4Search] = useState('');
    const [elecBoardCode4Search, setElecBoardCode4Search] = useState('');
    const [modelCode4Search, setModelCode4Search] = useState('');
    const [shopName4Search, setShopName4Search] = useState('');
    var screenCode4SearchTmp = '';
    var elecBoardCode4SearchTmp = '';
    var modelCode4SearchTmp = '';
    var shopName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(screenCode4SearchTmp, false)) {
            alert('屏幕编码不符合规则');
            return;
        }
        if (!isValidCode(elecBoardCode4SearchTmp, false)) {
            alert('电控板编码不符合规则');
            return;
        }
        if (!isValidCode(modelCode4SearchTmp, false)) {
            alert('型号编码不符合规则');
            return;
        }
        if (!isValidName(shopName4SearchTmp, false)) {
            alert('店铺名称不符合规则');
            return;
        }

        setScreenCode4Search(screenCode4SearchTmp);
        setElecBoardCode4Search(elecBoardCode4SearchTmp);
        setModelCode4Search(modelCode4SearchTmp);
        setShopName4Search(shopName4SearchTmp);
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
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>机器型号：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={5}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="机器型号" onChange={(e) => modelCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
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
                        <Input placeholder="店铺名称" onChange={(e) => shopName4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={17}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <MachineListBlock key={refreshListKey} screenCode4Search={screenCode4Search} elecBoardCode4Search={elecBoardCode4Search} modelCode4Search={modelCode4Search} shopName4Search={shopName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <MachineNewModal onClose={onCloseNewModal} machineCode4Edit={machineCode4Edit} />
            )}
        </>
    )
};

export default MachinePage;
