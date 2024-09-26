import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray, isBlankStr, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const OrgNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidName(orgName, true)) {
            alert('组织名称不符合规则');
            return;
        }
        if (orgName == parentOrgName) {
            alert('父组织名称不能是自己');
            return;
        }

        setLoading(true);
        put('/userset/org/put', {
            tenantCode: getTenantCode(),
            orgName: orgName,
            parentOrgName: parentOrgName,
            putNew: putNew
        }).then(respData => {
            if (respData.success) {
                alert("保存成功！");
                setLoading(false);
                props.onClose(true);
                setOpen(false);
            } else {
                alert('保存失败：' + respData.errorMsg);
                setLoading(false);
            }
        });
    };
    const onClickCancel = () => {
        props.onClose(false);
        setOpen(false);
    };

    // 数据定义
    const putNew = props.orgName4Edit == undefined ? true : false;
    const [orgName, setOrgName] = useState();
    const [parentOrgName, setParentOrgName] = useState('总公司');
    const [parentOrgNameOpts, setParentOrgNameOpts] = useState();

    // 初始化定义
    const fetchOrg4Edit = () => {
        if (isBlankStr(props.orgName4Edit)) {
            return;
        }

        get('/userset/org/get', {  
            tenantCode: getTenantCode(),
            orgName: props.orgName4Edit
        }).then(respData => {
            let model = respData.model;
            setOrgName(model.orgName);
            setParentOrgName(model.parentOrgName);
        });
    }
    const fetchOrgList4Select = () => {
        get('/userset/org/list', {  
            tenantCode: getTenantCode()
        }).then(respData => {
            setParentOrgNameOpts(prev => {
                let tmpOpts = [];
                if (isArray(respData.model)) {
                    respData.model.forEach(ite => {
                        tmpOpts.push({
                            label: ite.orgName,
                            value: ite.orgName
                        });
                    });
                }
                return tmpOpts;
            });
        });
    }
    useEffect(() => {
        fetchOrgList4Select();
        fetchOrg4Edit();
    }, []);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            style={{border: '0px solid red'}}
            title="新建/编辑组织"
            width={450}
        >
            <div style={{height: 100, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>组织名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Input placeholder="组织名称" value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={isBlankStr(props.orgName4Edit) ? false : true}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>父组织名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Select
                                onChange={(e) => setParentOrgName(e)}
                                options={parentOrgNameOpts}
                                style={{width: '100%'}}
                                value={parentOrgName}
                            />
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default OrgNewModal;