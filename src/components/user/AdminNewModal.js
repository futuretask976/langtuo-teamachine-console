import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Switch, Col, Row } from 'antd';
import md5 from 'js-md5';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankStr, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const AdminNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidName(loginName, true)) {
            alert(applyLang('msgLoginNameInvalid'));
            return;
        }
        if (!isValidCode(roleCode, true)) {
            alert(applyLang('msgRoleCodeInvalid'));
            return;
        }
        if (!isValidName(orgName, true)) {
            alert(applyLang('msgOrgNameInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }
        if (toUpdatePass) {
            if (isBlankStr(loginPass)) {
                alert(applyLang('msgLoginPassInvalid'));
                return;
            }
        }

        setLoading(true);
        put('/userset/admin/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            loginName: loginName,
            loginPass: toUpdatePass ? md5(loginPass) : undefined,
            roleCode: roleCode,
            orgName: orgName,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert(applyLang('msgPutSucceed'));
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert(applyLang('msgPutFailed') + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.loginName4Edit === undefined ? true : false;
    const [toUpdatePass, setToUpdatePass] = useState(putNew);
    const [loginName, setLoginName] = useState();
    const [loginPass, setLoginPass] = useState();
    const [roleCode, setRoleCode] = useState();
    const [orgName, setOrgName] = useState();
    const [comment, setComment] = useState();
    const [orgList, setOrgList] = useState();
    const [roleList, setRoleList] = useState();

    // 初始化定义
    const fetchAdmin4Edit = () => {
        if (isBlankStr(props.loginName4Edit)) {
            return;
        }

        get('/userset/admin/get', {  
            tenantCode: getTenantCode(),
            loginName: props.loginName4Edit
        }).then(respData => {
            let model = respData.model;
            setLoginName(model.loginName);
            setRoleCode(model.roleCode);
            setOrgName(model.orgName);
            setComment(model.comment);
        });
    }
    const fetchOrgList4Select = () => {
        get('/userset/org/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            setOrgList((prev => {
                let orgListTmp = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(item => {
                        orgListTmp.push({
                            label: item.orgName,
                            value: item.orgName
                        });
                    });
                }
                return orgListTmp;
            }));
        });
    }
    const fetchRoleList4Select = () => {
        get('/userset/role/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            setRoleList((prev => {
                let roleListTmp = [];
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
    useEffect(() => {
        fetchOrgList4Select();
        fetchRoleList4Select();
        fetchAdmin4Edit();
    }, []);
    
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            title={applyLang('labelNewOrEdit')}
            width={500}
        >
            <div style={{height: 375, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptLoginName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Input placeholder={applyLang('labelLoginName')} disabled={isBlankStr(props.loginName4Edit) ? false : true} value={loginName} onChange={(e) => setLoginName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptRole')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Select
                                onChange={(e) => setRoleCode(e)}
                                options={roleList}
                                style={{width: '100%'}}
                                value={roleCode}
                            />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptOrg')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Select
                                onChange={(e) => setOrgName(e)}
                                options={orgList}
                                style={{width: '100%'}}
                                value={orgName}
                            />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{alignItems: 'flex-start', justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <TextArea rows={5} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span>{applyLang('promptUpdatePassOrNot')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Switch checkedChildren={applyLang('labelYes')} unCheckedChildren={applyLang('labelNo')} checked={toUpdatePass} disabled={putNew} onChange={(e) => setToUpdatePass(e)} />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'>
                                    {toUpdatePass && (
                                        <span style={{color: 'red'}}>*</span>
                                    )}
                                    <span>{applyLang('promptLoginPass')}</span>
                                </Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Input.Password placeholder={applyLang('labelLoginPass')} disabled={!toUpdatePass} value={loginPass} onChange={(e) => setLoginPass(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default AdminNewModal;