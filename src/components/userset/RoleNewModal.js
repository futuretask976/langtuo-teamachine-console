import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, Space, Table, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { genGetUrlBySegs, genPostUrl, getRespModel, isArray, isBlankStr, handleRespError, isRespSuccess, getJwtToken, getTenantCode } from '../../js/common.js';

const RoleNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/userset/role/put');
        axios.put(url, {
            tenantCode: getTenantCode(),
            extraInfo: {
                testA: 'valueA',
                testB: 'valueB'
            },
            roleCode: roleCode,
            roleName: roleName,
            comment: comment,
            permitActCodeList: permitActCodeList
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
    const [permitActGroupList, setPermitActGroupList] = useState([]);

    // 初始化动作相关
    const fetchRole4Edit = () => {
        if (isBlankStr(props.roleCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/userset/role/{segment}/{segment}/get', [getTenantCode(), props.roleCode4Edit]);
        axios.get(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setRoleCode(model.roleCode);
            setRoleName(model.roleName);
            setComment(model.comment);
            setPermitActCodeList((prev => {
                return isArray(model.permitActCodeList) ? model.permitActCodeList : [];
            }));
        })
        .catch(error => {
            handleRespError(error);
        });
    }
    const fetchPermitActGroupList4Select = () => {
        let url = genPostUrl('/userset/permitact/list');
        axios.get(url, {
            // withCredentials: true // 这会让axios在请求中携带cookies
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
    useEffect(() => {
        fetchRole4Edit();
        fetchPermitActGroupList4Select();
    }, [props.roleCode4Edit]);

    // 输入相关
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
                        <Space direction='vertical' size={20} style={{width: '100%'}}>
                            <Row style={{width: '100%'}}>
                                <Col className="gutter-row" span={2}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>角色编码：</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Input placeholder="角色编码" disabled={isBlankStr(props.roleCode4Edit) ? false : true} value={roleCode} onChange={(e) => setRoleCode(e.target.value)}/>
                                </Col>
                                <Col className="gutter-row" span={2}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>角色名称：</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Input placeholder="角色名称" value={roleName} onChange={(e) => setRoleName(e.target.value)}/>
                                </Col>
                                <Col className="gutter-row" span={2}>
                                    <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                        <span>备注：</span>
                                    </div>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <Input placeholder="备注" value={comment} onChange={(e) => setComment(e.target.value)}/>
                                </Col>
                            </Row>
                        </Space>
                    </div>
                    <div className="flex-row-cont" style={{height: 350, width: '100%'}}>
                        <Table columns={permitActTableCol} dataSource={permitActGroupList} pagination={false} size={'small'} style={{width: '100%'}} />
                    </div>
                </div>
            </Modal>
    );
};
 
export default RoleNewModal;