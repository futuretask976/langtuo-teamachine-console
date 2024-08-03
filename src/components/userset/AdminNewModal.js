import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlByParams, genGetUrlBySegs, genPostUrl, getRespModel, isBlankStr, handleRespError, isRespSuccess, getJwtToken, getTenantCode } from '../../js/common.js';

const { TextArea } = Input;

const AdminNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
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
            // withCredentials: true, // 这会让axios在请求中携带cookies
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
            setLoading(false);
            props.onClose();
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
            // withCredentials: true.valueOf, // 这会让axios在请求中携带cookies
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
            // withCredentials: true // 这会让axios在请求中携带cookies
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
            // withCredentials: true // 这会让axios在请求中携带cookies
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
        fetchAdmin4Edit();
    }, [props.loginName4Edit]);
    useEffect(() => {
        fetchOrgList4Select();
        fetchRoleList4Select();
    }, []);
 
    return (
        <Modal
            centered
            open={open}
            title="新建管理员"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={500}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 350, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>管理员登录名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="管理员登录名称" disabled={isBlankStr(props.loginName4Edit) ? false : true} value={loginName} onChange={(e) => setLoginName(e.target.value)} style={{width: '90%'}} />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>管理员登录密码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="管理员登录密码" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} style={{width: '90%'}} />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>归属角色：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Select
                                value={roleCode}
                                style={{width: '90%'}}
                                onChange={(e) => setRoleCode(e)}
                                options={roleList}
                            />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>归属组织架构：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Select
                                value={orgName}
                                style={{width: '90%'}}
                                onChange={(e) => setOrgName(e)}
                                options={orgList}
                            />
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)} style={{width: '90%'}} />
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default AdminNewModal;