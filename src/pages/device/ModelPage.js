import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode } from '../../js/common';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import ModelListBlock from '../../components/device/ModelListBlock'
import ModelNewModal from '../../components/device/ModelNewModal'

const ModelPage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelDeviceSet'), applyLang('labelModelMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onCreateNewModelModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModelModal = (refresh) => {
        setOpenNewModal(false);
        setModelCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [modelCode4Search, setModelCode4Search] = useState();
    const [modelCode4Edit, setModelCode4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(modelCode4Search, false)) {
            alert(applyLang('msgModelCodeInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedModelCode)=> {
        setModelCode4Edit(selectedModelCode);
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
                                <span>{applyLang('promptModelCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelModelCode')} allowClear onChange={(e) => setModelCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang('labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onCreateNewModelModal} style={{width: '90%'}}>{applyLang('labelNew')}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <ModelListBlock key={refreshListKey} modelCode4Search={modelCode4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <ModelNewModal onClose={onCloseNewModelModal} modelCode4Edit={modelCode4Edit} />
            )}
        </>
    )
};

export default ModelPage;
