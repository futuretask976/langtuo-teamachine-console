import React, { useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import '../../css/common.css';
import { isValidName } from '../../js/common';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import OrgListBlock from '../../components/user/OrgListBlock'
import OrgNewModal from '../../components/user/OrgNewModal'

const OrgPage = () => {
    // 面包屑相关
    const breadcrumbPath = ['控制台', '用户', '组织架构管理'];

    // 新建对话框相关
    const [openNewModal, setOpenNewModal] = useState(false);
    const onClickNew = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = () => {
        setOpenNewModal(false);
        setOrgName4Edit('');
        refreshList();
    }

    // 搜索相关
    const [orgName4Search, setOrgName4Search] = useState('');
    const onClickSearch = () => {
        if (!isValidName(orgName4Search, false)) {
            alert('组织名称不符合规则');
            return;
        }
        refreshList();
    }

    // 表格操作相关
    const [orgName4Edit, setOrgName4Edit] = useState('');
    const onClickEdit = (selectedOrgName)=> {
        setOrgName4Edit(selectedOrgName);
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
                                <span>组织名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="组织名称" allowClear onChange={(e) => setOrgName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>开始搜索</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onClickNew} style={{width: '90%'}}>新增架构</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="full-width" style={{alignItems: 'center', height: 740}}>
                    <OrgListBlock key={refreshListKey} orgName4Search={orgName4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>

            {openNewModal && (
                <OrgNewModal orgName4Edit={orgName4Edit} onClose={onCloseNewModal} />
            )}
        </>
    )
};

export default OrgPage;
