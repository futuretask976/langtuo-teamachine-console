import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, Space, Table, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlBySegs, genPostUrl, getRespModel, getJwtToken, getTenantCode, handleRespError, isArray, isBlankStr, isRespSuccess, isValidCode, isValidComment, isValidName } from '../../js/common.js';

const RoleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(roleCode, true)) {
            alert('角色编码不符合规则');
            return;
        }
        if (!isValidName(roleName, true)) {
            alert('角色名称不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
            return;
        }

        setLoading(true);
        let url = genPostUrl('/userset/role/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            roleCode: roleCode,
            roleName: roleName,
            comment: comment,
            permitActCodeList: getCheckedPermitActCodeList()
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("保存成功")
            } else {
                alert("保存失败，请重试，或联系管理员处理")
            }
        })
        .catch(error => {
            handleRespError(error);
        });

        setTimeout(() => {
            props.onClose();
            setLoading(false);
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
    const [permitActGroupList, setPermitActGroupList] = useState([]);

    // 初始化动作相关
    const fetchPermitActGroupList4Select = () => {
        let url = genPostUrl('/userset/permitact/list');
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setPermitActGroupList((prev => {
                return model;
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchRole4Edit = () => {
        if (isBlankStr(props.roleCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/userset/role/{segment}/{segment}/get', [getTenantCode(), props.roleCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setRoleCode(model.roleCode);
            setRoleName(model.roleName);
            setComment(model.comment);
            initCheckPermitActGroup(isArray(model.permitActCodeList) ? model.permitActCodeList : []);
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const initCheckPermitActGroup = (permitActCodeList) => {
        setPermitActGroupList(prev => {
            let tmp = [];
            prev.forEach(permitActGroupItem => {
                let hasUnchecked = false;
                permitActGroupItem.permitActList.forEach(permitActItem => {
                    let checked = false;
                    permitActCodeList.forEach(permitActCodeItem => {
                        if (permitActItem.permitActCode == permitActCodeItem) {
                            checked = true;
                        }
                    });
                    permitActItem.checked = checked;
                    if (!permitActItem.checked) {
                        hasUnchecked = true;
                    }
                });
                if (hasUnchecked) {
                    permitActGroupItem.checked = false;
                } else {
                    permitActGroupItem.checked = true;
                }
                tmp.push(permitActGroupItem);
            });
            return tmp;
        });
    }
    useEffect(() => {
        fetchPermitActGroupList4Select();
        fetchRole4Edit();
    }, [props.roleCode4Edit]);

    // 表格操作相关
    const getCheckedPermitActCodeList = () => {
        let tmp = [];
        permitActGroupList.forEach(permitActGroupItem => {
            permitActGroupItem.permitActList.forEach(permitActItem => {
                if (permitActItem.checked) {
                    tmp.push(permitActItem.permitActCode);
                }
            });
        });
        return tmp;
    }
    const onChangePermitAct = (permitActGroupCode, permitActCode, e) => {
        setPermitActGroupList(prev => {
            let tmp = [];
            prev.forEach(permitActGroupItem => {
                if (permitActGroupItem.permitActGroupCode == permitActGroupCode) {
                    let hasUnchecked = false;
                    permitActGroupItem.permitActList.forEach(permitActItem => {
                        if (permitActItem.permitActCode == permitActCode) {
                            permitActItem.checked = e.target.checked;
                        }
                        if (!permitActItem.checked) {
                            hasUnchecked = true;
                        }
                    });
                    if (hasUnchecked) {
                        permitActGroupItem.checked = false;
                    } else {
                        permitActGroupItem.checked = true;
                    }
                }
                tmp.push(permitActGroupItem);
            });
            return tmp;
        });
    }
    const onChangePermitActGroup = (permitActGroupCode, e) => {
        setPermitActGroupList(prev => {
            let tmp = [];
            prev.forEach(permitActGroupItem => {
                if (permitActGroupItem.permitActGroupCode == permitActGroupCode) {
                    permitActGroupItem.checked = e.target.checked;
                    permitActGroupItem.permitActList.forEach(permitActItem => {
                        permitActItem.checked = e.target.checked;
                    });
                }
                tmp.push(permitActGroupItem);
            });
            return tmp;
        });
    }
    const permitActTableCol = [
        {
            title: '权限分组',
            dataIndex: 'permitActGroupName',
            key: 'permitActGroupName',
            render: (_, record) => (
                <Checkbox 
                        key={record.permitActGroupCode}
                        onChange={(e) => onChangePermitActGroup(record.permitActGroupCode, e)} 
                        checked={record.checked}>
                    {record.permitActGroupName}
                </Checkbox>
            ),
        },
        {
            title: '权限点',
            dataIndex: 'permitAct',
            key: 'permitAct',
            render: (_, record) => (
                record.permitActList.map((permitAct) => {
                    return (
                        <Checkbox 
                                key={permitAct.permitActCode}
                                onChange={(e) => onChangePermitAct(permitAct.permitActGroupCode, permitAct.permitActCode, e)} 
                                checked={permitAct.checked}>
                            {permitAct.permitActName}
                        </Checkbox>
                    );
                })
            ),
        }
    ];
 
    return (
        <Modal
                centered
                confirmLoading={loading}
                open={open}
                onOk={onClickOK}
                onCancel={onClickCancel}
                style={{border: '0px solid red'}}
                title="新建/编辑角色"
                width={1000}
            >
                <div className="flex-col-cont" style={{height: 410, width: '100%'}}>
                    <div className="flex-row-cont" style={{height: 60, width: '100%'}}>
                        <Space direction='vertical' size={20} style={{width: '100%'}}>
                            <Row style={{width: '100%'}}>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <Space size='small'><span style={{color: 'red'}}>*</span><span>角色编码：</span></Space>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={5}>
                                    <Input placeholder="角色编码" disabled={isBlankStr(props.roleCode4Edit) ? false : true} value={roleCode} onChange={(e) => setRoleCode(e.target.value)}/>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <Space size='small'><span style={{color: 'red'}}>*</span><span>角色名称：</span></Space>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={5}>
                                    <Input placeholder="角色名称" value={roleName} onChange={(e) => setRoleName(e.target.value)}/>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>备注：</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={5}>
                                    <Input placeholder="备注" value={comment} onChange={(e) => setComment(e.target.value)}/>
                                </Col>
                            </Row>
                        </Space>
                    </div>
                    <div className="flex-row-cont" style={{height: 350, width: '100%'}}>
                        <Table 
                            columns={permitActTableCol} 
                            dataSource={permitActGroupList} 
                            pagination={false} 
                            rowKey={record=>record.permitActGroupCode}
                            size={'small'} 
                            style={{width: '100%'}} />
                    </div>
                </div>
            </Modal>
    );
};

export default RoleNewModal;