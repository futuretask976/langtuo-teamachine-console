import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl } from '../../js/common.js';

const { TextArea } = Input;

const AdminNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/userset/admin/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            loginName: loginName,
            loginPass: loginPass,
            roleCode: roleCode,
            orgName: orgName,
            comment: comment,
            tenantCode: 'tenant_001',
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                alert("here is success")
            } else {
                alert("here is wrong")
            }
        })
        .catch(error => {
            alert("here is error")
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
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
    const [orgStrucList, setOrgStrucList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    useEffect(() => {
        if (isBlankStr(props.loginName4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/userset/admin/{segment}/{segment}/get', ['tenant_001', props.loginName4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setLoginName(response.data.model.loginName);
                setLoginPass(response.data.model.loginPass);
                setRoleCode(response.data.model.roleCode);
                setOrgName(response.data.model.orgName);
                setComment(response.data.model.comment);
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
    }, [props.loginName4Edit]);
    useEffect(() => {
        let url4OrgStruc = genGetUrlByParams('/userset/orgstruc/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url4OrgStruc, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setOrgStrucList((prev => {
                    let orgStrucListTmp = [];
                    response.data.model.forEach(item => {
                        orgStrucListTmp.push({
                            label: item.orgName,
                            value: item.orgName
                        });
                    })
                    return orgStrucListTmp;
                }));
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });

        let url4Role = genGetUrlByParams('/userset/admin/role/list', {
            tenantCode: 'tenant_001'
        });
        axios.get(url4Role, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setRoleList((prev => {
                    let roleListTmp = [];
                    response.data.model.forEach(item => {
                        roleListTmp.push({
                            label: item.roleName,
                            value: item.roleCode
                        });
                    })
                    return roleListTmp;
                }));
            }
        })
        .catch(error => {
            // console.error('error: ', error);
            // console.error('error.response: ', error.response);
            // console.error('error.response.status: ', error.response.status);
            if (error && error.response && error.response.status === 401) {
                // window.location.href="/gxadmin/login";
            }
        });
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
                                options={orgStrucList}
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