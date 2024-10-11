import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import AndroidAppListBlock from '../../components/device/AndroidAppListBlock'
import AndroidAppUploadModal from '../../components/device/AndroidAppUploadModal'
import AndroidAppDispatchModal from '../../components/device/AndroidAppDispatchModal'

const AndroidAppPage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelDeviceSet'), applyLang('labelAndroidAppMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setVersion4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setVersion4Dispatch(undefined);
    }

    // 数据定义
    const [version4Search, setVersion4Search] = useState();
    const [version4Edit, setVersion4Edit] = useState();
    const [version4Dispatch, setVersion4Dispatch] = useState();
    
    // 动作定义
    const onClickSearch = () => {
        refreshList();
    }
    const onClickEdit = (selectedVersion)=> {
        setVersion4Edit(selectedVersion);
        setOpenNewModal(true);
    }
    const onClickDispatch = (selectedVersion)=> {
        setVersion4Dispatch(selectedVersion);
        setOpenDispatchModal(true);
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
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang("promptVersion")}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang("labelVersion")} onChange={(e) => setVersion4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{applyLang("labelBeginSearch")}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{applyLang("labelNew")}</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <AndroidAppListBlock key={refreshListKey} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch} version4Search={version4Search}/>
                </div>
            </Space>

            {openNewModal && (
                <AndroidAppUploadModal onClose={onCloseNewModal} version4Edit={version4Edit}/>
            )}

            {openDispatchModal && (
                <AndroidAppDispatchModal onClose={onCloseDispatchModal} version4Dispatch={version4Dispatch} />
            )}
        </>
    )
};

export default AndroidAppPage;
