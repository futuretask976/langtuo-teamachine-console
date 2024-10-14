import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const TenantNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(tenantCode, true)) {
            alert(applyLang('msgTenantCodeInvalid'));
            return;
        }
        if (!isValidName(tenantName, true)) {
            alert(applyLang('msgTenantNameInvalid'));
            return;
        }
        if (!isValidName(contactPerson, false)) {
            alert(applyLang('msgContactPersonInvalid'));
            return;
        }
        if (!isValidCode(contactPhone, false)) {
            alert(applyLang('msgContactPhoneInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommentInvalid'));
            return;
        }

        setLoading(true);
        put('/userset/tenant/put', {
            tenantCode: tenantCode,
            tenantName: tenantName,
            contactPerson: contactPerson,
            contactPhone: contactPhone,
            comment: comment,
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
    const putNew = props.tenantCode4Edit == undefined ? true : false;
    const [tenantCode, setTenantCode] = useState();
    const [comment, setComment] = useState();
    const [tenantName, setTenantName] = useState();
    const [contactPerson, setContactPerson] = useState();
    const [contactPhone, setContactPhone] = useState();

    // 初始化定义
    const fetchTenant4Edit = () => {
        if (isBlankStr(props.tenantCode4Edit)) {
            return;
        }

        get('/userset/tenant/get', {  
            tenantCode: props.tenantCode4Edit
        }).then(respData => {
            let model = respData.model;
            setTenantCode(model.tenantCode);
            setTenantName(model.tenantName);
            setContactPerson(model.contactPerson);
            setContactPhone(model.contactPhone);
            setComment(model.comment);
        });
    }
    useEffect(() => {
        fetchTenant4Edit();
    }, []);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            title={applyLang('labelNewOrEdit')}
            width={575}
        >
            <div style={{height: 320, width: '100%'}}>
                <Space className="full-square" direction='vertical' size={20}>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptTenantCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder={applyLang('labelTenantCode')} value={tenantCode} onChange={(e) => setTenantCode(e.target.value)} disabled={isBlankStr(props.tenantCode4Edit) ? false : true}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptTenantName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder={applyLang('labelTenantName')} value={tenantName} onChange={(e) => setTenantName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptContactPerson')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder={applyLang('labelContactPerson')} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptContactPhone')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder={applyLang('labelContactPhone')} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont full-height" style={{alignItems: 'flex-start', justifyContent: 'flex-end'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <TextArea rows={4} placeholder={applyLang('labelComment')} maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default TenantNewModal;