import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespModel, getJwtToken, getTenantCode, isBlankStr, handleRespError, isRespSuccess, isValidCode, isValidComment, isValidName } from '../../js/common.js';

const { TextArea } = Input;

const AdminNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidName(loginName, true)) {
            alert('登录名称不符合规则');
            return;
        }
        if (!isValidCode(loginPass, true)) {
            alert('密码不符合规则');
            return;
        }
        if (!isValidCode(roleCode, true)) {
            alert('角色编码不符合规则');
            return;
        }
        if (!isValidName(orgName, true)) {
            alert('组织名称不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }


        setLoading(true);
        let url = genPostUrl('/userset/admin/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            loginName: loginName,
            loginPass: loginPass,
            roleCode: roleCode,
            orgName: orgName,
            comment: comment
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("更新成功！")
            } else {
                alert("更新失败，请联系管理员！")
            }
        })
        .catch(error => {
            handleRespError(error);
        });

        setTimeout(() => {
            props.onClose();
            setLoading(false);
            setOpen(false);
        }, 3000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [loginName, setLoginName] = useState(isBlankStr(props.loginName4Edit) ? '' : props.loginName4Edit);
    const [loginPass, setLoginPass] = useState('');
    const [roleCode, setRoleCode] = useState('');
    const [orgName, setOrgName] = useState('');
    const [comment, setComment] = useState('');
    const [orgList, setOrgList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    // 赋值初始化相关
    const fetchAdmin4Edit = () => {
        if (isBlankStr(props.loginName4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/userset/admin/{segment}/{segment}/get', [getTenantCode(), props.loginName4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setLoginName(model.loginName);
            setLoginPass(model.loginPass);
            setRoleCode(model.roleCode);
            setOrgName(model.orgName);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchOrgList4Select = () => {
        let url4OrgStruc = genGetUrlByParams('/userset/org/list', {tenantCode: getTenantCode()});
        axios.get(url4OrgStruc, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setOrgList((prev => {
                let orgListTmp = [];
                model.forEach(item => {
                    orgListTmp.push({
                        label: item.orgName,
                        value: item.orgName
                    });
                })
                return orgListTmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchRoleList4Select = () => {
        let url4Role = genGetUrlByParams('/userset/role/list', {tenantCode: getTenantCode()});
        axios.get(url4Role, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setRoleList((prev => {
                let roleListTmp = [];
                model.forEach(item => {
                    roleListTmp.push({
                        label: item.roleName,
                        value: item.roleCode
                    });
                })
                return roleListTmp;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    useEffect(() => {
        fetchOrgList4Select();
        fetchRoleList4Select();
    }, []);
    useEffect(() => {
        fetchAdmin4Edit();
    }, [props.loginName4Edit]);
    
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            style={{border: '0px solid red'}}
            title="新建/编辑管理员"
            width={500}
        >
            <div style={{height: 350, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>管理员登录名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Input placeholder="管理员登录名称" disabled={isBlankStr(props.loginName4Edit) ? false : true} value={loginName} onChange={(e) => setLoginName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>管理员登录密码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <Input placeholder="管理员登录密码" value={loginPass} onChange={(e) => setLoginPass(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={7}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>归属角色：</span></Space>
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
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>归属组织架构：</span></Space>
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
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={17}>
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default AdminNewModal;