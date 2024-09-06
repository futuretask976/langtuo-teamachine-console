import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ToppingTypeListBlock from '../../components/drink/ToppingTypeListBlock'
import ToppingTypeNewModal from '../../components/drink/ToppingTypeNewModal'

const ToppingTypePage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '饮品', '物料类型管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setToppingTypeCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [toppingTypeCode4Search, setToppingTypeCode4Search] = useState('');
    const [toppingTypeName4Search, setToppingTypeName4Search] = useState('');
    var toppingTypeCode4SearchTmp = '';
    var toppingTypeName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(toppingTypeCode4SearchTmp, false)) {
            alert('物料类型编码不符合规则');
            return;
        }
        if (!isValidName(toppingTypeName4SearchTmp, false)) {
            alert('物料类型名称不符合规则');
            return;
        }

        setToppingTypeCode4Search(toppingTypeCode4SearchTmp);
        setToppingTypeName4Search(toppingTypeName4SearchTmp);
    }

    // 表格操作相关
    const [toppingTypeCode4Edit, setToppingTypeCode4Edit] = useState('');
    const onClickEdit = (selectedToppingTypeCode)=> {
        setToppingTypeCode4Edit(selectedToppingTypeCode);
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
                        <Input placeholder="物料类型编码" onChange={(e) => toppingTypeCode4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>类型名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="物料类型名称" onChange={(e) => toppingTypeName4SearchTmp = e.target.value} style={{width: '95%'}} />
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
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <ToppingTypeListBlock key={refreshListKey} toppingTypeCode4Search={toppingTypeCode4Search} toppingTypeName4Search={toppingTypeName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <ToppingTypeNewModal onClose={onCloseNewModal} toppingTypeCode4Edit={toppingTypeCode4Edit} />
            )}
        </>
    )
};

export default ToppingTypePage;
