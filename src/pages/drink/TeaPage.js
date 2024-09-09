import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { DownCircleOutlined, FormOutlined, SearchOutlined, UpCircleOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isValidCode, isValidName } from '../../js/common.js';
import { get4Export } from '../../js/request4Export.js'

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TeaListBlock from '../../components/drink/TeaListBlock'
import TeaNewModal from '../../components/drink/TeaNewModal'
import TeaUploadModal from '../../components/drink/TeaUploadModal'

const TeaPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '饮品', '茶品管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onClickNew = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setTeaCode4Edit('');
        refreshList();
    }
    const [openUploadModal, setUploadModal] = useState(false);
    const onClickUpload = () => {
        setUploadModal(true);
    };
    const onCloseUploadModal = () => {
        setUploadModal(false);
    }

    // 搜索相关
    const [teaCode4Search, setTeaCode4Search] = useState('');
    const [teaName4Search, setTeaName4Search] = useState('');
    var teaCode4SearchTmp = '';
    var teaName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(teaCode4SearchTmp, false)) {
            alert('茶品编码不符合规则');
            return;
        }
        if (!isValidName(teaName4SearchTmp, false)) {
            alert('茶品名称不符合规则');
            return;
        }

        setTeaCode4Search(teaCode4SearchTmp);
        setTeaName4Search(teaName4SearchTmp);
    }

    // 表格操作相关
    const [teaCode4Edit, setTeaCode4Edit] = useState('');
    const onClickEdit = (selectedTeaCode)=> {
        setTeaCode4Edit(selectedTeaCode);
        setOpenNewModal(true);
    }
    const onExportByExcel = ()=> {
        get4Export('/drinkset/tea/export', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            const url4Export = window.URL.createObjectURL(new Blob([respData]));
            const link4Export = document.createElement('a');
            link4Export.href = url4Export;
            link4Export.setAttribute('download', 'export.xlsx');
            document.body.appendChild(link4Export);
            link4Export.click();
            document.body.removeChild(link4Export);
        });
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
                        <span>茶品编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="茶品编码" allowClear onChange={(e) => teaCode4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>茶品名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="茶品名称" allowClear onChange={(e) => teaName4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onClickNew} style={{width: '90%'}}>新建茶品</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<DownCircleOutlined />} onClick={onExportByExcel} style={{width: '90%'}}>导出</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<UpCircleOutlined />} onClick={onClickUpload} style={{width: '90%'}}>导入</Button>
                    </div>
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <TeaListBlock key={refreshListKey} teaCode4Search={teaCode4Search} teaName4Search={teaName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <TeaNewModal onClose={onCloseNewModal} teaCode4Edit={teaCode4Edit} />
            )}

            {openUploadModal && (
                <TeaUploadModal onClose={onCloseUploadModal} />
            )}
        </>
    )
};

export default TeaPage;
