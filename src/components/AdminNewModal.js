import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { TEAMACHINE_HOST_URL, isBlankStr, genGetUrlByParams, genGetUrlBySegs, genPostUrl } from '../js/common.js';

const { TextArea } = Input;

const AdminNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl(TEAMACHINE_HOST_URL, '/admin/put');
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
    useEffect(() => {
        if (isBlankStr(props.loginName4Edit)) {
            return;
        }

        let url = genGetUrlBySegs(TEAMACHINE_HOST_URL, '/admin', ['tenant_001', props.loginName4Edit, 'get']);
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
    const [orgStrucList, setOrgStrucList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    useEffect(() => {
        let url4OrgStruc = genGetUrlByParams(TEAMACHINE_HOST_URL, '/orgstruc/list', {
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

        let url4Role = genGetUrlByParams(TEAMACHINE_HOST_URL, '/admin/role/list', {
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

    // 输入相关
    const onChangeLoginName = (e) => {
        setLoginName(e.target.value);
    }
    const onChangeLoginPass = (e) => {
        setLoginPass(e.target.value);
    }
    const onChangeRoleCode = (e) => {
        setRoleCode(e);
    }
    const onChangeOrgName = (e) => {
        setOrgName(e);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
 
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
            <div style={{height: 410, width: '100%'}}>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>管理员登录名称：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="管理员登录名称" disabled={isBlankStr(props.loginName4Edit) ? false : true} value={loginName} onChange={onChangeLoginName} />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row>
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>管理员登录密码：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Input placeholder="管理员登录密码" value={loginPass} onChange={onChangeLoginPass}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>归属角色：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Select
                                value={roleCode}
                                style={{width: '100%'}}
                                onChange={onChangeRoleCode}
                                options={roleList}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>归属组织架构：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <Select
                                value={orgName}
                                style={{width: '100%'}}
                                onChange={onChangeOrgName}
                                options={orgStrucList}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{height: 20, width: '100%'}}>
                    <Col className="gutter-row" span={24}>
                        &nbsp;
                    </Col>
                </Row> 
                <Row style={{width: '100%'}}>
                    <Col className="gutter-row" span={6}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                            <span>备注：</span>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                            <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={onChangeComment}/>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
 
export default AdminNewModal;