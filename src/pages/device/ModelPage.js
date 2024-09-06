import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ModelListBlock from '../../components/device/ModelListBlock'
import ModelNewModal from '../../components/device/ModelNewModal'

const ModelPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '设备元数据', '设备型号管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onCreateNewModelModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModelModal = () => {
        setOpenNewModal(false);
        setModelCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [modelCode4Search, setModelCode4Search] = useState('');
    var modelCode4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(modelCode4SearchTmp, false)) {
            alert('型号编码不符合规则');
            return;
        }

        setModelCode4Search(modelCode4SearchTmp);
    }

    // 表格操作相关
    const [modelCode4Edit, setModelCode4Edit] = useState('');
    const onClickEdit = (selectedModelCode)=> {
        setModelCode4Edit(selectedModelCode);
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
                        <span>型号编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="型号编码" onChange={(e) => modelCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onCreateNewModelModal} style={{width: '90%'}}>新建型号</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <ModelListBlock key={refreshListKey} modelCode4Search={modelCode4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <ModelNewModal onClose={onCloseNewModelModal} modelCode4Edit={modelCode4Edit} />
            )}
        </>
    )
};

export default ModelPage;
