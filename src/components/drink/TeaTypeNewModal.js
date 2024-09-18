import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Col, Row } from 'antd';

import '../../css/common.css';
import { isBlankStr, getTenantCode, isValidCode, isValidName, isValidComment } from '../../js/common.js';
import { get, put } from '../../js/request.js';

const { TextArea } = Input;

const TeaTypeNewModal = (props) => {
    // 对话框定义
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        if (!isValidCode(teaTypeCode, true)) {
            alert('茶品类型编码不符合规则');
            return;
        }
        if (!isValidName(teaTypeName, true)) {
            alert('茶品类型名称不符合规则');
            return;
        }
        if (!isValidComment(comment, false)) {
            alert('备注不符合规则');
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
            open={open}
            title="新建/编辑茶品类型"
            onOk={onClickOK}
            onCancel={onClickCancel}
            width={450}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 275, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>类型编码：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="类型编码" allowClear value={teaTypeCode} disabled={isBlankStr(props.teaTypeCode4Edit) ? false : true} onChange={(e) => setTeaTypeCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <Space size='small'><span style={{color: 'red'}}>*</span><span>类型名称：</span></Space>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="类型名称" allowClear value={teaTypeName} onChange={(e) => setTeaTypeName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={6}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={18}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={6} placeholder="备注" allowClear maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default TeaTypeNewModal;