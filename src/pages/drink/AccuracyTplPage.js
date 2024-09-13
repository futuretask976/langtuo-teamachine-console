import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
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
    const onClickSearch = () => {
        if (!isValidCode(templateCode4Search, false)) {
            alert('模板编码不符合规则');
            return;
        }
        if (!isValidName(templateName4Search, false)) {
            alert('模板名称不符合规则');
            return;
        }
        refreshList();
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
            <Space className="full-square" direction="vertical" size={15}>
                <div className='flex-row-cont' style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 40}}>
                    <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                </div>
                <div className='flex-col-cont full-width' style={{alignItems: 'center', background: '#FFFFFF', height: 50}}>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>规格编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="规格编码" allowClear onChange={(e) => setTemplateCode4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>规格名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="规格名称" allowClear onChange={(e) => setTemplateName4Search(e.target.value)}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建模板</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={12}>
                            &nbsp;
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <AccuracyTplListBlock key={refreshListKey} templateCode4Search={templateCode4Search} templateName4Search={templateName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <AccuracyTplNewModal onClose={onCloseNewModal} templateCode4Edit={templateCode4Edit} />
            )}
        </>
    )
};

export default AccuracyTplPage;
