import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TeaTypeListBlock from '../../components/drink/TeaTypeListBlock'
import TeaTypeNewModal from '../../components/drink/TeaTypeNewModal'

const TeaTypePage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '饮品', '茶品类型管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setTeaTypeCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [teaTypeCode4Search, setTeaTypeCode4Search] = useState('');
    const [teaTypeName4Search, setTeaTypeName4Search] = useState('');

    // 搜索
    const onClickSearch = () => {
        if (!isValidCode(teaTypeCode4Search, false)) {
            alert('茶品类型编码不符合规则');
            return;
        }
        if (!isValidName(teaTypeName4Search, false)) {
            alert('茶品类型名称不符合规则');
            return;
        }
        refreshList();
    }

    // 表格操作相关
    const [teaTypeCode4Edit, setTeaTypeCode4Edit] = useState('');
    const onClickEdit = (selectedTeaTypeCode)=> {
        setTeaTypeCode4Edit(selectedTeaTypeCode);
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
                        <span>类型编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="类型编码" allowClear onChange={(e) => setTeaTypeCode4Search(e.target.value)} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>类型名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="类型名称" allowClear onChange={(e) => setTeaTypeName4Search(e.target.value)} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建类型</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={6}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <TeaTypeListBlock key={refreshListKey} teaTypeCode4Search={teaTypeCode4Search} teaTypeName4Search={teaTypeName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <TeaTypeNewModal onClose={onCloseNewModal} teaTypeCode4Edit={teaTypeCode4Edit} />
            )}
        </>
    )
};

export default TeaTypePage;
