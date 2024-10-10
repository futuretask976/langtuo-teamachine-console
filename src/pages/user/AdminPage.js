import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Select, Space, Col, Row } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import { FramePageContext } from '../../js/context'
import '../../css/common.css';
import { getTenantCode, isArray, isValidName } from '../../js/common.js';
import { getLang } from '../../i18n/i18n';
import { get } from '../../js/request.js';

import BreadcrumbBlock from "../../components/BreadcrumbBlock"
import AdminListBlock from '../../components/user/AdminListBlock'
import AdminNewModal from '../../components/user/AdminNewModal'

const AdminPage = () => {
    // 上下文定义
    const { lang } = useContext(FramePageContext);

    // 面包屑定义
    const breadcrumbPath = [getLang(lang, 'labelConsole'), getLang(lang, 'labelUserSet'), getLang(lang, 'labelAdminMgt')];

    // 对话框定义
    const [openNewModal, setOpenNewModal] = useState(false);
    const onOpenNewModal = () => {
        setOpenNewModal(true);
    };
    const onCloseNewModal = (refresh) => {
        setOpenNewModal(false);
        setLoginName4Edit(undefined);
        if (refresh) {
            refreshList();
        }
    }

    // 数据定义
    const [roleList4Select, setRoleList4Select] = useState();
    const [roleCode4Search, setRoleCode4Search] = useState('');
    const [loginName4Search, setLoginName4Search] = useState();
    const [loginName4Edit, setLoginName4Edit] = useState();

    // 动作定义
    const onClickSearch = () => {
        if (!isValidName(loginName4Search, false)) {
            alert(getLang(lang, 'msgLoginNameInvalid'));
            return;
        }
        refreshList();
    }
    const fetchRoleList4Select = () => {
        get('/userset/role/list', {
            tenantCode: getTenantCode()
        }).then(respData => {
            if (respData == undefined) {
                return;
            }
            setRoleList4Select((prev => {
                let roleListTmp = [{
                    label: getLang(lang, 'labelAll'),
                    value: ''
                }];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        roleListTmp.push({
                            label: item.roleName,
                            value: item.roleCode
                        });
                    });
                }
                return roleListTmp;
            }));
        });
    }
    const onClickEdit = (selectedLoginName)=> {
        setLoginName4Edit(selectedLoginName);
        setOpenNewModal(true);
    }
    useEffect(() => {
        fetchRoleList4Select();
    }, []);

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
                                <span>{getLang(lang, 'promptLoginName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={getLang(lang, 'labelLoginName')} allowClear onChange={(e) => setLoginName4Search(e.target.value)} style={{width: '95%'}} />
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={2}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{getLang(lang, 'promptRoleName')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={4}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-start'}}>
                                <Select
                                    value={roleCode4Search}
                                    style={{width: '95%'}}
                                    onChange={(e) => setRoleCode4Search(e)}
                                    options={roleList4Select}
                                />
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
                    <AdminListBlock key={refreshListKey} loginName4Search={loginName4Search} roleCode4Search={roleCode4Search} onClickEdit={onClickEdit} />
                </div>
            </Space>            

            {openNewModal && (
                <AdminNewModal onClose={onCloseNewModal} loginName4Edit={loginName4Edit} />
            )}
        </>
    )
};

export default AdminPage;
