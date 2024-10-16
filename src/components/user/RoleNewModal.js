import React, { useEffect, useState } from 'react';
import { Checkbox, Input, Modal, Space, Table, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankStr, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const RoleNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(roleCode, true)) {
            alert(applyLang('msgRoleCodeInvalid'));
            return;
        }
        if (!isValidName(roleName, true)) {
            alert(applyLang('msgRoleNameInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }

        setLoading(true);
        put('/userset/role/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            roleCode: roleCode,
            roleName: roleName,
            permitActCodeList: getCheckedPermitActCodeList(),
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
    const putNew = props.roleCode4Edit === undefined ? true : false;
    const [roleCode, setRoleCode] = useState();
    const [roleName, setRoleName] = useState();
    const [comment, setComment] = useState();
    const [permitActGroupList, setPermitActGroupList] = useState();

    // 初始化定义
    const fetchPermitActGroupList4Select = () => {
        get('/userset/permitact/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            let model = respData.model;
            setPermitActGroupList((prev => {
                return model;
            }));
        });
    }
    const fetchRole4Edit = () => {
        if (isBlankStr(props.roleCode4Edit)) {
            return;
        }

        get('/userset/role/get', {  
            tenantCode: getTenantCode(),
            roleCode: props.roleCode4Edit
        }).then(respData => {
            let model = respData.model;
            setRoleCode(model.roleCode);
            setRoleName(model.roleName);
            setComment(model.comment);
            initCheckPermitActGroup(isArray(model.permitActCodeList) ? model.permitActCodeList : []);
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
                        if (permitActItem.permitActCode === permitActCodeItem) {
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

    // 输入定义
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
                if (permitActGroupItem.permitActGroupCode === permitActGroupCode) {
                    let hasUnchecked = false;
                    permitActGroupItem.permitActList.forEach(permitActItem => {
                        if (permitActItem.permitActCode === permitActCode) {
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
                if (permitActGroupItem.permitActGroupCode === permitActGroupCode) {
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
            title: applyLang('labelAuthorizeGroup'),
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
            title: applyLang('labelAuthorizePoint'),
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
                title={applyLang('labelNewOrEdit')}
                width={1000}
            >
                <div className="flex-col-cont" style={{height: 390, width: '100%'}}>
                    <div className="flex-row-cont" style={{height: 40, width: '100%'}}>
                        <Space direction='vertical' size={20} style={{width: '100%'}}>
                            <Row style={{width: '100%'}}>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptRoleCode')}</span></Space>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={5}>
                                    <Input placeholder={applyLang('labelRoleCode')} disabled={isBlankStr(props.roleCode4Edit) ? false : true} value={roleCode} onChange={(e) => setRoleCode(e.target.value)}/>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptRoleName')}</span></Space>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={5}>
                                    <Input placeholder={applyLang('labelRoleName')} value={roleName} onChange={(e) => setRoleName(e.target.value)}/>
                                </Col>
                                <Col className="gutter-row" span={3}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>{applyLang('promptComment')}</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={5}>
                                    <Input placeholder={applyLang('labelComment')} value={comment} onChange={(e) => setComment(e.target.value)}/>
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