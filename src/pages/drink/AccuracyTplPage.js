import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import AccuracyTplListBlock from '../../components/drink/AccuracyTplListBlock'
import AccuracyTplNewModal from '../../components/drink/AccuracyTplNewModal'

const AccuracyTplPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '饮品', '规格管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setTemplateCode4Edit('');
        refreshList();
    }

    // 搜索相关
    const [templateCode4Search, setTemplateCode4Search] = useState('');
    const [templateName4Search, setTemplateName4Search] = useState('');
    var templateCode4SearchTmp = '';
    var templateName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(templateCode4SearchTmp, false)) {
            alert('模板编码不符合规则');
            return;
        }
        if (!isValidName(templateName4SearchTmp, false)) {
            alert('模板名称不符合规则');
            return;
        }

        setTemplateCode4Search(templateCode4SearchTmp);
        setTemplateName4Search(templateName4SearchTmp);
    }

    // 表格操作相关
    const [templateCode4Edit, setTemplateCode4Edit] = useState('');
    const onClickEdit = (selectedTemplateCode)=> {
        setTemplateCode4Edit(selectedTemplateCode);
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
                        <Input placeholder="规格编码" onChange={(e) => templateCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>规格名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="规格名称" onChange={(e) => templateName4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建模板</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <AccuracyTplListBlock key={refreshListKey} templateCode4Search={templateCode4Search} templateName4Search={templateName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <AccuracyTplNewModal onClose={onCloseNewModal} templateCode4Edit={templateCode4Edit} />
            )}
        </>
    )
};

export default AccuracyTplPage;
