import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Col, Row } from 'antd';
import axios from 'axios';

import '../../css/common.css';
import { isBlankStr, genGetUrlBySegs, genPostUrl, getJwtToken, getRespModel, getTenantCode, handleRespError, isRespSuccess } from '../../js/common.js';

const { TextArea } = Input;

const TeaTypeNewModal = (props) => {
    // 对话框相关
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);
    const onClickOK = () => {
        setLoading(true);
        let url = genPostUrl('/drinkset/tea/type/put');
        axios.put(url, {
            teaTypeCode: teaTypeCode,
            teaTypeName: teaTypeName,
            comment: comment,
            tenantCode: getTenantCode()
        }, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            if (isRespSuccess(response)) {
                alert("here is success")
            } else {
                alert("here is wrong")
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
    const [teaTypeCode, setTeaTypeCode] = useState(isBlankStr(props.teaTypeCode4Edit) ? '' : props.teaTypeCode4Edit);
    const [teaTypeName, setTeaTypeName] = useState('');
    const [comment, setComment] = useState('');
    const fetchTeaType4Edit = () => {
        if (isBlankStr(props.teaTypeCode4Edit)) {
            return;
        }

        let url = genGetUrlBySegs('/drinkset/tea/type/{segment}/{segment}/get', [getTenantCode(), props.teaTypeCode4Edit]);
        axios.get(url, {
            headers: {
                'Authorization': getJwtToken()
            }
        })
        .then(response => {
            let model = getRespModel(response);
            setTeaTypeCode(model.teaTypeCode);
            setTeaTypeName(model.teaTypeName);
            setComment(model.comment);
        })
        .catch(error => {
            handleRespError(error);
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
            width={400}
            style={{border: '0px solid red'}}
            footer={[
                <Button key="back" onClick={onClickCancel}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={onClickOK}>
                    提交
                </Button>,
            ]}
        >
            <div style={{height: 225, width: '100%'}}>
                <Space direction='vertical' size={20} style={{width: '100%'}}>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>类型编码：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="类型编码" value={teaTypeCode} disabled={isBlankStr(props.teaTypeCode4Edit) ? false : true} onChange={(e) => setTeaTypeCode(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>类型名称：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <Input placeholder="类型名称" value={teaTypeName} onChange={(e) => setTeaTypeName(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Col className="gutter-row" span={5}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-end', height: '100%'}}>
                                <span>备注：</span>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={19}>
                            <div className="flex-row-cont" style={{justifyContent: 'flex-start'}}>
                                <TextArea rows={5} placeholder="备注" maxLength={200} value={comment} onChange={(e) => setComment(e.target.value)}/>
                            </div>
                        </Col>
                    </Row>
                </Space>
            </div>
        </Modal>
    );
};
 
export default TeaTypeNewModal;