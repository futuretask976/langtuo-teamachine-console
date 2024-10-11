import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import TeaTypeListBlock from '../../components/drink/TeaTypeListBlock'
import TeaTypeNewModal from '../../components/drink/TeaTypeNewModal'

const TeaTypePage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelDeviceSet'), applyLang('labelTeaTypeMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setTeaTypeCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [teaTypeCode4Search, setTeaTypeCode4Search] = useState();
    const [teaTypeName4Search, setTeaTypeName4Search] = useState();
    const [teaTypeCode4Edit, setTeaTypeCode4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(teaTypeCode4Search, false)) {
            alert(applyLang('msgTeaTypeCodeInvalid'));
            return;
        }
        if (!isValidName(teaTypeName4Search, false)) {
            alert(applyLang('msgTeaTypeNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedTeaTypeCode)=> {
        setTeaTypeCode4Edit(selectedTeaTypeCode);
        setOpenNewModal(true);
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
                                <span>{applyLang('promptTeaTypeCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelTeaTypeCode')} allowClear onChange={(e) => setTeaTypeCode4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptTeaTypeName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelTeaTypeName')} allowClear onChange={(e) => setTeaTypeName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang('labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{applyLang('labelNew')}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <TeaTypeListBlock key={refreshListKey} teaTypeCode4Search={teaTypeCode4Search} teaTypeName4Search={teaTypeName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <TeaTypeNewModal onClose={onCloseNewModal} teaTypeCode4Edit={teaTypeCode4Edit} />
            )}
        </>
    )
};

export default TeaTypePage;
