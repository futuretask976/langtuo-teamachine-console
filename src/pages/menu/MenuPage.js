import React, { useState } from 'react';
import { Button, Input, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidCode, isValidName } from '../../js/common.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import MenuListBlock from '../../components/menu/MenuListBlock'
import MenuNewModal from '../../components/menu/MenuNewModal'
import MenuDispatchModal from '../../components/menu/MenuDispatchModal'

const MenuPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '菜单', '菜单管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setMenuCode4Edit('');
    }

    // 分发对话框相关
    const [openDispatchModal, setOpenDispatchModal] = useState(false);
    const onCloseDispatchModal = () => {
        setOpenDispatchModal(false);
        setMenuCode4Dispatch('');
        refreshList();
    }

    // 搜索相关
    const [menuCode4Search, setMenuCode4Search] = useState('');
    const [menuName4Search, setMenuName4Search] = useState('');
    var menuCode4SearchTmp = '';
    var menuName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidCode(menuCode4SearchTmp, false)) {
            alert('菜单编码不符合规则');
            return;
        }
        if (!isValidName(menuName4SearchTmp, false)) {
            alert('菜单名称不符合规则');
            return;
        }

        setMenuCode4Search(menuCode4SearchTmp);
        setMenuName4Search(menuName4SearchTmp);
    }

    // 表格操作相关
    const [menuCode4Edit, setMenuCode4Edit] = useState('');
    const onClickEdit = (selectedMenuCode)=> {
        setMenuCode4Edit(selectedMenuCode);
        setOpenNewModal(true);
    }
    const [menuCode4Dispatch, setMenuCode4Dispatch] = useState('');
    const onClickDispatch = (selectedMenuCode)=> {
        setMenuCode4Dispatch(selectedMenuCode);
        setOpenDispatchModal(true);
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
                        <span>菜单编码：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="菜单编码" onClick={(e) => menuCode4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>菜单名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="菜单名称" onClick={(e) => menuName4SearchTmp = e.target.value} style={{width: '95%'}}/>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建菜单</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <MenuListBlock key={refreshListKey} menuCode4Search={menuCode4Search} menuName4Search={menuName4Search} onClickEdit={onClickEdit} onClickDispatch={onClickDispatch}/>

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
