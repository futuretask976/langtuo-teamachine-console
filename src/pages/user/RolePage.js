import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import RoleListBlock from '../../components/user/RoleListBlock'
import RoleNewModal from '../../components/user/RoleNewModal'

const RolePage = () => {
    // 面包屑定义
    const breadcrumbPath = ['控制台', '用户', '角色管理'];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setRoleCode4Edit(undefined);
        refreshList();
    }

    // 数据定义
    const [roleName4Search, setRoleName4Search] = useState();
    const [roleCode4Edit, setRoleCode4Edit] = useState();

    // 动作定义
    const onClickEdit = (selectedRoleCode)=> {
        setRoleCode4Edit(selectedRoleCode);
        setOpenNewModal(true);
    }
    const onClickSearch = () => {
        if (!isValidName(roleName4Search, false)) {
            alert('角色名称不符合规则');
            return;
        }
        refreshList();
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
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>新建角色</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', backgroundColor: 'red', height: 740}}>
                    <RoleListBlock key={refreshListKey} roleName4Search={roleName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <RoleNewModal onClose={onCloseNewModal} roleCode4Edit={roleCode4Edit} />
            )}
        </>
    )
};

export default RolePage;
