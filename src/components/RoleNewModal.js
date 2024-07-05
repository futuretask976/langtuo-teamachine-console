import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, Table, Col, Row } from 'antd';
import axios from 'axios';

import '../css/common.css';
import { isArray, isBlankStr, genGetUrlBySegs, genPostUrl } from '../js/common.js';

const RoleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/admin/role/put');
        axios.put(url, {
            withCredentials: true, // 这会让axios在请求中携带cookies
            roleCode: roleCode,
            roleName: roleName,
            comment: comment,
            tenantCode: 'tenant_001',
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
            permitActCodeList: permitActCodeList
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
        }, 1000);
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [roleCode, setRoleCode] = useState(isBlankStr(props.roleCode4Edit) ? '' : props.roleCode4Edit);
    const [roleName, setRoleName] = useState('');
    const [comment, setComment] = useState('');
    const [permitActCodeList, setPermitActCodeList] = useState([]);
    useEffect(() => {
        if (isBlankStr(props.roleCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/admin/role/{segment}/{segment}/get', ['tenant_001', props.roleCode4Edit]);
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setRoleCode(response.data.model.roleCode);
                setRoleName(response.data.model.roleName);
                setComment(response.data.model.comment);
                setPermitActCodeList((prev => {
                    return isArray(response.data.model.permitActCodeList) ? response.data.model.permitActCodeList : [];
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
    }, [props.roleCode4Edit]);
    const [permitActGroupList, setPermitActGroupList] = useState([]);
    useEffect(() => {
        let url = genPostUrl('/permitact/list');
        axios.get(url, {
            withCredentials: true // 这会让axios在请求中携带cookies
        })
        .then(response => {
            if (response && response.data && response.data.success) {
                setPermitActGroupList((prev => {
                    return response.data.model;
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
    }, [props.roleCode4Edit]);

    // 输入相关
    const onChangeRoleCode = (e) => {
        setRoleCode(e.target.value);
    }
    const onChangeRoleName = (e) => {
        setRoleName(e.target.value);
    }
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
    const onChangePermitAct = (permitActCode, e) => {
        setPermitActCodeList(prev => {
            let permitActCodeListTmp = [];
            let matched = false;
            prev.forEach(ele => {
                if (ele == permitActCode) {
                    matched = true;
                    if (e.target.checked) {
                        permitActCodeListTmp.push(permitActCode);
                    }
                } else {
                    permitActCodeListTmp.push(ele);
                }
            });
            if (!matched && e.target.checked) {
                permitActCodeListTmp.push(permitActCode);
            }
            return permitActCodeListTmp;
        });
    }

    // 表格操作相关
    const isPermitCodeChecked = (permitActCode) => {
        let isChecked = false;
        permitActCodeList.forEach(item => {
            if (permitActCode == item) {
                isChecked = true;
            }
        });
        return isChecked;
    }
    const permitActTableCol = [
        {
            title: '权限分组',
            dataIndex: 'permitActGroupName',
            key: 'permitActGroupName',
            render: (_, record) => (
                <Checkbox>{record.permitActGroupName}</Checkbox>
            ),
        },
        {
            title: '权限点',
            dataIndex: 'permitAct',
            key: 'permitAct',
            render: (_, record) => (
                record.permitActList.map((permitAct, idx) => {
                    return (
                        <Checkbox onChange={(e) => onChangePermitAct(permitAct.permitActCode, e)} checked={isPermitCodeChecked(permitAct.permitActCode)}>{permitAct.permitActName}</Checkbox>
                    );
                })
            ),
        }
    ];
 
    return (
        <Modal
                centered
                open={open}
                title="新建角色"
                onOk={onClickOK}
                onCancel={onClickCancel}
                width={1000}
                style={{border: '0px solid red'}}
                footer={[
                    <Button key="back" onClick={onClickCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                        提交
                    </Button>,
                ]}
            >
                <div className="flex-col-cont" style={{height: 410, width: '100%'}}>
                    <div className="flex-row-cont" style={{height: 60, width: '100%'}}>
                        <Row style={{width: '100%'}}>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>角色编码：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Input placeholder="角色编码" disabled={isBlankStr(props.roleCode4Edit) ? false : true} value={roleCode} onChange={onChangeRoleCode} style={{width: '90%'}}/>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>角色名称：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Input placeholder="角色名称" value={roleName} onChange={onChangeRoleName} style={{width: '90%'}} />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                    <span>备注：</span>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                    <Input placeholder="备注" value={comment} onChange={onChangeComment} style={{width: '90%'}} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="flex-row-cont" style={{height: 350, width: '100%'}}>
                        <Table columns={permitActTableCol} dataSource={permitActGroupList} pagination={false} size={'small'} style={{width: '100%'}} />
                    </div>
                </div>
            </Modal>
    );
};
 
export default RoleNewModal;