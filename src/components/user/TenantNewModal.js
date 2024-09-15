import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { isBlankStr, isValidCode, isValidComment, isValidName } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const TenantNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(tenantCode, true)) {
            alert('商户编码不符合规则');
            return;
        }
        if (!isValidName(tenantName, true)) {
            alert('商户名称不符合规则');
            return;
        }
        if (!isValidName(contactPerson, false)) {
            alert('联系人不符合规则');
            return;
        }
        if (!isValidCode(contactPhone, false)) {
            alert('电话不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
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

    // 数据定义相关
    const putNew = props.tenantCode4Edit == undefined ? true : false;
    const [tenantCode, setTenantCode] = useState();
    const [tenantName, setTenantName] = useState();
    const [contactPerson, setContactPerson] = useState();
    const [contactPhone, setContactPhone] = useState();
    const [comment, setComment] = useState();

    // 初始化动作相关
    useEffect(() => {
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
    }, [props.tenantCode4Edit]);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            onOk={onClickOK}
            onCancel={onClickCancel}
            style={{border: '0px solid red'}}
            title="新建/编辑租户"
            width={500}
        >
            <div style={{height: 320, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>商户编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder="商户编码" value={tenantCode} onChange={(e) => setTenantCode(e.target.value)} disabled={isBlankStr(props.tenantCode4Edit) ? false : true}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>商户名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder="商户名称" value={tenantName} onChange={(e) => setTenantName(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>联系人名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder="联系人名称" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>联系人电话：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <Input placeholder="联系人电话" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}/>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <TextArea rows={4} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default TenantNewModal;