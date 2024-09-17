import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { DownCircleOutlined, FormOutlined, SearchOutlined, UpCircleOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { getTenantCode, isValidCode, isValidName } from '../../js/common.js';
import { get4Export } from '../../js/request4Export.js'

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TeaListBlock from '../../components/drink/TeaListBlock'
import TeaNewModal from '../../components/drink/TeaNewModal'
import TeaUploadModal from '../../components/drink/TeaUploadModal'

const TeaPage = () => {
    // 面包屑定义
    const breadcrumbPath = ['控制台', '饮品', '茶品管理'];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onClickNew = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setTeaCode4Edit(undefined);
        refreshList();
    }
    const [openUploadModal, setUploadModal] = useState(false);
    const onClickUpload = () => {
        setUploadModal(true);
    };
    const onCloseUploadModal = () => {
        setUploadModal(false);
    }

    // 数据定义
    const [teaCode4Search, setTeaCode4Search] = useState();
    const [teaName4Search, setTeaName4Search] = useState();
    const [teaCode4Edit, setTeaCode4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(teaCode4Search, false)) {
            alert('茶品编码不符合规则');
            return;
        }
        if (!isValidName(teaName4Search, false)) {
            alert('茶品名称不符合规则');
            return;
        }
        refreshList();
    }
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

    // 刷新定义
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
                                <span>茶品编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="茶品编码" allowClear onChange={(e) => setTeaCode4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>茶品名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="茶品名称" allowClear onChange={(e) => setTeaName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onClickNew} style={{width: '90%'}}>新建茶品</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<DownCircleOutlined />} onClick={onExportByExcel} style={{width: '90%'}}>导出</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<UpCircleOutlined />} onClick={onClickUpload} style={{width: '90%'}}>导入</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <TeaListBlock key={refreshListKey} teaCode4Search={teaCode4Search} teaName4Search={teaName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space> 

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
