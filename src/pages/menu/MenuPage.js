import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';
import { applyLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import MenuListBlock from '../../components/menu/MenuListBlock'
import MenuNewModal from '../../components/menu/MenuNewModal'
import MenuDispatchModal from '../../components/menu/MenuDispatchModal'

const MenuPage = () => {
    // 面包屑定义
    const breadcrumbPath = [applyLang('labelConsole'), applyLang('labelDeviceSet'), applyLang('labelMenuMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setMenuCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onClickDispatch = (selectedMenuCode)=> {
        setMenuCode4Dispatch(selectedMenuCode);
        setOpenDispatchModal(true);
    }
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setMenuCode4Dispatch(undefined);
    }

    // 数据定义
    const [menuCode4Search, setMenuCode4Search] = useState();
    const [menuName4Search, setMenuName4Search] = useState();
    const [menuCode4Edit, setMenuCode4Edit] = useState();
    const [menuCode4Dispatch, setMenuCode4Dispatch] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidCode(menuCode4Search, false)) {
            alert(applyLang('msgMenuCodeInvalid'));
            return;
        }
        if (!isValidName(menuName4Search, false)) {
            alert(applyLang('msgMenuNameInvalid'));
            return;
        }
        refreshList();
    }
    const onClickEdit = (selectedMenuCode)=> {
        setMenuCode4Edit(selectedMenuCode);
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
                                <span>{applyLang('promptMenuCode')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMenuCode')} allowClear onChange={(e) => setMenuCode4Search(e.target.value)} style={{width: '95%'}}/>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptMenuName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelMenuName')} allowClear onChange={(e) => setMenuName4Search(e.target.value)} style={{width: '95%'}}/>
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
                    <MenuListBlock key={refreshListKey} menuCode4Search={menuCode4Search} menuName4Search={menuName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>
                </div>
            </Space>

            {openNewModal && (
                <MenuNewModal onClose={onCloseNewModal} menuCode4Edit={menuCode4Edit} />
            )}

            {openDispatchModal && (
                <MenuDispatchModal onClose={onCloseDispatchModal} menuCode4Dispatch={menuCode4Dispatch} />
            )}
        </>
    )
};

export default MenuPage;
