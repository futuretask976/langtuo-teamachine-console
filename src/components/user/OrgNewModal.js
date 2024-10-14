import React, { useEffect, useState } from 'react';
import { Input, Modal, Select, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { getTenantCode, isArray, isBlankStr, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const OrgNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidName(orgName, true)) {
            alert(applyLang('msgOrgNameInvalid'));
            return;
        }
        if (!isValidName(parentOrgName, true)) {
            alert(applyLang('msgParentOrgNameInvalid'));
            return;
        }
        if (orgName == parentOrgName) {
            alert(applyLang('msgParentOrgNameInvalid'));
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
    const putNew = props.orgName4Edit == undefined ? true : false;
    const [orgName, setOrgName] = useState();
    const [parentOrgName, setParentOrgName] = useState();
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
            title={applyLang('labelNewOrEdit')}
            width={450}
        >
            <div style={{height: 100, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont  full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptOrgName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row full-height" span={18}>
                            <Input placeholder={applyLang('labelOrgName')} value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={isBlankStr(props.orgName4Edit) ? false : true}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptParentOrg')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <Select
                                className="full-width"
                                onChange={(e) => setParentOrgName(e)}
                                options={parentOrgNameOpts}
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