import React, { useState } from 'react';
import { Button, Input, Layout, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import AdminListBlock from '../../components/user/AdminListBlock'
import AdminNewModal from '../../components/user/AdminNewModal'

const AdminPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '用户', '管理员管理'];

    // 页面样式相关
    const layoutStyle = {
        height: 1000,
        overflow: 'hidden',
        width: 'calc(100% - 5px)',
        maxWidth: 'calc(100% - 5px)',
        border: '0px solid red',
    };

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setLoginName4Edit('');
        refreshList();
    }

    // 搜索相关
    const [roleName4Search, setRoleName4Search] = useState('');
    const [loginName4Search, setLoginName4Search] = useState('');
    var roleName4SearchTmp = '';
    var loginName4SearchTmp = '';
    const onClickSearch = () => {
        if (!isValidName(loginName4SearchTmp, false)) {
            alert('登录名称不符合规则');
            return;
        }
        if (!isValidName(roleName4SearchTmp, false)) {
            alert('角色名称不符合规则');
            return;
        }

        setRoleName4Search(roleName4SearchTmp);
        setLoginName4Search(loginName4SearchTmp);
    }

    // 表格操作相关
    const [loginName4Edit, setLoginName4Edit] = useState('');
    const onClickEdit = (selectedLoginName)=> {
        setLoginName4Edit(selectedLoginName);
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
                        <span>登录名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="登录名称" allowClear onChange={(e) => loginName4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                        <span>角色名称：</span>
                    </div>
                </Col>
                <Col className="gutter-row" span={4}>
                    <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                        <Input placeholder="角色名称" allowClear onChange={(e) => roleName4SearchTmp = e.target.value} style={{width: '95%'}} />
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={3}>
                    <div className="flex-row-cont">
                        <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建管理员</Button>
                    </div>
                </Col>
                <Col className="gutter-row" span={6}>
                    &nbsp;
                </Col>
            </Row>
            <Row style={{backgroundColor: '#fff', borderRadius: 0, margin: '0px 0px'}}>&nbsp;</Row>
            <div>&nbsp;</div>
            <AdminListBlock key={refreshListKey} loginName4Search={loginName4Search} roleName4Search={roleName4Search} onClickEdit={onClickEdit} />

            {openNewModal && (
                <AdminNewModal onClose={onCloseNewModal} loginName4Edit={loginName4Edit} />
            )}
        </>
    )
};

export default AdminPage;
