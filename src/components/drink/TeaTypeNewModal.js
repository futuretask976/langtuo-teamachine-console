import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { applyLang } from '../../i18n/i18n';
import { isBlankStr, getTenantCode, isValidCode, isValidName, isValidComment } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const TeaTypeNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(teaTypeCode, true)) {
            alert(applyLang('msgTeaTypeCodeInvalid'));
            return;
        }
        if (!isValidName(teaTypeName, true)) {
            alert(applyLang('msgTeaTypeNameInvalid'));
            return;
        }
        if (!isValidComment(comment, false)) {
            alert(applyLang('msgCommetInvalid'));
            return;
        }

        setLoading(true);
        put('/drinkset/tea/type/put', {
            tenantCode: getTenantCode(),
            comment: comment,
            teaTypeCode: teaTypeCode,
            teaTypeName: teaTypeName,
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

    // 数据初始化相关
    const putNew = props.teaTypeCode4Edit == undefined ? true : false;
    const [teaTypeCode, setTeaTypeCode] = useState();
    const [teaTypeName, setTeaTypeName] = useState();
    const [comment, setComment] = useState();

    // 初始化定义
    const fetchTeaType4Edit = () => {
        if (isBlankStr(props.teaTypeCode4Edit)) {
            return;
        }

        get('/drinkset/tea/type/get', {
            tenantCode: getTenantCode(),
            teaTypeCode: props.teaTypeCode4Edit
        }).then(respData => {
            let model = respData.model;
            setTeaTypeCode(model.teaTypeCode);
            setTeaTypeName(model.teaTypeName);
            setComment(model.comment);
        });
    }
    useEffect(() => {
        fetchTeaType4Edit();
    }, [props.teaTypeCode4Edit]);
 
    return (
        <Modal
            centered
            confirmLoading={loading}
            open={open}
            title={applyLang('labelNewOrEdit')}
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={450}
        >
            <div style={{height: 275, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptTeaTypeCode')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelTeaTypeCode')} allowClear value={teaTypeCode} disabled={isBlankStr(props.teaTypeCode4Edit) ? false : true} onChange={(e) => setTeaTypeCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>{applyLang('promptTeaTypeName')}</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder={applyLang('labelTeaTypeName')} allowClear value={teaTypeName} onChange={(e) => setTeaTypeName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>{applyLang('promptComment')}</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={6} placeholder={applyLang('labelComment')} allowClear maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default TeaTypeNewModal;