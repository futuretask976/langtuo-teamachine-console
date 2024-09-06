import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ToppingListBlock from '../../components/drink/ToppingListBlock'
import ToppingNewModal from '../../components/drink/ToppingNewModal'

const ToppingPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '饮品', '物料管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setToppingCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [toppingCode4Search, setToppingCode4Search] = useState('');
    const [toppingName4Search, setToppingName4Search] = useState('');
    var toppingCode4SearchTmp = '';
    var toppingName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(toppingCode4SearchTmp, false)) {
            alert('物料编码不符合规则');
            return;
        }
        if (!isValidName(toppingName4SearchTmp, false)) {
            alert('物料名称不符合规则');
            return;
        }

        setToppingCode4Search(toppingCode4SearchTmp);
        setToppingName4Search(toppingName4SearchTmp);
    }

    // 表格操作相关
    const [toppingCode4Edit, setToppingCode4Edit] = useState('');
    const onClickEdit = (selectedToppingCode)=> {
        setToppingCode4Edit(selectedToppingCode);
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
                        <span>物料编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="物料编码" onChange={(e) => toppingCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>物料名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="物料名称" onChange={(e) => toppingName4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建物料</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <ToppingListBlock key={refreshListKey} toppingCode4Search={toppingCode4Search} toppingName4Search={toppingName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <ToppingNewModal onClose={onCloseNewModal} toppingCode4Edit={toppingCode4Edit} />
            )}
        </>
    )
};

export default ToppingPage;
