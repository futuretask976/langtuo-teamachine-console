import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import SpecListBlock from '../../components/drink/SpecListBlock'
import SpecNewModal from '../../components/drink/SpecNewModal'

const SpecPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '饮品', '规格管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setSpecCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [specCode4Search, setSpecCode4Search] = useState('');
    const [specName4Search, setSpecName4Search] = useState('');

    // 初始化动作
    const onClickSearch = () => {
        if (!isValidCode(specCode4Search, false)) {
            alert('规格编码不符合规则');
            return;
        }
        if (!isValidName(specName4Search, false)) {
            alert('规格名称不符合规则');
            return;
        }
        refreshList();
    }

    // 表格操作相关
    const [specCode4Edit, setSpecCode4Edit] = useState('');
    const onClickEdit = (selectedSpecCode)=> {
        setSpecCode4Edit(selectedSpecCode);
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
                        <span>规格编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="规格编码" allowClear onChange={(e) => setSpecCode4Search(e.target.value)} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>规格名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="规格名称" allowClear onChange={(e) => setSpecName4Search(e.target.value)} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建规格</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <SpecListBlock key={refreshListKey} specCode4Search={specCode4Search} specName4Search={specName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <SpecNewModal onClose={onCloseNewModal} specCode4Edit={specCode4Edit} />
            )}
        </>
    )
};

export default SpecPage;
