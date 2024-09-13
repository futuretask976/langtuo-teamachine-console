import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { getTenantCode, isArray, isBlankStr, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const OrgNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidName(orgName, true)) {
            alert('组织名称不符合规则');
            return;
        }

        setLoading(true);

        put('/userset/org/put', {
            tenantCode: getTenantCode(),
            orgName: orgName,
            parentOrgName: parentOrgName
        }).then(respData => {
            if (respData.success) {
                alert("保存成功！");
            } else {
                alert('保存失败：' + respData.errorMsg);
            }
            setLoading(false);
            props.onClose();
            setOpen(false);
        });
    };
    const onClickCancel = () => {
        props.onClose();
        setOpen(false);
    };

    // 数据初始化相关
    const [orgName, setOrgName] = useState(isBlankStr(props.orgName4Edit) ? '' : props.orgName4Edit);
    const [parentOrgName, setParentOrgName] = useState('总公司');
    const [parentOrgNameOpts, setParentOrgNameOpts] = useState([]);

    // 初始化动作相关
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
        fetchOrg4Edit();
    }, [props.orgName4Edit]);
    useEffect(() => {
        fetchOrgList4Select();
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