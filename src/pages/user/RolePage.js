import React, { useContext, useState } from 'react';
import { Button, Input, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import { FramePageContext } from '../../js/context'
import '../../css/common.css';
import { isValidName } from '../../js/common';
import { getLang } from '../../i18n/i18n';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import RoleListBlock from '../../components/user/RoleListBlock'
import RoleNewModal from '../../components/user/RoleNewModal'

const RolePage = () => {
    // 上下文定义
    const { lang } = useContext(FramePageContext);

    // 面包屑定义
    const breadcrumbPath = [getLang(lang, 'labelConsole'), getLang(lang, 'labelUserSet'), getLang(lang, 'labelRoleMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setRoleCode4Edit(undefined);
        if (refresh) {
            refreshList();
        }
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
            alert(getLang(lang, 'msgRoleNameInvalid'));
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
                                <span>{getLang(lang, 'promptRoleName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={getLang(lang, 'labelRoleName')} allowClear onChange={(e) => setRoleName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<SearchOutlined />} onClick={onClickSearch} style={{width: '90%'}}>{getLang(lang, 'labelBeginSearch')}</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={3}>
                            <div className="flex-row-cont full-height">
                                <Button type="primary" icon={<FormOutlined />} onClick={onOpenNewModal} style={{width: '90%'}}>{getLang(lang, 'labelNew')}</Button>
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
