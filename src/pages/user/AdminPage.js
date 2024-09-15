import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import AdminListBlock from '../../components/user/AdminListBlock'
import AdminNewModal from '../../components/user/AdminNewModal'

const AdminPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '用户', '管理员管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setLoginName4Edit(undefined);
        refreshList();
    }

    // 搜索相关
    const [roleName4Search, setRoleName4Search] = useState();
    const [loginName4Search, setLoginName4Search] = useState();
    const onClickSearch = () => {
        if (!isValidName(loginName4Search, false)) {
            alert('登录名称不符合规则');
            return;
        }
        if (!isValidName(roleName4Search, false)) {
            alert('角色名称不符合规则');
            return;
        }
        refreshList();
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
            <Space className="full-square" direction="vertical" size={15}>
                <div className='flex-row-cont' style={{alignItems: 'flex-start', justifyContent: 'flex-start', height: 40}}>
                    <BreadcrumbBlock breadcrumbPath={breadcrumbPath} />
                </div>
                <div className='flex-col-cont full-width' style={{alignItems: 'center', background: '#FFFFFF', height: 50}}>
                    <Row className="full-width" style={{height: 40}}>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>登录名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="登录名称" allowClear onChange={(e) => setLoginName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>角色名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="角色名称" allowClear onChange={(e) => setRoleName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建管理员</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <AdminListBlock key={refreshListKey} loginName4Search={loginName4Search} roleName4Search={roleName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>            

            {openNewModal && (
                <AdminNewModal onClose={onCloseNewModal} loginName4Edit={loginName4Edit} />
            )}
        </>
    )
};

export default AdminPage;
